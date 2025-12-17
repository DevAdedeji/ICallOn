"use client"
import { Room, Round, User } from "@/src/db/schema";
import type { User as LoggedInUser } from "@supabase/supabase-js";
import { useEffect, useState, useRef, useCallback } from "react";
import ChooseLetter from "./ChooseLetter";
import InputAnswers from "./InputAnswers";
import { supabase } from "@/src/lib/supabase/client";
import { fetchRoundById } from "@/src/actions/rounds";

export default function GameScreen({ host, room, user, playerId }: { host?: User, room: Room, user?: LoggedInUser, playerId?: string }) {
    const isHost = playerId === room.hostId
    const roomId = room.id
    const [round, setRound] = useState<Partial<Round> | null>({
        room_id: roomId,
        round_number: 1,
        status: "pending",
        letter: ""
    })
    const [currentRound, setCurrentRound] = useState<number>(1)

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


    return (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
            {
                isHost && round?.status == "pending" ? <ChooseLetter onRoundStarted={(updatedRound) => setRound(updatedRound)} roomId={roomId} roundNumber={currentRound} /> : <></>
            }
            {
                !isHost && round?.status === "pending" ? <p>Please wait while the host selects a letter</p> : <></>
            }
            {
                round?.status === "active" ? <InputAnswers /> : <></>
            }
        </main>
    )
}