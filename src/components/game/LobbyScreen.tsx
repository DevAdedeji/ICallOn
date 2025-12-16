"use client"

import { Room, User } from "@/src/db/schema";
import type { User as LoggedInUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react"
import { Copy, Timer, RotateCw, Settings, Users, Play, User as UserIcon } from "lucide-react";
import { copyToClipboard } from "@/src/lib/utils";
import { toast } from "sonner";
import Button from "../ui/Button";
import { supabase } from "@/src/lib/supabase/client";
import { Player } from "@/src/db/schema";
import { updateRoomStatus } from "@/src/actions/rooms";
import { useRouter } from "next/navigation";

export default function LobbyScreen({ host, room, user, playerId }: { host?: User, room: Room, user?: LoggedInUser, playerId?: string }) {

    const [players, setPlayers] = useState<Player[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isStarting, setIsStarting] = useState(false)

    const shareLink = `/play/${room.id}`
    const copyGameLink = async () => {
        const success = await copyToClipboard(shareLink)
        if (success) {
            toast.success("Share link copied!")
        } else {
            toast.error("Failed to copy link")
        }
    }

    const roomId = room.id

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
                    event: "INSERT",
                    schema: "public",
                    table: "players",
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    console.log(payload)
                    if (isMounted) {
                        setPlayers(prev => {
                            if (prev.some(p => p.id === payload.new.id)) {
                                console.log("⚠️ Duplicate player prevented:", payload.new.id)
                                return prev
                            }
                            console.log("➕ Adding new player:", payload.new)
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
                    console.log("Subscribed to lobby updates")
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


    const showStartButton = playerId === room.hostId && players.length > 1

    const router = useRouter()

    useEffect(() => {
        const channel = supabase.channel(`room-${roomId}-status`)
            .on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "rooms",
                filter: `id=eq.${roomId}`
            }, (payload) => {
                const newStatus = payload.new.status

                if (newStatus === "playing") {
                    router.refresh()
                }
            }).subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, router])

    const startGame = async () => {
        setIsStarting(true)

        const result = await updateRoomStatus(roomId, "playing")

        if (result?.success) {
            router.refresh()
        } else {
            toast.error(result?.error ?? "Failed to start game")
        }

        setIsStarting(false)
    }

    return (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
            <div className="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-10 py-8 max-w-360 mx-auto gap-8">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 glass-panel p-8 rounded-3xl neon-glow">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Lobby</h1>
                        <p className="text-gray-400 text-base md:text-lg font-medium max-w-md">The game is about to begin. Share the code with your friends!</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-xs font-bold uppercase tracking-widest text-primary/80">Room Code</div>
                        <div className="flex items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <div className="absolute -inset-1 bg-linear-to-r from-primary to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                                <div className="relative px-8 py-3 bg-[#1a2418] rounded-xl border border-primary/30 flex items-center justify-center">
                                    <span className="text-5xl font-black text-white tracking-[0.2em] neon-text-shadow font-mono">{room.code}</span>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-primary transition-colors" onClick={copyGameLink}>
                            <Copy />
                            Copy Invite Link
                        </button>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-6 w-full flex-1">
                    <div className="flex flex-col gap-4 flex-2 min-w-0">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Users className="text-primary" />
                                Players
                                <span className="text-gray-500 text-lg ml-1 font-medium">{players.length}</span>
                            </h3>
                        </div>
                        {isLoading ? (
                            <div className="text-center text-gray-400 py-8">Loading players...</div>
                        ) : players.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">Waiting for players to join...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {players.map((player) => (
                                    <div key={player.id} className="glass-panel p-4 rounded-2xl border border-primary/30 flex items-center justify-between group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="size-14 rounded-full bg-gray-700 overflow-hidden border-2 border-primary/20 flex items-center justify-center">
                                                    <UserIcon />
                                                </div>
                                                <div className="absolute bottom-0 right-0 size-4 bg-primary rounded-full border-2 border-[#131811] shadow-[0_0_8px_rgba(70,236,19,0.8)] animate-pulse"></div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-white leading-tight">{player.display_name}</span>
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded w-fit mt-1">
                                                    {room.hostId === player?.user_id ? "Host" : "Player"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Game settings */}
                    <div className="flex flex-col gap-4 flex-1 min-w-75">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Settings className="text-gray-400" />
                                Game Settings
                            </h3>
                        </div>
                        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-white/80">
                                    <RotateCw />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-400 font-medium">Rounds</span>
                                    <span className="text-2xl font-bold text-white">{room.maxRounds}</span>
                                </div>
                            </div>
                            <div className="w-full h-px bg-white/5"></div>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-white/80">
                                    <Timer />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-400 font-medium">Time Limit</span>
                                    <span className="text-2xl font-bold text-white">{room.timePerRound}s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showStartButton && (
                    <div className="w-full flex items-center justify-end">
                        <Button
                            variant="primary"
                            className="md:w-auto"
                            disabled={players.length === 0 || isStarting}
                            onClick={startGame}
                            loading={isStarting}
                        >
                            <Play />
                            Start Game
                        </Button>
                    </div>
                )}
            </div>
        </main>
    )
}