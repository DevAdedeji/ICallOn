"use server"

import { db } from "@/src/db";
import { answers, players, rounds } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export interface PlayerScore {
    playerId: string
    playerName: string
    totalPoints: number
    position: number
    roundScores: {
        roundNumber: number
        points: number
        letter: string
    }[]
}

export async function calculateLeaderboard(roomId: string) {
    try {
        // Get all players in the room
        const roomPlayers = await db.query.players.findMany({
            where: eq(players.room_id, roomId)
        })

        if (!roomPlayers || roomPlayers.length === 0) {
            return {
                success: false,
                error: "No players found",
                leaderboard: null
            }
        }

        // Get all rounds for this room
        const roomRounds = await db.query.rounds.findMany({
            where: eq(rounds.room_id, roomId),
            orderBy: (rounds, { asc }) => [asc(rounds.round_number)]
        })

        // Get all answers for this room
        const roomAnswers = await db.query.answers.findMany({
            where: eq(answers.room_id, roomId)
        })

        // Calculate scores for each player
        const playerScores: PlayerScore[] = roomPlayers.map(player => {
            // Get all answers for this player
            const playerAnswers = roomAnswers.filter(a => a.player_id === player.id)

            // Calculate round-by-round scores
            const roundScores = roomRounds.map(round => {
                const roundAnswer = playerAnswers.find(a => a.round_id === round.id)
                const points = roundAnswer?.points_earned ?? 0

                return {
                    roundNumber: round.round_number,
                    points,
                    letter: round.letter
                }
            })

            // Calculate total points
            const totalPoints = roundScores.reduce((sum, rs) => sum + rs.points, 0)

            return {
                playerId: player.id,
                playerName: player.display_name,
                totalPoints,
                position: 0, // Will assign below
                roundScores
            }
        })

        // Sort by total points (descending) and assign positions
        playerScores.sort((a, b) => b.totalPoints - a.totalPoints)

        let currentPosition = 1
        let previousPoints = -1
        let playersAtSameRank = 0

        playerScores.forEach((player, index) => {
            if (player.totalPoints === previousPoints) {
                // Same score as previous player - same position
                player.position = currentPosition
                playersAtSameRank++
            } else {
                // Different score - new position
                currentPosition += playersAtSameRank
                player.position = currentPosition
                previousPoints = player.totalPoints
                playersAtSameRank = 1
            }
        })

        return {
            success: true,
            leaderboard: playerScores
        }
    } catch (error) {
        console.error("Calculate leaderboard error:", error)
        return {
            success: false,
            error: "Failed to calculate leaderboard",
            leaderboard: null
        }
    }
}

export async function updatePlayerTotalScores(roomId: string) {
    try {
        const result = await calculateLeaderboard(roomId)

        if (!result.success || !result.leaderboard) {
            return { success: false, error: result.error }
        }

        // Update each player's total score in the database
        for (const playerScore of result.leaderboard) {
            await db
                .update(players)
                .set({
                    totalScore: playerScore.totalPoints
                })
                .where(eq(players.id, playerScore.playerId))
        }

        return { success: true }
    } catch (error) {
        console.error("Update player scores error:", error)
        return { success: false, error: "Failed to update scores" }
    }
}