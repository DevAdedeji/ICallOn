import Image from "next/image";
import { Trophy } from "lucide-react";
import Link from "next/link";

export default function Login() {
    return (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 w-full">
            <div className="w-full max-w-110 glass-panel rounded-2xl p-8 md:p-10 animate-float flex flex-col gap-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        Ready to <span className="text-primary">Play?</span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Welcome back, ready to win?</p>
                </div>
                <form className="flex flex-col gap-5">
                    <div className="pt-2 flex flex-col gap-4">
                        <button className="w-full bg-primary hover:bg-[#3bd10f] text-[#131811] font-bold rounded-full py-3.5 text-base shadow-[0_0_20px_rgba(70,236,19,0.3)] hover:shadow-[0_0_30px_rgba(70,236,19,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0" type="submit">
                            Login
                        </button>
                        <div className="relative flex items-center py-2">
                            <div className="grow border-t border-gray-700"></div>
                            <span className="shrink-0 mx-4 text-gray-500 text-xs font-semibold uppercase">Or continue with</span>
                            <div className="grow border-t border-gray-700"></div>
                        </div>
                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-full py-3.5 text-sm transition-all flex items-center justify-center gap-3 group/google" type="button">
                            <svg className="w-5 h-5 group-hover/google:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"></path>
                                <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"></path>
                                <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"></path>
                                <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61049L5.50264 9.70143C6.4551 6.86148 9.10952 4.74966 12.2401 4.74966Z" fill="#EA4335"></path>
                            </svg>
                            <span>Google</span>
                        </button>
                    </div>
                    <p className="text-center text-sm text-gray-400 pt-2">
                        Don&apos;t have an account?
                        <Link href="/auth/signup" className="ml-1 text-primary hover:text-white font-bold transition-colors">Sign up</Link>
                    </p>
                </form>
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