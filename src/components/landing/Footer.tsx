"use client"

import { Gamepad2 } from "lucide-react";
export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <div className="text-primary">
                            <Gamepad2 />
                        </div>
                        <span className="text-xl font-extrabold text-white">ICallOn</span>
                    </div>
                    {/* <div className="flex flex-wrap justify-center gap-8">
                        <a className="text-gray-400 hover:text-primary text-sm font-medium transition-colors" href="#">About</a>
                        <a className="text-gray-400 hover:text-primary text-sm font-medium transition-colors" href="#">Rules</a>
                        <a className="text-gray-400 hover:text-primary text-sm font-medium transition-colors" href="#">Contact</a>
                        <a className="text-gray-400 hover:text-primary text-sm font-medium transition-colors" href="#">Privacy Policy</a>
                    </div> */}
                    {/* <div className="flex gap-4">
                        <a className="text-gray-400 hover:text-white transition-colors" href="#">
                            <span className="sr-only">Twitter</span>
                            <span className="material-symbols-outlined">flutter_dash</span>
                        </a>
                        <a className="text-gray-400 hover:text-white transition-colors" href="#">
                            <span className="sr-only">Instagram</span>
                            <span className="material-symbols-outlined">photo_camera</span>
                        </a>
                        <a className="text-gray-400 hover:text-white transition-colors" href="#">
                            <span className="sr-only">Discord</span>
                            <span className="material-symbols-outlined">forum</span>
                        </a>
                    </div> */}
                </div>
                <div className="mt-8 text-center md:text-left pt-8 border-t border-white/5">
                    <p className="text-gray-600 text-sm">© {new Date().getFullYear()} ICallOn. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}