import Button from "../ui/Button";

export default function CTA() {
    return (
        <section className="py-24 px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">Ready to challenge your friends?</h2>
                <div className="flex justify-center">
                    <Button variant="secondary" href="/create">
                        Start Playing Now
                    </Button>
                </div>
            </div>
        </section>
    )
}