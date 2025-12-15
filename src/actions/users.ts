"use server"

import { db } from "@/src/db"

export async function fetchUserById(userId: string) {
    try {
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId)
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        return { success: true, user }
    } catch (error) {
        console.error('Error fetching user:', error)
        return { success: false, error: 'Failed to fetch user' }
    }
}