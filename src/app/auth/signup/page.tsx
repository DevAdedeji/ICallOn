import Image from "next/image";
import { Trophy } from "lucide-react";
import SignUpForm from "@/src/components/auth/SignUpForm";

export default function SignUp() {
    return (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
            <div className="w-full max-w-110 glass-panel rounded-2xl p-8 md:p-10 animate-float flex flex-col gap-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        Ready to <span className="text-primary">Play?</span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Create your account to challenge friends.</p>
                </div>
                <SignUpForm />
            </div>
            <div className="hidden lg:block absolute left-20 bottom-20 w-64 glass-panel p-4 rounded-xl animate-[pulse_4s_ease-in-out_infinite] -rotate-6">
                <div className="flex items-center gap-3 mb-3">
                    <Image alt="Avatar" className="w-10 h-10 rounded-full border-2 border-primary object-cover" data-alt="User avatar of a smiling young man" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqQAGjt5DGs-7Gwlbe2Cp79Lxpr82czie-0WPYIySdXAEpRvQb_tGQf7Txglp4GwMg1_cX5vv38KVwRZ8gyfuCJRbPBDvv7OxgI9cJypdOcE_mSjXE2m8202Qik_Wol9GbVmnZFRvdLiiMv3TdBH28yZBE2p3MdLGvuw_IQyv_RVSRd3NmiZTWfky5uDkvtiTSIuwxsd0He91ay2KJGtwf3YAt6zjAWMz4R38uW2_X-yqw-jydiU7PcHBjhX8xD8GqM8S6X5jZZ2JV" width={40} height={40} />
                    <div>
                        <p className="text-white text-sm font-bold">AlexW</p>
                        <p className="text-xs text-primary">High Score: 12,400</p>
                    </div>
                </div>
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-right">Rank #3 Global</p>
            </div>
            <div className="hidden lg:block absolute right-20 top-32 w-56 glass-panel p-4 rounded-xl animate-float rotate-3">
                <div className="flex justify-between items-center mb-2 text-gray-400 text-xs">
                    <span className="font-bold uppercase">Daily Word</span>
                    <Trophy />
                </div>
                <p className="text-2xl font-black text-white tracking-widest text-center py-2">GLITCH</p>
                <div className="flex justify-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                </div>
            </div>
        </main>
    )
}