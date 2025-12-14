'use server'

import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { db } from "@/src/db";
import { rooms } from "@/src/db/schema";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

function generateRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let code = ""
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

export async function createRoom(maxRounds: number, timePerRound: number) {
    try {
        const supabase = await createSupabaseServerClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { error: "Unauthorized", success: false }
        }

        if (![3, 5, 7, 10].includes(maxRounds)) {
            return { error: "Invalid rounds value", success: false }
        }

        if (![30, 60, 90, 120].includes(timePerRound)) {
            return { error: "Invalid timer value", success: false }
        }

        let roomCode = generateRoomCode()
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts) {
            const existing = await db.query.rooms.findFirst({
                where: (rooms, { eq }) => eq(rooms.code, roomCode)
            })

            if (!existing) break
            roomCode = generateRoomCode()
            attempts++
        }

        if (attempts === maxAttempts) {
            return { error: "Failed to generate unique code", success: false }
        }

        const roomId = nanoid()
        const [room] = await db.insert(rooms).values({
            id: roomId,
            code: roomCode,
            hostId: user.id,
            maxRounds,
            timePerRound,
            status: "lobby"
        }).returning()

        revalidatePath("/dashboard")

        return {
            success: true,
            room: {
                id: room.id,
                code: room.code,
                maxRounds: room.maxRounds,
                timePerRound: room.timePerRound
            }
        }

    } catch (error) {
        console.error("Room creation error:", error)
        return { error: "Failed to create room", success: false }
    }
}