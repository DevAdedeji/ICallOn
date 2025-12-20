"use server"

import { db } from "@/src/db"
import { answers } from "@/src/db/schema"
import { eq, and } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function fetchPlayerAnswers(playerId: string, roundId: string, roomId: string) {
    try {
        const answer = await db.query.answers.findFirst({
            where: and(
                eq(answers.player_id, playerId),
                eq(answers.round_id, roundId),
                eq(answers.room_id, roomId)
            )
        })

        return {
            success: true,
            answers: answer || null,
        }
    } catch (error) {
        console.error("Fetch player answers error:", error)
        return {
            success: false,
            error: "Failed to fetch answers",
            answers: null
        }
    }
}

export async function savePlayerAnswers(data: {
    playerId: string
    roundId: string
    answers: {
        name?: string
        animal?: string
        place?: string
        thing?: string
    }
    roomId: string
}) {
    try {
        const { playerId, roundId, answers: answerData, roomId } = data

        const existing = await db.query.answers.findFirst({
            where: and(
                eq(answers.player_id, playerId),
                eq(answers.round_id, roundId),
                eq(answers.room_id, roomId)
            )
        })

        let result

        if (existing) {
            // Update existing
            [result] = await db
                .update(answers)
                .set({
                    name: answerData.name || null,
                    animal: answerData.animal || null,
                    place: answerData.place || null,
                    thing: answerData.thing || null,
                    updated_at: new Date(),
                })
                .where(and(
                    eq(answers.player_id, playerId),
                    eq(answers.round_id, roundId)
                ))
                .returning()
        } else {
            // Insert new
            const answerId = nanoid();
            [result] = await db
                .insert(answers)
                .values({
                    id: answerId,
                    room_id: roomId,
                    player_id: playerId,
                    round_id: roundId,
                    name: answerData.name || null,
                    animal: answerData.animal || null,
                    place: answerData.place || null,
                    thing: answerData.thing || null,
                })
                .returning()
        }

        return { success: true, answers: result }
    } catch (error) {
        console.error("Save player answers error:", error)
        return {
            success: false,
            error: "Failed to save answers",
            answers: null
        }
    }
}

export async function submitPlayerAnswers(
    playerId: string,
    roundId: string,
    timeTaken: number,
    roomId: string,
    answerData: {
        name?: string
        animal?: string
        place?: string
        thing?: string
    }
) {
    try {
        let [result] = await db
            .update(answers)
            .set({
                submitted_at: new Date(),
                time_taken: timeTaken,
                updated_at: new Date(),
            })
            .where(and(
                eq(answers.player_id, playerId),
                eq(answers.round_id, roundId),
                eq(answers.room_id, roomId)
            ))
            .returning()

        if (!result) {
            const answerId = nanoid();
            [result] = await db
                .insert(answers)
                .values({
                    id: answerId,
                    room_id: roomId,
                    player_id: playerId,
                    round_id: roundId,
                    name: answerData.name || null,
                    animal: answerData.animal || null,
                    place: answerData.place || null,
                    thing: answerData.thing || null,
                })
                .returning()
        }

        return { success: true, answers: result }
    } catch (error) {
        console.error("Submit player answers error:", error)
        return {
            success: false,
            error: "Failed to submit answers"
        }
    }
}