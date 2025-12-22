"use client"
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useState, useTransition } from "react";
import { createOrGetPlayer } from "@/src/actions/players";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JoinForm({ roomId }: { roomId: string }) {
    const [name, setName] = useState('')
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!name.trim()) {
            setError("Please enter a username")
            return
        }

        startTransition(async () => {
            try {
                const result = await createOrGetPlayer({
                    roomId,
                    displayName: name.trim(),
                    userId: null,
                    isHost: false,
                })

                if (!result.success) {
                    setError(result.error || "Failed to join game")
                    toast.error(result.error || "Failed to join game")
                    return
                }
                toast.success("Joined successfully!")
                router.refresh()
            } catch (err) {
                console.error("Join error:", err)
                setError("An unexpected error occurred")
                toast.error("Failed to join game")
            }
        })
    }

    return (
        <div className="w-full max-w-110 glass-panel rounded-2xl px-4 py-8 md:p-10 animate-float flex flex-col gap-4">
            <h2 className="text-2xl text-center font-extrabold tracking-tight text-white">
                Ready to <span className="text-primary">Play?</span>
            </h2>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="pt-2 flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Username"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={isPending}
                        maxLength={20}
                    />
                    {error && (
                        <p className="text-red-500 text-sm font-medium -mt-2">
                            {error}
                        </p>
                    )}
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isPending || !name.trim()}
                        loading={isPending}
                    >
                        Join Game
                    </Button>
                </div>
            </form>
        </div>
    )
}