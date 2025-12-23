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
    player_name: string
}) {
    try {
        const { playerId, roundId, answers: answerData, roomId, player_name } = data

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
                    player_name,
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
    },
    player_name: string
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
                    player_name,
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

export async function fetchRoundAnswers(roundId: string) {
    try {
        const answer = await db.query.answers.findMany({
            where: and(
                eq(answers.round_id, roundId),
            )
        })

        return {
            success: true,
            answers: answer || null,
        }
    } catch (error) {
        console.error("Fetch answers error:", error)
        return {
            success: false,
            error: "Failed to fetch answers",
            answers: null
        }
    }
}

type AnswerValidation = {
    id: string;
    name_valid: boolean;
    animal_valid: boolean;
    place_valid: boolean;
    thing_valid: boolean;
    points_earned: number;
};

export async function confirmRoundAnswers(
    validatedAnswers: AnswerValidation[]
) {
    try {
        await db.transaction(async (tx) => {
            for (const answer of validatedAnswers) {
                await tx
                    .update(answers)
                    .set({
                        name_valid: answer.name_valid,
                        animal_valid: answer.animal_valid,
                        place_valid: answer.place_valid,
                        thing_valid: answer.thing_valid,
                        points_earned: answer.points_earned,
                        validated_at: new Date(),
                        updated_at: new Date(),
                    })
                    .where(eq(answers.id, answer.id));
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Confirm round answers error:", error);
        return {
            success: false,
            error: "Failed to confirm round answers",
        };
    }
}

export async function updateAnswerValidation(
    answerId: string,
    category: "name" | "animal" | "place" | "thing",
    valid: boolean
) {
    try {
        const updateData = {
            [`${category}_valid`]: valid,
            updated_at: new Date(),
            points_earned: 0,
        }

        // Also recalculate points
        const answer = await db.query.answers.findFirst({
            where: eq(answers.id, answerId)
        })

        if (answer) {
            const POINTS_PER_ANSWER = 10
            let points = 0
            if (category === "name") points = valid ? POINTS_PER_ANSWER : 0
            else if (answer.name_valid) points += POINTS_PER_ANSWER

            if (category === "animal") points += valid ? POINTS_PER_ANSWER : 0
            else if (answer.animal_valid) points += POINTS_PER_ANSWER

            if (category === "place") points += valid ? POINTS_PER_ANSWER : 0
            else if (answer.place_valid) points += POINTS_PER_ANSWER

            if (category === "thing") points += valid ? POINTS_PER_ANSWER : 0
            else if (answer.thing_valid) points += POINTS_PER_ANSWER

            updateData.points_earned = points
        }

        const [result] = await db
            .update(answers)
            .set(updateData)
            .where(eq(answers.id, answerId))
            .returning()

        return { success: true, answer: result }
    } catch (error) {
        console.error("Update answer validation error:", error)
        return {
            success: false,
            error: "Failed to update validation"
        }
    }
}