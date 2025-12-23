import { getSupabaseServerClient } from "@/src/lib/supabase/server";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export default async function Header() {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return (
        <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-lg shadow-black/20">
                <Link href={"/"} className="flex items-center gap-3">
                    <div className="text-primary flex items-center justify-center">
                        <Gamepad2 />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-white">ICallOn</span>
                </Link>
                {/* <nav className="hidden md:flex items-center gap-8">
                    <a className="text-sm font-semibold text-gray-300 hover:text-white transition-colors" href="#">Home</a>
                    <a className="text-sm font-semibold text-gray-300 hover:text-white transition-colors" href="#">Features</a>
                    <a className="text-sm font-semibold text-gray-300 hover:text-white transition-colors" href="#">Pricing</a>
                </nav> */}
                {!user ? <div className="flex items-center gap-3">
                    <Link href={"/auth/login"} className="hidden sm:flex text-sm font-bold text-white hover:text-primary transition-colors px-4">
                        Login
                    </Link>
                    <Link href={"/auth/signup"} className="flex items-center justify-center rounded-full bg-primary hover:bg-primary-dark text-background-dark text-sm font-extrabold h-10 px-6 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(70,236,19,0.3)]">
                        Sign Up
                    </Link>
                </div> : <Link href={"/create"} className="flex items-center justify-center rounded-full bg-primary hover:bg-primary-dark text-background-dark text-sm font-extrabold h-10 px-6 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(70,236,19,0.3)]">
                    Create
                </Link>}
            </div>
        </header>
    )
}