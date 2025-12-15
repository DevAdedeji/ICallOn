"use client"
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useState } from "react";

export default function JoinForm() {
    const [loading, setLoading] = useState(false)
    return (
        <div className="w-full max-w-110 glass-panel rounded-2xl p-8 md:p-10 animate-float flex flex-col gap-4">
            <h2 className="text-2xl text-center font-extrabold tracking-tight text-white">
                Ready to <span className="text-primary">Play?</span>
            </h2>
            <form className="flex flex-col gap-5">
                <div className="pt-2 flex flex-col gap-4">
                    <Input type="text" placeholder="Username" required />
                    <Button variant="primary" type="submit" loading={loading} disabled={loading}>Join Game</Button>
                </div>
            </form>
        </div>
    )
}