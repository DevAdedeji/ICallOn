export default function CTA() {
    return (
        <section className="py-24 px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">Ready to challenge your friends?</h2>
                <div className="flex justify-center">
                    <button className="flex items-center justify-center gap-2 rounded-full bg-white text-background-dark hover:bg-gray-100 text-lg font-bold h-14 px-10 transition-transform transform hover:scale-105 shadow-xl">
                        Start Playing Now
                    </button>
                </div>
            </div>
        </section>
    )
}