import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(roomId: string | null) {
    const [isConnected, setIsConnected] = useState(false)
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (!roomId) {
            // Cleanup if roomId becomes null
            if (socketRef.current) {
                const socket = socketRef.current
                socketRef.current = null
                socket.disconnect()
                // Schedule state update after render
                setTimeout(() => setIsConnected(false), 0)
            }
            return
        }

        // Don't recreate socket if it already exists for this room
        if (socketRef.current?.connected) return

        const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
            transports: ['websocket']
        })

        socketRef.current = socketInstance

        const handleConnect = () => setIsConnected(true)
        const handleDisconnect = () => setIsConnected(false)

        socketInstance.on('connect', handleConnect)
        socketInstance.on('disconnect', handleDisconnect)

        return () => {
            socketInstance.off('connect', handleConnect)
            socketInstance.off('disconnect', handleDisconnect)
            socketInstance.disconnect()
            socketRef.current = null
            // Schedule state reset after cleanup
            setTimeout(() => setIsConnected(false), 0)
        }
    }, [roomId])

    const getSocket = () => socketRef.current
    return { getSocket, isConnected }
}
