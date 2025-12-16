"use client"

import { useEffect, useRef } from "react";
import { createOrGetPlayer } from "@/src/actions/players";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
    roomId: string
    displayName: string
    userId: string
    isHost: boolean
}

export default function JoinExecutor({
    roomId,
    displayName,
    userId,
    isHost,
}: Props) {
    const router = useRouter()
    const attemptedRef = useRef(false)

    useEffect(() => {
        if (attemptedRef.current) return
        attemptedRef.current = true

        const joinRoom = async () => {
            try {
                const result = await createOrGetPlayer({
                    roomId,
                    displayName,
                    userId,
                    isHost,
                })

                if (!result.success) {
                    toast.error(result.error || "Failed to join room")
                    return
                }

                await new Promise(resolve => setTimeout(resolve, 100))

                router.refresh()
            } catch (error) {
                console.error("Auto-join error:", error)
                toast.error("Failed to join room")
            }
        }

        joinRoom()
    }, [roomId, displayName, userId, isHost, router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center gap-4">
                <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <p className="text-white font-semibold">Joining room...</p>
            </div>
        </div>
    )
}