"use client"
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useState } from "react";
import { toast } from "sonner";
import { Round } from "@/src/db/schema";
import { startRound } from "@/src/actions/rounds";

interface ChooseLetterProps {
    onRoundStarted: (updatedRount: Round) => void
    roomId: string
    roundNumber: number
}

export default function ChooseLetter({ onRoundStarted, roomId, roundNumber }: ChooseLetterProps) {
    const [letter, setLetter] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPending, setPending] = useState(false)

    const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase()
        if (value === '' || /^[A-Z]$/.test(value)) {
            setLetter(value)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!letter.trim()) {
            setError("Please enter a letter")
            return
        }

        try {
            setPending(true)
            const updatedRound = await startRound(roomId, roundNumber, letter)
            if (updatedRound.round) {
                onRoundStarted(updatedRound.round)
            }
        } catch (err) {
            console.error("Create round error:", err)
            setError("An unexpected error occurred")
            toast.error("Failed to start round")
        } finally {
            setPending(false)
        }
    }

    return (
        <div className="w-full max-w-110 glass-panel rounded-2xl p-8 md:p-10 animate-float flex flex-col gap-4">
            <h2 className="text-2xl text-center font-extrabold tracking-tight text-white">
                Input <span
                    className="text-primary">Letter</span>
            </h2>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="pt-2 flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Enter a letter (A-Z)"
                        required
                        value={letter}
                        onChange={handleLetterChange}
                        disabled={isPending}
                        maxLength={1}
                        className="text-center text-2xl font-bold uppercase"
                        autoFocus
                    />
                    {error && (
                        <p className="text-red-500 text-sm font-medium -mt-2">
                            {error}
                        </p>
                    )}
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isPending || !letter.trim()}
                        loading={isPending}
                    >
                        Start round
                    </Button>
                </div>
            </form>
        </div>
    )
}