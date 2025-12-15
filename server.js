import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        const parsedUrl = parse(req.url, true)
        await handle(req, res, parsedUrl)
    })

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4040',
            methods: ['GET', 'POST']
        }
    })

    // Socket.io logic
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        // Join room
        socket.on('join-room', async ({ roomId, playerId, displayName, isHost }) => {
            socket.join(roomId)

            // Broadcast to everyone in the room that a player joined
            io.to(roomId).emit('player-joined', {
                playerId,
                displayName,
                isHost,
                socketId: socket.id
            })

            console.log(`${displayName} joined room ${roomId}`)
        })

        // Leave room
        socket.on('leave-room', ({ roomId, playerId, displayName }) => {
            socket.leave(roomId)
            io.to(roomId).emit('player-left', { playerId, displayName })
        })

        // Start game
        socket.on('start-game', ({ roomId }) => {
            io.to(roomId).emit('game-started')
        })

        // Letter selected
        socket.on('letter-selected', ({ roomId, letter, roundNumber }) => {
            io.to(roomId).emit('letter-announced', { letter, roundNumber })
        })

        // Timer updates
        socket.on('timer-tick', ({ roomId, secondsRemaining }) => {
            io.to(roomId).emit('timer-update', { secondsRemaining })
        })

        // Answer submitted
        socket.on('answer-submitted', ({ roomId, playerId, displayName }) => {
            io.to(roomId).emit('player-submitted', { playerId, displayName })
        })

        // Round ended
        socket.on('round-ended', ({ roomId }) => {
            io.to(roomId).emit('round-complete')
        })

        // Scores updated
        socket.on('scores-updated', ({ roomId, scores }) => {
            io.to(roomId).emit('leaderboard-update', { scores })
        })

        // Game ended
        socket.on('game-ended', ({ roomId, winner, finalScores }) => {
            io.to(roomId).emit('game-complete', { winner, finalScores })
        })

        // Disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
        })
    })

    httpServer.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://${hostname}:${port}`)
    })
})