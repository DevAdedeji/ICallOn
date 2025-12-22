/* eslint-disable @next/next/no-img-element */
"use client"
import { Gamepad2, RotateCw, Timer, Copy, Link, ArrowRight, LoaderCircle } from "lucide-react";
import Button from "@/src/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/src/actions/rooms";
import { copyToClipboard } from "@/src/lib/utils";
import { toast } from 'sonner';

export default function CreateGamePage() {
    const roundOptions = [3, 5, 7, 10]
    const timerOptions = [30, 60, 90, 120]
    const [selectedRounds, setSelectedRounds] = useState<number | null>(null)
    const [selectedTimer, setSelectedTimer] = useState<number | null>(null)

    const [roomCode, setRoomCode] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [roomId, setRoomId] = useState<string | null>(null)
    const [shareLink, setShareLink] = useState<string>("")

    const router = useRouter()

    const handleCreateRoom = async () => {
        if (!selectedRounds || !selectedTimer) {
            toast.error("Please select rounds and timer")
            return
        }

        setIsCreating(true)

        try {
            const result = await createRoom(selectedRounds, selectedTimer)

            if (!result.success) {
                toast.error(result.error || 'Failed to create room')
                if (result.error === 'Unauthorized') {
                    router.push("/auth/login")
                }
                return
            }

            if (result.room) {
                setRoomCode(result.room.code)
                setRoomId(result.room.id)
                setShareLink(`${window.location.origin}/play/${result.room.id}`)
            }

        } catch (error) {
            console.error('Error creating room:', error)
            toast.error('An error occurred while creating the room')
        } finally {
            setIsCreating(false)
        }

    }

    const handleActionButton = () => {
        if (roomCode && roomId) {
            router.push(`/play/${roomId}`)
        } else {
            handleCreateRoom()
        }
    }


    const copyGameLink = async () => {
        if (shareLink) {
            const success = await copyToClipboard(shareLink)
            if (success) {
                toast.success("Share link copied!")
            } else {
                toast.error("Failed to copy link")
            }
        }
    }

    return (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
            <section className="w-full max-w-225 glass-panel rounded-3xl relative overflow-hidden flex flex-col md:flex-row shadow-2xl ring-1 ring-white/10">
                <div className="hidden md:flex md:w-[35%] bg-surface-dark relative flex-col justify-between p-8 border-r border-white/5 overflow-hidden group/sidebar">
                    <div className="absolute inset-0 z-0">
                        <img alt="" className="w-full h-full object-cover opacity-40 group-hover/sidebar:scale-110 transition-transform duration-[20s] ease-linear" data-alt="Abstract 3D neon green geometric shapes floating in dark space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcsP28QW4T1RK2FW5UtjJvLFLaJEcu72WCu18UJYyl_qKgI0Mc6LejJ3Sxo9QNs7BDEY3nnTmQIWkhXc6qd7r5vb94T7OdhvrJP8I0vqbiqjXH5AWHIaI_UT1_BE7GKoIfPzeVcpcmu-8nD9FVLdjAEkXMP-RJLPxfeM08xRq6sR_TnhCjgdGTrIz9lrO2nMtR5FBYTHFVSPYHCRu0Uki_1pRGzG9Uqhb1c4tQL5k6ERQMGuqWYT8LpJmPG1eET6lziozTcIvgcT-p" />
                        <div className="absolute inset-0 bg-linear-to-b from-background-dark/90 via-background-dark/40 to-background-dark/95"></div>
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(70,236,19,0.3)] rotate-3 hover:rotate-6 transition-transform text-background-dark text-2xl font-bold">
                            <Gamepad2 />
                        </div>
                        <h2 className="text-4xl font-black leading-[0.95] text-white mb-3 tracking-tight">Setup<br /><span className="text-primary">Room</span></h2>
                        <p className="text-white/60 text-sm font-medium leading-relaxed">Customize your word battle settings and get the squad ready for action.</p>
                    </div>
                </div>
                <div className="flex-1 p-6 md:p-10 flex flex-col bg-background-dark/40">
                    <div className="md:hidden mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg text-background-dark text-sm font-bold">
                                <Gamepad2 />
                            </div>
                            <h1 className="text-2xl font-black text-white tracking-tight">Setup Game Room</h1>
                        </div>
                        <p className="text-white/60 text-sm pl-11">Configure settings &amp; invite friends.</p>
                    </div>
                    <form className="flex flex-col h-full justify-between gap-8" onSubmit={(e) => {
                        e.preventDefault()
                        handleActionButton()
                    }}>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <RotateCw className="text-primary text-xl" />
                                        <h3 className="text-white font-bold text-sm tracking-wide uppercase opacity-90">Rounds</h3>
                                    </div>
                                    <span className="text-xs text-white/30 font-medium">Total game length</span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {
                                        roundOptions.map((round) => (
                                            <Button variant={round === selectedRounds ? "primary" : "outline"} key={round} onClick={() => setSelectedRounds(round)} type="button" disabled={!!roomCode}>{round}</Button>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Timer className="text-primary text-xl" />
                                        <h3 className="text-white font-bold text-sm tracking-wide uppercase opacity-90">Time per round</h3>
                                    </div>
                                    <span className="text-xs text-white/30 font-medium">Think fast!</span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {
                                        timerOptions.map((timer) => (
                                            <Button variant={timer === selectedTimer ? "primary" : "outline"} key={timer} onClick={() => setSelectedTimer(timer)} type="button" disabled={!!roomCode}>{timer}</Button>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent w-full"></div>
                        {roomCode && <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Link className="text-primary text-xl" />
                                    <h3 className="text-white font-bold text-sm tracking-wide uppercase opacity-90">Room Link</h3>
                                </div>
                            </div>
                            <button type="button" className="relative group cursor-pointer w-full" onClick={copyGameLink}>
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-[#0a1108]/80 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-primary/50  group-active:scale-[0.99] transition-transform">
                                    <div className="text-sm truncate font-black text-white tracking-[0.25em] w-[90%] mx-auto font-mono neon-text-shadow">{shareLink}</div>
                                    <div className="text-[10px] text-primary/70 font-mono tracking-widest uppercase flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <Copy size={12} />
                                        Click to copy link
                                    </div>
                                </div>
                            </button>
                            {/* <div className="space-y-2">
                                <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-2xl p-1.5 pr-2 focus-within:border-primary/50 focus-within:bg-black/40 focus-within:shadow-[0_0_15px_rgba(70,236,19,0.1)] transition-all">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl text-white/40 bg-white/5">
                                        <Link />
                                    </div>
                                    <input className="bg-transparent border-none text-white/80 text-sm font-medium focus:ring-0 w-full placeholder-white/20 select-all font-mono" type="text" value={shareLink} disabled />
                                    <button type="button" className="h-10 px-5 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm border border-white/5" onClick={copyGameLink}>
                                        Copy Link
                                    </button>
                                </div>
                            </div> */}
                        </div>}
                        <div className="pt-2 mt-auto">
                            <button type="submit"
                                disabled={!selectedRounds || !selectedTimer || isCreating} className="w-full h-16 bg-primary hover:bg-[#3bd10f] active:scale-[0.98] text-background-dark font-black text-xl uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(70,236,19,0.3)] hover:shadow-[0_0_40px_rgba(70,236,19,0.5)] transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    {isCreating ? (
                                        <>
                                            <LoaderCircle className="animate-spin" />
                                            Creating Room...
                                        </>
                                    ) : roomCode ? "Start Game" : "Create Room"}
                                </span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10 font-bold" />
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}