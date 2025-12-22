"use client"

import { useEffect, useState } from "react"
import { calculateLeaderboard, PlayerScore } from "@/src/actions/leaderboard"
import { Room, Player } from "@/src/db/schema"
import { Trophy, Medal, Crown, Star } from "lucide-react"
import Button from "../ui/Button"

export default function Leaderboard({
    room,
    player,
}: {
    room: Room,
    player?: Player,
}) {
    const [leaderboard, setLeaderboard] = useState<PlayerScore[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadLeaderboard = async () => {
            setIsLoading(true)
            const result = await calculateLeaderboard(room.id)

            if (result.success && result.leaderboard) {
                setLeaderboard(result.leaderboard)
            }
            setIsLoading(false)
        }

        loadLeaderboard()
    }, [room.id])

    const getPositionIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Crown className="text-yellow-400" size={24} />
            case 2:
                return <Medal className="text-gray-400" size={24} />
            case 3:
                return <Medal className="text-amber-600" size={24} />
            default:
                return <Star className="text-gray-600" size={20} />
        }
    }

    const getPositionColor = (position: number) => {
        switch (position) {
            case 1:
                return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50"
            case 2:
                return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50"
            case 3:
                return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50"
            default:
                return "bg-white/5 border-white/10"
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-400 font-semibold">Calculating results...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full">
            <div className="w-full max-w-4xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <Trophy className="text-primary" size={48} />
                        <h1 className="text-5xl font-black text-white tracking-tight">Final Results</h1>
                        <Trophy className="text-primary" size={48} />
                    </div>
                    <p className="text-gray-400 text-lg">Game Complete! Here&apos;s how everyone did.</p>
                </div>

                {/* Leaderboard */}
                <div className="space-y-4">
                    {leaderboard.map((playerScore, index) => (
                        <div
                            key={playerScore.playerId}
                            className={`glass-panel p-6 rounded-2xl border-2 transition-all ${getPositionColor(playerScore.position)} ${player?.id === playerScore.playerId ? 'ring-2 ring-primary' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                {/* Position & Name */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex items-center justify-center size-12">
                                        {getPositionIcon(playerScore.position)}
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-white">
                                                {playerScore.playerName}
                                            </span>
                                            {player?.id === playerScore.playerId && (
                                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                                    YOU
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-400">
                                            Position #{playerScore.position}
                                        </span>
                                    </div>
                                </div>

                                {/* Round Breakdown */}
                                <div className="hidden md:flex items-center gap-2">
                                    {playerScore.roundScores.map((rs) => (
                                        <div
                                            key={rs.roundNumber}
                                            className="flex flex-col items-center bg-white/5 px-3 py-2 rounded-lg"
                                        >
                                            <span className="text-xs text-gray-500 uppercase">
                                                {rs.letter}
                                            </span>
                                            <span className="text-sm font-bold text-white">
                                                {rs.points}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Total Score */}
                                <div className="flex flex-col items-end">
                                    <span className="text-sm text-gray-400 uppercase tracking-wider">
                                        Total
                                    </span>
                                    <span className="text-4xl font-black text-primary">
                                        {playerScore.totalPoints}
                                    </span>
                                </div>
                            </div>

                            {/* Mobile Round Breakdown */}
                            <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                                <div className="grid grid-cols-4 gap-2">
                                    {playerScore.roundScores.map((rs) => (
                                        <div
                                            key={rs.roundNumber}
                                            className="flex flex-col items-center bg-white/5 px-2 py-2 rounded"
                                        >
                                            <span className="text-xs text-gray-500">
                                                {rs.letter}
                                            </span>
                                            <span className="text-sm font-bold text-white">
                                                {rs.points}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Winner Celebration */}
                {leaderboard.length > 0 && leaderboard[0] && (
                    <div className="glass-panel p-8 rounded-2xl text-center bg-linear-to-r from-primary/10 to-green-600/10 border-2 border-primary/30">
                        <h2 className="text-3xl font-black text-white mb-2">
                            🎉 Congratulations {leaderboard[0].playerName}! 🎉
                        </h2>
                        <p className="text-gray-400">
                            You won with {leaderboard[0].totalPoints} points!
                        </p>
                    </div>
                )}
                <div className="flex justify-center gap-4">
                    <Button variant="primary" href="/">
                        Create New Game
                    </Button>
                </div>
            </div>
        </div>
    )
}