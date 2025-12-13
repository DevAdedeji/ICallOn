import Header from "@/src/components/landing/Header"

export default function AuthLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="font-manrope bg-background-light dark:bg-background-dark text-[#131811] dark:text-white antialiased min-h-screen flex flex-col relative overflow-hidden bg-grid-pattern">
            <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <Header />
            {children}
        </main>
    )
}