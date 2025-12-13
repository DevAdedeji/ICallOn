import Image from "next/image";
import { Zap } from "lucide-react";
export default function Highlight() {
    return (
        <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="glass-panel rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
                    <div className="lg:w-1/2 relative min-h-75 lg:min-h-full">
                        <div className="absolute inset-0 bg-cover bg-center" data-alt="Cyberpunk style gaming setup with neon lights" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuu1mSCaOqhyyxO7EVc7huteUkUMqpK1_MwjANRD6cbnLHx0CyXbH6qYS3EGitItigQYXP9DO-Mb9D5H_vWMPDvxpOEcBIZdqV_c4UH_jYGBiZ4FMt2-Rv0mzEWUXv-AuFDEsPcoUabJqjB65rbHtxqdJKeh9siz8TmPw8kO3937ppUrRQbYXxeG0dDdjBQtD0O3tlLVgit7Rqa8dcIb2AqYEBvjUUu8KV-aNFH_MUxBhBQ6wb-6OygAUcoIRcg5eZOAy8XjC-wEOf')` }}></div>
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                    </div>
                    <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                        <div className="text-primary inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1 mb-6 border border-primary/20">
                            <Zap size={12} />
                            <span className="text-xs font-bold uppercase">Zero Latency</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">Experience the Rush of Live Gaming</h3>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            Watch a real-time match in action with our smooth animations and glassmorphic design. Our engine ensures every keystroke is synced instantly across all devices.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                <Image alt="User avatar" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" data-alt="Portrait of a young woman smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrTS47eLWNMZbRw1lnyOiNz8lMmcXWkG4EVblLSroDveHZ6TS1j94P76JqFBQW1vR_u7I4T7fuoiJ0lhlXamnIhILvGMoH9lZ6AgS0N2GSWpwW4aqsputJHN51DtN4RneMipiIX_fUge04j2rhtNcdQE6XMc3BGlDvi9nShzqOcJJugF9hyqqaOBsvSRkRKAMWSSIRqcsBrV0iHInxzZWtewI-cMFfsuJ0v0Ct2y_INxYgcLpG8m2g14vk9SRggUW9jRaT1Vkr8GHs" width={40} height={40} />
                                <Image alt="User avatar" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" data-alt="Portrait of a young man looking confident" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2bn1P7yexwVyXmPmucxyDdaHvCQFp4gFS147D3q2nf10s5ZB4VbFtHULcQQqwKuusF8txyHLCtlZn1VjvwLLM-OG38GpVGTwnjD27cQfq-F6fzzu7Z9NJeTJ7mVlMwdrr-eXLYpOQU6E6wbtS5pokD0v_veka3alJHmFS4Nz3DW5YBT5bUKxVzbeDHd0kNsgRu1HnHrPm8qdqtevyca0GM25yziBnK4qYaEbmZDxlRK45bKAOk3XgvkQI9ykwT4Ybamrn7ESrsK8L" width={40} height={40} />
                                <Image alt="User avatar" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" data-alt="Portrait of a woman with glasses" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFJElhKp9u60pfg68FmYn6a2ilb8Rm3BA3D7rYWMXxImavWOETdyzpnqezBcc6kvbdN9JSruWz7b_TuEPDPEVjwpsW6-PYroEvvlOaqOJ9_ZnJrlO8zo8Qq3-MuXYwKqAiD7cA2Nbxz4GgxIn0JsFwdbt5O6A0YRc5fQNpaLZlWShkDHu2kDPqJHPXChSPGYx6n3nYUWxH1i2UaDbi_dB4d8ky3N6Tsv4jDMe33KlzuHVJwkEtyz7iskRZcOdVQ0GsqerdK4VImYSi" width={40} height={40} />
                                <div className="w-10 h-10 rounded-full border-2 border-background-dark bg-surface-dark flex items-center justify-center text-xs font-bold text-white">+2k</div>
                            </div>
                            <span className="text-sm font-semibold text-gray-400">Players online now</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}