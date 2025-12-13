import { Link, Share2, Trophy } from "lucide-react"
export default function Features() {
    return (
        <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">How it works</h2>
                        <p className="text-gray-400 text-lg max-w-md">Get started in three simple steps. No complicated setup, just pure fun.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group glass-panel rounded-2xl p-8 hover:bg-white/5 transition-colors duration-300">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Link />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">1. Create Lobby</h3>
                        <p className="text-gray-400 leading-relaxed">Instantly generate a secure game room. Customize rules, timer settings, and word difficulty.</p>
                    </div>
                    <div className="group glass-panel rounded-2xl p-8 hover:bg-white/5 transition-colors duration-300">
                        <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Share2 />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">2. Share Link</h3>
                        <p className="text-gray-400 leading-relaxed">Copy the unique invite link and drop it in your group chat. Friends join with one click.</p>
                    </div>
                    <div className="group glass-panel rounded-2xl p-8 hover:bg-white/5 transition-colors duration-300">
                        <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Trophy />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">3. Compete</h3>
                        <p className="text-gray-400 leading-relaxed">Race against the clock and your friends to solve the puzzle first. Winner takes all.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}