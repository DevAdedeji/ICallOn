"use client"
import Input from "../ui/Input";
import Button from "../ui/Button";
import JoinExecutor from "./JoinExecutor";
import { useState } from "react";

export default function JoinForm({ roomId }: { roomId: string }) {
    const [name, setName] = useState('')
    const [submit, setSubmit] = useState(false)

    if (submit) {
        return (
            <JoinExecutor
                roomId={roomId}
                displayName={name}
                isHost={false}
            />
        )
    }
    return (
        <div className="w-full max-w-110 glass-panel rounded-2xl p-8 md:p-10 animate-float flex flex-col gap-4">
            <h2 className="text-2xl text-center font-extrabold tracking-tight text-white">
                Ready to <span className="text-primary">Play?</span>
            </h2>
            <form className="flex flex-col gap-5" onSubmit={e => {
                e.preventDefault()
                setSubmit(true)
            }}>
                <div className="pt-2 flex flex-col gap-4">
                    <Input type="text" placeholder="Username" required value={name}
                        onChange={e => setName(e.target.value)} />
                    <Button variant="primary" type="submit">Join Game</Button>
                </div>
            </form>
        </div>
    )
}