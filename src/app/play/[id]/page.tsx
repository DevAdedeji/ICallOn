import { getSupabaseServerClient } from "@/src/lib/supabase/server";
import { fetchRoomById } from "@/src/actions/rooms";
import { fetchUserById } from "@/src/actions/users";
import { fetchPlayerById } from "@/src/actions/players";
import JoinForm from "@/src/components/game/JoinForm";
import LobbyScreen from "@/src/components/game/LobbyScreen";
import GameScreen from "@/src/components/game/GameScreen";
import { cookies } from "next/headers";
import JoinExecutor from "@/src/components/game/JoinExecutor";
import { Player, Room } from "@/src/db/schema";
import { GameContainer } from "@/src/components/game/GameContainer";
import { User } from "@supabase/supabase-js";

export default async function PlayGamePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id: roomId } = await params

    const roomResult = await fetchRoomById(roomId)
    if (!roomResult.success || !roomResult.room) {
        return (
            <main className="flex items-center justify-center h-screen">
                <div className="glass-panel rounded-2xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Room Not Found</h1>
                    <p className="text-gray-400">{roomResult.error ?? "This room doesn't exist or has been deleted"}</p>
                </div>
            </main>
        )
    }

    const room = roomResult.room

    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const cookieStore = await cookies()
    const playerId = cookieStore.get('playerId')?.value
    let player = null

    if (playerId) {
        const playerResult = await fetchPlayerById(playerId, roomId)
        if (playerResult.success && playerResult.player) {
            if (playerResult.player.room_id === roomId) {
                player = playerResult.player
            } else {
                cookieStore.delete('playerId')
            }
        }
    }

    if (!player && !user) {
        return (
            <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full min-h-screen">
                <JoinForm roomId={room.id} />
            </main>
        )
    }


    if (!player && user) {
        const userResult = await fetchUserById(user.id)
        const displayName = userResult.user?.username ?? user.email?.split('@')[0] ?? "Player"
        const isHost = user.id === room.hostId

        return (
            <JoinExecutor
                roomId={room.id}
                userId={user.id}
                displayName={displayName}
                isHost={isHost}
            />
        )
    }

    const hostResult = await fetchUserById(room.hostId)

    if (!hostResult.success || !hostResult.user) {
        return (
            <main className="flex items-center justify-center h-screen">
                <div className="glass-panel rounded-2xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
                    <p className="text-gray-400">Could not load room host information</p>
                </div>
            </main>
        )
    }


    return (
        <GameContainer host={hostResult.user}
            room={room as Room}
            user={user as User}
            player={player as Player} />
    )
}