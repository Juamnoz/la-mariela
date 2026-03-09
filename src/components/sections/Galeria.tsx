"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const photos = [
  { src: "/images/fachada.jpeg", alt: "Fachada Casa Hotel La Mariela" },
  { src: "/images/comedor.jpeg", alt: "Comedor" },
  { src: "/images/pasillo.jpeg", alt: "Pasillo" },
  { src: "/images/pasillo-2.jpeg", alt: "Pasillo interior" },
  { src: "/images/hab-familiar-1.jpeg", alt: "Habitación Familiar" },
];

function PhotoThumb({ photo, delay }: { photo: (typeof photos)[0]; delay: number }) {
  return (
    <ScrollReveal delay={delay} direction="up" className="relative overflow-hidden rounded-2xl group h-full">
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="w-full h-full">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-selva-dark/0 group-hover:bg-selva-dark/20 transition-colors" />
      </motion.div>
    </ScrollReveal>
  );
}

export default function Galeria() {
  return (
    <section id="galeria" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-turquesa text-sm font-semibold uppercase tracking-wider">
              Galería
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-selva-dark mt-2 mb-3">
              Vive la experiencia
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Espacios llenos de luz, colores tropicales y la tranquilidad que
              solo el Caribe colombiano puede ofrecer.
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile: foto grande arriba + 2×2 abajo */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="relative h-64 overflow-hidden rounded-2xl group">
            <ScrollReveal direction="up" className="h-full">
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-selva-dark/0 group-hover:bg-selva-dark/20 transition-colors" />
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-2 gap-3" style={{ height: "320px" }}>
            {photos.slice(1).map((photo, i) => (
              <PhotoThumb key={i} photo={photo} delay={0.08 + i * 0.06} />
            ))}
          </div>
        </div>

        {/* Desktop: foto grande a la izquierda (2 filas) + 2×2 a la derecha */}
        <div
          className="hidden md:grid grid-cols-3 gap-3"
          style={{ gridTemplateRows: "260px 260px" }}
        >
          <div style={{ gridRow: "1 / 3" }}>
            <ScrollReveal delay={0} direction="left" className="relative overflow-hidden rounded-2xl group h-full">
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-selva-dark/0 group-hover:bg-selva-dark/20 transition-colors" />
            </ScrollReveal>
          </div>

          {photos.slice(1).map((photo, i) => (
            <PhotoThumb key={i} photo={photo} delay={0.1 + i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
