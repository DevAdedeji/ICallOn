import { getSupabaseServerClient } from "@/src/lib/supabase/server";
import { fetchRoomById } from "@/src/actions/rooms";
import { fetchUserById } from "@/src/actions/users";
import { fetchPlayerById } from "@/src/actions/players";
import JoinForm from "@/src/components/game/JoinForm";
import LobbyScreen from "@/src/components/game/LobbyScreen";
import GameScreen from "@/src/components/game/GameScreen";
import { cookies } from "next/headers";
import JoinExecutor from "@/src/components/game/JoinExecutor";

export default async function PlayGamePage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies()
    const { id } = await params
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    const roomResult = await fetchRoomById(id)


    if (!roomResult.success || !roomResult.room) {
        return (
            <main className="flex items-center justify-center h-screen">
                <p className="text-red-500">{roomResult.error ?? "Room not found"}</p>
            </main>
        );
    }

    const room = roomResult.room
    const playerId = cookieStore.get('playerId')?.value
    let player = null

    // console.log(playerId)

    if (playerId) {
        const playerResult = await fetchPlayerById(playerId);
        if (playerResult.success) {
            player = playerResult.player
        }
    }

    if (!player && !user) {
        return (
            <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
                <JoinForm roomId={room.id} />
            </main>
        )
    }

    if (!player && user) {
        const { user: userUsername } = await fetchUserById(user.id)
        return (
            <JoinExecutor roomId={room.id} userId={user.id} displayName={userUsername?.username ?? user.email ?? ""} isHost={user.id === room.hostId} />
        )
    }


    const host = await fetchUserById(room.hostId)

    if (room.status === "lobby") {
        return (
            <LobbyScreen host={host.user} room={room} user={user || undefined} playerId={playerId || undefined} />
        )
    }

    if (room.status === "playing") {
        return (
            <GameScreen host={host.user} room={room} user={user || undefined} />
        )
    }
}