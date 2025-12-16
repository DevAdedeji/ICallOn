"use client"

import { useEffect, useRef, useTransition } from "react";
import { createOrGetPlayer } from "@/src/actions/players";
import { useRouter } from "next/navigation";

type Props = {
    roomId: string
    displayName: string
    userId?: string | null
    isHost: boolean
}

export default function JoinExecutor({
    roomId,
    displayName,
    userId,
    isHost,
}: Props) {
    const router = useRouter()
    const [, startTransition] = useTransition()
    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true

        startTransition(async () => {
            await createOrGetPlayer({
                roomId,
                displayName,
                userId,
                isHost,
            })
            router.refresh()
        })
    }, [])

    return null
}
