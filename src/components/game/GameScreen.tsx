"use client"
import { Player, Room, Round, User } from "@/src/db/schema";
import type { User as LoggedInUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import ChooseLetter from "./ChooseLetter";
import InputAnswers from "./InputAnswers";
import { supabase } from "@/src/lib/supabase/client";
import { fetchRoundById } from "@/src/actions/rounds";
import { updateRoomStatus } from "@/src/actions/rooms";

export default function GameScreen({ host, room, user, player, players }: { host?: User, room: Room, user?: LoggedInUser, player?: Player, players: Player[] }) {
    const isHost = user?.id === room.hostId
    const roomId = room.id
    const [round, setRound] = useState<Partial<Round> | null>(null)
    const [currentRound, setCurrentRound] = useState<number>(1)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const channel = supabase
            .channel(`room-${roomId}-round-${currentRound}`)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "rounds",
                filter: `room_id=eq.${roomId}`
            }, (payload) => {
                const newRound = payload.new
                if (newRound.round_number === currentRound) {
                    setRound(newRound)
                }
            })
            .on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "rounds",
                filter: `room_id=eq.${roomId}`
            }, (payload) => {
                const updatedRound = payload.new
                if (updatedRound.round_number === currentRound) {
                    setRound(updatedRound)
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, currentRound])

    useEffect(() => {
        const initializeRound = async () => {
            if (!room.currentRoundId) {
                setRound({
                    room_id: room.id,
                    round_number: 1,
                    status: "pending",
                    letter: ""
                })
                return
            }

            // Fetch current round if currentRoundId exists
            setLoading(true)
            const result = await fetchRoundById(room.currentRoundId)
            if (result.success && result.round) {
                setRound(result.round)
            }
            setLoading(false)
        }

        initializeRound()
    }, [room.currentRoundId, room.id])


    useEffect(() => {
        if (round?.status !== "ended") return;
        if (currentRound >= room.maxRounds && isHost) {
            updateRoomStatus(room.id, "ended")
            return;
        };
        const startNextRound = () => {
            setCurrentRound(prev => prev + 1)
            setRound(prev => ({
                ...prev,
                round_number: prev?.round_number ? prev.round_number + 1 : currentRound + 1,
                status: "pending",
                letter: ""
            }))

        }
        startNextRound();
    }, [round?.status, isHost, currentRound, room.id, room.maxRounds]);


    if (loading) {
        return (
            <main className="flex flex-1 items-center justify-center p-4 w-full">
                <p>Loading round...</p>
            </main>
        )
    }

    return (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
            {
                isHost && round?.status == "pending" && (<ChooseLetter onRoundStarted={(updatedRound) => setRound(updatedRound)} roomId={roomId} roundNumber={currentRound} />)
            }
            {
                !isHost && round?.status === "pending" && (<p>Please wait while the host selects a letter</p>)
            }
            {
                round?.id && (round?.status === "active" || round?.status === "submitted") && (<InputAnswers room={room as Room} round={round as Round} player={player as Player} isHost={isHost} />)
            }
        </main>
    )
}