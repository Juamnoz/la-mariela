"use client";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  {
    from: "Medellín",
    to: "Turbo",
    icon: "🚌",
    desc: "Bus intermunicipal ~8h o vuelo charter ~45min a Necoclí",
  },
  {
    from: "Turbo / Necoclí",
    to: "Capurganá",
    icon: "⛴️",
    desc: "Lancha rápida desde el muelle de Necoclí (~1.5h). Salidas diarias AM y PM.",
  },
  {
    from: "Capurganá",
    to: "Sapzurro",
    icon: "🚶",
    desc: "Caminata de ~20 min por sendero natural o bote pequeño (~10 min).",
  },
  {
    from: "Sapzurro",
    to: "La Mariela",
    icon: "🏨",
    desc: "El hotel está en el centro del pueblo. ¡Le esperamos!",
  },
];

export default function ComoLlegar() {
  return (
    <section id="como-llegar" className="py-20 bg-arena-light">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-turquesa text-sm font-semibold uppercase tracking-wider">
              ¿Cómo llegar?
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-selva-dark mt-2 mb-3">
              La aventura empieza en el camino
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Sapzurro no se llega en auto — y eso es parte de la magia. Siga
              estos pasos para llegar al rincón más especial del Caribe colombiano.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="left">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-xl shrink-0">
                      {step.icon}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px h-full mt-2 bg-selva/20" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-selva-dark text-sm">{step.from}</span>
                      <ArrowRight size={14} className="text-turquesa" />
                      <span className="font-semibold text-selva-dark text-sm">{step.to}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Map */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/mapa.jpeg"
                alt="Mapa Casa Hotel La Mariela — Sapzurro"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-selva-dark/30 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                <MapPin size={14} className="text-selva" />
                <span className="text-xs font-semibold text-selva-dark">
                  Sapzurro, Acandí, Chocó
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              ¿Necesita ayuda para planear su llegada?
            </p>
            <a
              href="https://wa.me/573006168064?text=Hola%2C%20necesito%20información%20sobre%20cómo%20llegar%20a%20Sapzurro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-selva text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-selva-dark transition-colors"
            >
              Contáctenos por WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
