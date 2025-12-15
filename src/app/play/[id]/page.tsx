import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { fetchRoomById } from "@/src/actions/rooms";
import { fetchUserById } from "@/src/actions/users";
import JoinForm from "@/src/components/game/JoinForm";
import LobbyScreen from "@/src/components/game/LobbyScreen";

export default async function PlayGamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser()
    const result = await fetchRoomById(id)

    if (!result.success) {
        return (
            <main className="flex items-center justify-center h-screen">
                <p className="text-red-500">{result.error}</p>
            </main>
        );
    }

    const room = result.room

    if (!user) {
        return (
            <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
                <JoinForm />
            </main>
        )
    }

    if (!room) {
        return (
            <main className="flex items-center justify-center h-screen">
                <p className="text-red-500">Room not found</p>
            </main>
        );
    }

    const host = await fetchUserById(room.hostId)

    return (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
            <LobbyScreen host={host.user} room={room} user={user} />
        </main>
    )
}