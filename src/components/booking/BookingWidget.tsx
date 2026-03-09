"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Search, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const appleEase = [0.22, 1, 0.36, 1] as const;

export function BookingWidget() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [persons, setPersons] = useState(2);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      `/reservar?checkIn=${checkIn}&checkOut=${checkOut}&persons=${persons}`
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Check-in */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-selva uppercase tracking-wide">
            <Calendar size={12} />
            Llegada
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-selva/30"
            required
          />
        </div>

        {/* Check-out */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-selva uppercase tracking-wide">
            <Calendar size={12} />
            Salida
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-selva/30"
            required
          />
        </div>

        {/* Persons stepper */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-selva uppercase tracking-wide">
            <Users size={12} />
            Personas
          </label>
          <div className="flex items-center border border-border rounded-lg px-3 py-1.5 bg-white gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => setPersons((p) => Math.max(1, p - 1))}
              disabled={persons <= 1}
              className="text-selva disabled:opacity-30"
            >
              <Minus size={14} />
            </motion.button>

            <div className="flex-1 text-center overflow-hidden h-6 flex items-center justify-center relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={persons}
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ duration: 0.15, ease: appleEase }}
                  className="text-sm font-semibold text-selva-dark absolute"
                >
                  {persons} {persons === 1 ? "persona" : "personas"}
                </motion.span>
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => setPersons((p) => Math.min(5, p + 1))}
              disabled={persons >= 5}
              className="text-selva disabled:opacity-30"
            >
              <Plus size={14} />
            </motion.button>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-selva hover:bg-selva-dark text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        <Search size={16} />
        Verificar disponibilidad
      </motion.button>
    </form>
  );
}
