"use client"
import { Room, User } from "@/src/db/schema";
import type { User as LoggedInUser } from "@supabase/supabase-js";

export default function GameScreen({ host, room, user, playerId }: { host?: User, room: Room, user?: LoggedInUser, playerId?: string }) {
    return (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full"></main>
    )
}