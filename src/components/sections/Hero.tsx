"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import MotorIframe from "@/components/booking/MotorIframe";

const appleEase = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: appleEase },
  };
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/fachada.jpeg"
          alt="Casa Hotel La Mariela — Sapzurro"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-selva-dark/60 via-selva-dark/40 to-selva-dark/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-16 pb-20">
        <motion.div {...fadeUp(0.1)} className="inline-block bg-turquesa/20 backdrop-blur-sm border border-turquesa/30 text-turquesa-light text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
          Sapzurro · Chocó · Colombia
        </motion.div>

        <motion.h1 {...fadeUp(0.25)} className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
          Casa Hotel La Mariela
        </motion.h1>

        <motion.p {...fadeUp(0.4)} className="text-base sm:text-lg text-white/85 max-w-xl mx-auto mb-10 leading-relaxed">
          En el paraíso más austral del Caribe colombiano. Naturaleza, mar y
          hospitalidad auténtica te esperan en Sapzurro.
        </motion.p>

        <motion.div {...fadeUp(0.55)} id="motor">
          <MotorIframe />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
