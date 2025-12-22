"use client"

import { Room, Player } from "@/src/db/schema";
import type { User as LoggedInUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { supabase } from "@/src/lib/supabase/client";
import GameScreen from "./GameScreen";
import LobbyScreen from "./LobbyScreen";
import Leaderboard from "./Leaderboard";

export const GameContainer = ({ room: initialRoom, user, player }: { room: Room, user?: LoggedInUser, player?: Player }) => {

    const roomId = initialRoom.id
    const [room, setRoom] = useState<Room>(initialRoom)
    const [players, setPlayers] = useState<Player[]>([])
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        let isMounted = true

        const fetchPlayers = async () => {
            const { data, error } = await supabase
                .from("players")
                .select("*")
                .eq("room_id", roomId)

            if (error) {
                console.error("Failed to fetch players:", error)
                toast.error("Failed to load players")
            } else if (isMounted) {
                setPlayers(data ?? [])
            }
            setIsLoading(false)
        }

        fetchPlayers()

        const channel = supabase
            .channel(`room-${roomId}-lobby`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "rooms",
                    filter: `id=eq.${roomId}`
                },
                (payload) => {
                    if (isMounted) {
                        const updatedRoom = payload.new as Room
                        setRoom(updatedRoom)
                        if (updatedRoom.status === 'ended') {
                            toast.info('Game has ended!')
                        } else if (updatedRoom.status === 'playing') {
                            toast.success('Game started!')
                        }
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "players",
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    if (isMounted) {
                        setPlayers(prev => {
                            if (prev.some(p => p.id === payload.new.id)) {
                                return prev
                            }
                            return [...prev, payload.new as Player]
                        })
                        toast.success(`${(payload.new as Player).display_name} joined!`)
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "players",
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    if (isMounted) {
                        setPlayers(prev =>
                            prev.map(p => p.id === payload.new.id ? payload.new as Player : p)
                        )
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "players",
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    if (isMounted) {
                        setPlayers(prev => prev.filter(p => p.id !== payload.old.id))
                        toast.info(`${(payload.old as Player).display_name} left`)
                    }
                }
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    //
                } else if (status === "CHANNEL_ERROR") {
                    console.error("Subscription error")
                    toast.error("Real-time connection failed")
                }
            })

        return () => {
            isMounted = false
            supabase.removeChannel(channel)
        }
    }, [roomId])


    switch (room.status) {
        case "lobby":
            return (
                <LobbyScreen
                    room={initialRoom as Room}
                    user={user ?? undefined}
                    player={player}
                    players={players}
                    isLoading={isLoading}
                />
            )
        case "playing":
            return (
                <GameScreen
                    room={initialRoom as Room}
                    user={user as LoggedInUser}
                    player={player as Player}
                    players={players as Player[]}
                />
            )
        case "ended":
            return (
                <Leaderboard room={room}
                    player={player} />
            )
        default:
            return (
                <main className="flex items-center justify-center h-screen">
                    <div className="glass-panel rounded-2xl p-8 text-center">
                        <h1 className="text-2xl font-bold text-yellow-500 mb-2">Unknown Status</h1>
                        <p className="text-gray-400">This room is in an unknown state: {room.status}</p>
                    </div>
                </main>
            )
    }

}