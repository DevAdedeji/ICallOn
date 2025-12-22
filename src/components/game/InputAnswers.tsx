"use client"
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Player, Room, Round } from "@/src/db/schema";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { savePlayerAnswers, fetchPlayerAnswers, submitPlayerAnswers } from "@/src/actions/answers";
import { toast } from "sonner";
import { finalizeRound } from "@/src/actions/rounds";
import ReviewAnswers from "./ReviewAnswers";

export default function InputAnswers({ room, round, player, isHost }: { room: Room, round: Round, player?: Player, isHost: boolean }) {

    const playerId = player?.id
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        const loadAnswers = async () => {
            if (!playerId || !round.id) return

            const result = await fetchPlayerAnswers(playerId, round.id, room.id)
            if (result.success && result.answers) {
                setAnswers({
                    name: result.answers.name ?? '',
                    animal: result.answers.animal ?? '',
                    place: result.answers.place ?? '',
                    things: result.answers.thing ?? '',
                })
                if (result.answers.submitted_at) {
                    setIsSubmitted(true)
                }
            }
        }

        loadAnswers()
    }, [playerId, round.id, room.id])

    const [answers, setAnswers] = useState({ name: '', animal: '', place: '', things: '' })
    const debouncedAnswers = useDebounce(answers, 1000)

    useEffect(() => {
        if (!playerId || !round.id || isSubmitted) return

        // Auto-save to database
        savePlayerAnswers({
            playerId,
            roundId: round.id,
            roomId: room.id,
            answers: debouncedAnswers,
            player_name: player.display_name
        })
    }, [debouncedAnswers, playerId, round.id, room.id, isSubmitted, player?.display_name])

    const hasFinalizedRound = useRef(false)


    const getTimeLeft = useCallback(() => {
        if (!round.startedAt) return room.timePerRound

        const startTime = new Date(round.startedAt).getTime()
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - startTime) / 1000)
        return Math.max(0, room.timePerRound - elapsedSeconds)
    }, [round.startedAt, room.timePerRound])

    const [timeLeft, setTimeLeft] = useState(getTimeLeft)
    const [loading, setIsLoading] = useState(false)
    const hasSubmitted = useRef(false)

    const handleSubmit = useCallback(async () => {
        if (hasSubmitted.current || !playerId) return

        try {
            setIsLoading(true)
            const timeTaken = room.timePerRound - timeLeft
            const result = await submitPlayerAnswers(
                playerId,
                round.id,
                timeTaken,
                room.id,
                debouncedAnswers,
                player.display_name
            )
            if (result.success) {
                setIsSubmitted(true)
                toast.success("Answers submitted!")
                hasSubmitted.current = true
                if (isHost) {
                    finalizeRound(round.id)
                }
            } else {
                hasSubmitted.current = false
                toast.error("Failed to submit answers")
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }

    }, [hasSubmitted, playerId, round.id, room.id, debouncedAnswers, timeLeft, room.timePerRound, player?.display_name, isHost])

    useEffect(() => {
        setTimeLeft(getTimeLeft())
    }, [round.startedAt, getTimeLeft])

    useEffect(() => {
        if (isSubmitted) return

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) return 0
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isSubmitted])

    const isUrgent = timeLeft <= 10
    const isCritical = timeLeft <= 5

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        if (timeLeft !== 0) return
        if (round.status !== "submitted" && !hasSubmitted.current && playerId) {
            handleSubmit()
        }
        if (isHost && !hasFinalizedRound.current) {
            hasFinalizedRound.current = true
            finalizeRound(round.id)
        }
    }, [timeLeft, isHost, playerId, handleSubmit, round.id, round.status])


    if (round.status === "active" && !isSubmitted) {
        return (
            <div className="space-y-8">

                <div className="flex flex-col items-center justify-center">
                    <h1>Current Letter</h1>
                    <p className="capitalize font-bold text-9xl">{round.letter}</p>
                </div>

                <div className={`text-center mb-6 transition-all ${isCritical ? 'animate-pulse' : ''
                    }`}>
                    <p className="text-sm text-gray-400 mb-2">Time Remaining</p>
                    <p className={`text-5xl font-black ${isCritical ? 'text-red-500' :
                        isUrgent ? 'text-yellow-500' :
                            'text-primary'
                        }`}>
                        {formatTime(timeLeft)}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Name" value={answers.name} onChange={(e) => setAnswers(prev => ({ ...prev, name: e.target.value }))}
                            disabled={loading} />
                        <Input placeholder="Animal" value={answers.animal} onChange={(e) => setAnswers(prev => ({ ...prev, animal: e.target.value }))}
                            disabled={loading} />
                        <Input placeholder="Place" value={answers.place}
                            onChange={(e) => setAnswers(prev => ({ ...prev, place: e.target.value }))}
                            disabled={loading} />
                        <Input placeholder="Things" value={answers.things}
                            onChange={(e) => setAnswers(prev => ({ ...prev, things: e.target.value }))}
                            disabled={loading} />
                    </div>
                    <Button type="submit" variant="primary" loading={loading} disabled={loading}>SUBMIT</Button>
                </form>
            </div>
        )
    }

    if (round.status === "submitted" || isSubmitted) {
        return isHost ? <ReviewAnswers round={round} player={player} /> :
            <div className="space-y-8">
                <div className="glass-panel rounded-2xl p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <svg className="size-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Answers Submitted!</h2>
                            <p className="text-gray-400">Waiting for host!</p>
                        </div>
                    </div>
                </div>
            </div>
    }

    if (round.status === "ended") {
        return (
            <div className="space-y-8">
                <div className="glass-panel rounded-2xl p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <svg className="size-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Round Complete!</h2>
                            <p className="text-gray-400">
                                {isHost ? "Starting next round..." : "Waiting for next round..."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}