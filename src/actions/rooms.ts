'use server'

import { getSupabaseServerClient } from "@/src/lib/supabase/server";
import { db } from "@/src/db";
import { rooms } from "@/src/db/schema";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

type RoomStatus = "lobby" | "playing" | "ended";

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
        const supabase = await getSupabaseServerClient()
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

export async function fetchRoomById(id: string) {
    try {
        const room = await db.query.rooms.findFirst({
            where: (rooms, { eq }) => eq(rooms.id, id)
        })
        if (room) {
            return {
                success: true,
                room
            }
        } else {
            return { error: "Failed to fetch room", success: false }
        }
    } catch (error) {
        console.error("Room fetching error:", error)
        return { error: "Failed to fetch room", success: false }
    }
}

export async function updateRoomStatus(roomId: string, status: RoomStatus) {
    try {
        const supabase = await getSupabaseServerClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: "Unauthorized" }
        }

        const room = await db.query.rooms.findFirst({
            where: (rooms, { eq }) => eq(rooms.id, roomId)
        })

        if (!room) {
            return { success: false, error: "Room not found" }
        }

        if (room.hostId !== user.id) {
            return { success: false, error: "Only the host can update room status" }
        }


        if (room.status === "ended") {
            return { success: false, error: "Room has already ended" }
        }

        if (room.status === "playing" && status === "lobby") {
            return { success: false, error: "Cannot return to lobby once game has started" }
        }

        const updateData: Partial<typeof rooms.$inferInsert> = {
            status
        }

        if (status === "playing") {
            updateData.startedAt = new Date()
            updateData.currentRound = 1
        }

        if (status === "ended") {
            updateData.endedAt = new Date()
        }

        await db
            .update(rooms)
            .set(updateData)
            .where(eq(rooms.id, roomId))

        revalidatePath(`/play/${room.id}`)

        return {
            success: true,
            status
        }
    } catch (error) {
        console.error("Update room status error:", error)
        return { success: false, error: "Failed to update room status" }
    }
}
