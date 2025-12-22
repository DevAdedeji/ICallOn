import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Highlight from "../components/landing/Highlight";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-background-dark font-manrope text-white antialiased overflow-x-hidden transition-colors duration-300">
      <div className="relative min-h-screen flex flex-col bg-grid-pattern">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0 opacity-40"></div>
        <Header />
        <Hero />
        <Features />
        <Highlight />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
