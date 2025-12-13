import { CirclePlus, UserPlus } from "lucide-react";
import Button from "../ui/Button";

export default function Hero() {
    return (
        <main className="grow flex flex-col items-center justify-center relative z-10 px-4 pt-20 pb-16 sm:pt-32">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">Live Multiplayer Beta</span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-black leading-[1.1] tracking-tight text-white text-glow">
                    Play Word Games with <br className="hidden sm:block" />
                    <span className="bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Friends in Real-Time</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl font-medium leading-relaxed">
                    No downloads required. Just share a link, jump into a lobby, and start guessing instantly. The fastest word game on the web.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                    <Button variant="primary">
                        <CirclePlus />
                        Create Game
                    </Button>
                    <Button variant="outline">
                        <UserPlus />
                        Join Game
                    </Button>
                </div>
            </div>
            <div className="mt-20 w-full max-w-6xl px-4 perspective-[2000px]">
                <div className="glass-panel rounded-2xl p-2 sm:p-4 transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out shadow-2xl">
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-surface-dark border border-white/5 group">
                        <div className="absolute inset-0 bg-cover bg-center opacity-80" data-alt="Abstract dark interface with glowing green data points representing real-time gameplay" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuADHPklldq51YiHZVwr8Ek1GM3SxH9FxHmsRKzL-vasO2NDoPKwx8vf53gvgU7dMG06Z4bQ7EXcEHGYSypCVKG7RA0k4gN_D5qyk73VCDYxFq_8nTqvF1jIpRjOpAQSXuoKflTaZWkN_cwVpfK-sv_Ftw1ggV1SR8ebLIvl4VDh0lxBon8UaxaYGKEm8qk6l1Dax2ghVToHfi7-sz4mSwv90RWoMiUf6-c8a7fGwrmurWSbXuK8T1IbQSSxZG5nWwzrpb38cFmMCRjq')` }}></div>
                        <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                            <div className="flex gap-4 mb-8">
                                <div className="w-16 h-20 bg-primary/20 border-2 border-primary rounded-lg flex items-center justify-center text-4xl font-black text-primary backdrop-blur-md">W</div>
                                <div className="w-16 h-20 bg-surface-dark/60 border-2 border-white/20 rounded-lg flex items-center justify-center text-4xl font-bold text-white backdrop-blur-md">O</div>
                                <div className="w-16 h-20 bg-surface-dark/60 border-2 border-white/20 rounded-lg flex items-center justify-center text-4xl font-bold text-white backdrop-blur-md">R</div>
                                <div className="w-16 h-20 bg-surface-dark/60 border-2 border-white/20 rounded-lg flex items-center justify-center text-4xl font-bold text-white backdrop-blur-md">D</div>
                                <div className="w-16 h-20 bg-surface-dark/60 border-2 border-white/20 rounded-lg flex items-center justify-center text-4xl font-bold text-white backdrop-blur-md">S</div>
                            </div>
                            <div className="bg-black/50 backdrop-blur px-6 py-2 rounded-full border border-white/10 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                <span className="text-white font-mono font-bold">00:14 LEFT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}