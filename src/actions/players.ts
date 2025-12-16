/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { db } from "@/src/db";
import { players } from "@/src/db/schema";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm"

export async function fetchPlayerById(playerId: string) {
    try {
        const player = await db.query.players.findFirst({
            where: (players, { eq }) => eq(players.id, playerId)
        })

        if (!player) {
            return { success: false, error: "User not found" }
        }

        return { success: true, player }
    } catch (error) {
        console.error("Error fetching player:", error)
        return { success: false, error: "Failed to fetch player" }
    }
}

type JoinInput = {
    roomId: string
    displayName: string
    userId?: string | null
    isHost: boolean
}

export async function createOrGetPlayer(input: JoinInput) {
    const cookieStore = await cookies()

    if (input.userId) {
        const existing = await db.query.players.findFirst({
            where: and(
                eq(players.room_id, input.roomId),
                eq(players.user_id, input.userId)
            ),
        })

        if (existing) {
            cookieStore.set("playerId", existing.id, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
            })

            return { success: true, player: existing }
        }
    }

    try {
        const [player] = await db
            .insert(players)
            .values({
                id: input.userId ?? nanoid(),
                room_id: input.roomId,
                user_id: input.userId ?? null,
                display_name: input.displayName,
                isHost: input.isHost,
            })
            .returning()

        cookieStore.set("playerId", player.id, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })

        return { success: true, player }
    } catch (error: any) {
        if (error.code === "23505" && input.userId) {
            const existing = await db.query.players.findFirst({
                where: and(
                    eq(players.room_id, input.roomId),
                    eq(players.user_id, input.userId)
                ),
            })

            if (existing) {
                cookieStore.set("playerId", existing.id, {
                    httpOnly: true,
                    sameSite: "lax",
                    path: "/",
                })

                return { success: true, player: existing }
            }
        }

        console.error("Join failed:", error)
        return { success: false, error: "Failed to join room" }
    }
}

export async function fetchPlayersByRoomId(roomId: string) {
    try {
        const allPlayers = await db.query.players.findMany({
            where: (players, { eq }) => eq(players.room_id, roomId),
        })

        return { success: true, players: allPlayers }
    } catch (error) {
        console.error("Error fetching players:", error)
        return { success: false, error: "Failed to fetch players" }
    }
}