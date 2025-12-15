'use server'

import { db } from "@/src/db";
import { players } from "@/src/db/schema";
import { nanoid } from 'nanoid'

export async function createPlayer({
    roomId,
    userId,
    displayName,
    isHost
}: {
    roomId: string
    userId: string | null
    displayName: string
    isHost: boolean
}) {
    try {
        const playerId = nanoid()

        const [player] = await db.insert(players).values({
            id: playerId,
            roomId,
            userId,
            displayName,
            isHost
        }).returning()

        return { success: true, player }
    } catch (error) {
        console.error('Error creating player:', error)
        return { success: false, error: 'Failed to join room' }
    }
}