"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const amenities = ["Baño privado", "Aire acond.", "WiFi", "Smart TV", "2 ventiladores"];

const rooms = [
  {
    id: "HAB-TRI-01",
    name: "Habitación Triple",
    type: "1 a 3 personas",
    description:
      "Perfecta para parejas o grupos de amigos. 1P $160k · 2P $180k · 3P $240k por noche (temporada baja).",
    priceFrom: 160000,
    maxPersons: 3,
    images: [
      "/images/hab-triple-2.jpeg",
      "/images/hab-triple-3.jpeg",
      "/images/hab-triple-4.jpeg",
      "/images/hab-triple-5.jpeg",
    ],
  },
  {
    id: "HAB-CUA-01",
    name: "Habitación Cuádruple",
    type: "Hasta 4 personas",
    description:
      "Espaciosa y cómoda para grupos de 4. 1P $160k · 2P $180k · 3P $240k · 4P $300k por noche (temporada baja).",
    priceFrom: 160000,
    maxPersons: 4,
    images: [
      "/images/hab-cuadruple-2.jpeg",
      "/images/hab-cuadruple-3.jpeg",
    ],
  },
  {
    id: "HAB-FAM-01",
    name: "Habitación Familiar",
    type: "3 a 5 personas",
    description:
      "La más amplia de la casa, ideal para familias. 1P $160k · 2P $180k · 3P $240k · 4P $300k · 5P $350k por noche (temporada baja).",
    priceFrom: 160000,
    maxPersons: 5,
    images: [
      "/images/hab-familiar-1.jpeg",
      "/images/hab-familiar-2.jpeg",
      "/images/hab-familiar-3.jpeg",
      "/images/hab-familiar-4.jpeg",
      "/images/hab-familiar-5.jpeg",
    ],
  },
];

function RoomCard({ room, index }: { room: (typeof rooms)[0]; index: number }) {
  const [imgIdx, setImgIdx] = useState(0);

  function prev() {
    setImgIdx((i) => (i === 0 ? room.images.length - 1 : i - 1));
  }
  function next() {
    setImgIdx((i) => (i === room.images.length - 1 ? 0 : i + 1));
  }

  return (
    <ScrollReveal delay={index * 0.1} direction="up">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border h-full"
      >
        {/* Image carousel */}
        <div className="relative h-56 sm:h-64">
          <Image
            src={room.images[imgIdx]}
            alt={room.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {room.images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {room.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === imgIdx ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading text-lg font-semibold text-selva-dark">
              {room.name}
            </h3>
            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-arena-light px-2 py-1 rounded-full">
              <Users size={11} />
              {room.type}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {room.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {amenities.map((a) => (
              <span key={a} className="text-xs bg-arena-light text-selva-dark px-2 py-0.5 rounded-full">
                {a}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Desde</span>
              <p className="font-semibold text-selva">
                ${room.priceFrom.toLocaleString("es-CO")}
                <span className="text-xs font-normal text-muted-foreground"> / persona · noche</span>
              </p>
            </div>
            <Link
              href={`/reservar?room=${room.id}`}
              className="bg-turquesa hover:bg-selva text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Reservar
            </Link>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export default function Habitaciones() {
  return (
    <section id="habitaciones" className="py-20 bg-arena-light">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-turquesa text-sm font-semibold uppercase tracking-wider">
              Nuestras habitaciones
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-selva-dark mt-2 mb-3">
              Comodidad en el paraíso
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tres tipos de habitaciones para todos los grupos, con todo lo que
              necesita para descansar después de explorar Sapzurro.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
