'use server'

import { db } from "@/src/db";
import { rounds, rooms } from "@/src/db/schema";
import { nanoid } from "nanoid";
import { eq, } from "drizzle-orm";

export async function startRound(roomId: string, roundNumber: number, letter: string,) {
    try {
        if (!letter.trim()) {
            return { success: false, error: "Letter cannot be empty" }
        }

        const existingRound = await db.query.rounds.findFirst({
            where: (rounds, { eq, and }) => and(
                eq(rounds.room_id, roomId),
                eq(rounds.round_number, roundNumber)
            )
        })

        let updatedRound

        if (existingRound) {
            const [round] = await db.update(rounds)
                .set({
                    letter: letter.toUpperCase(),
                    status: "active",
                    startedAt: new Date()
                })
                .where(eq(rounds.id, existingRound.id))
                .returning()
            updatedRound = round
        } else {
            const id = nanoid()
            const [round] = await db.insert(rounds)
                .values({
                    id,
                    room_id: roomId,
                    round_number: roundNumber,
                    letter: letter.toUpperCase(),
                    status: "active",
                    startedAt: new Date()
                })
                .returning()
            updatedRound = round
        }

        await db
            .update(rooms)
            .set({
                currentRoundId: updatedRound.id,
                currentRound: roundNumber
            })
            .where(eq(rooms.id, roomId))

        return { success: true, round: updatedRound }

    } catch (error) {
        console.error("Failed to start round:", error)
        return { success: false, error: "Failed to start round" }
    }
}


export async function fetchRoundById(roundId: string) {
    try {
        const round = await db.query.rounds.findFirst({
            where: eq(rounds.id, roundId)
        })

        if (!round) {
            return { success: false, error: "Round not found", round: null }
        }

        return { success: true, round }
    } catch (error) {
        console.error("Fetch round error:", error)
        return { success: false, error: "Failed to fetch round", round: null }
    }
}

export async function finalizeRound(roundId: string) {
    try {
        const [updated] = await db
            .update(rounds)
            .set({
                status: "submitted",
                endedAt: new Date(),
            })
            .where(eq(rounds.id, roundId))
            .returning()

        if (!updated) {
            throw new Error("Round not found")
        }

        return { success: true, round: updated }
    } catch (error) {
        console.error("Failed to finalize round:", error)
        return { success: false, error: "Failed to finalize round" }
    }
}

export async function endRound(roundId: string) {
    try {
        const [updated] = await db
            .update(rounds)
            .set({
                status: "ended",
                endedAt: new Date(),
            })
            .where(eq(rounds.id, roundId))
            .returning()

        if (!updated) {
            throw new Error("Round not found")
        }

        return { success: true, round: updated }
    } catch (error) {
        console.error("Failed to end round:", error)
        return { success: false, error: "Failed to end round" }
    }
}