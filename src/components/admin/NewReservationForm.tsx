"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const ROOMS = [
  { id: "HAB-FAM-01", name: "Habitación Familiar (máx 5)" },
  { id: "HAB-TRI-01", name: "Habitación Triple (máx 3)" },
  { id: "HAB-CUA-01", name: "Habitación Cuádruple (máx 4)" },
];

const SOURCES = [
  { value: "directo", label: "Directo" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "booking", label: "Booking.com" },
  { value: "airbnb", label: "Airbnb" },
];

export default function NewReservationForm() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    roomId: "HAB-FAM-01",
    checkIn: today,
    checkOut: tomorrow,
    numPersons: 2,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestId: "",
    notes: "",
    source: "directo",
  });

  function set(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/admin/reservas/${data.reservation.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error creando reserva");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Room & dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label-field">Habitación</label>
          <select
            value={form.roomId}
            onChange={(e) => set("roomId", e.target.value)}
            className="field"
          >
            {ROOMS.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">Check-in</label>
          <input type="date" value={form.checkIn} min={today} onChange={(e) => set("checkIn", e.target.value)} className="field" required />
        </div>
        <div>
          <label className="label-field">Check-out</label>
          <input type="date" value={form.checkOut} min={form.checkIn} onChange={(e) => set("checkOut", e.target.value)} className="field" required />
        </div>
        <div>
          <label className="label-field">Personas</label>
          <select value={form.numPersons} onChange={(e) => set("numPersons", Number(e.target.value))} className="field">
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Fuente</label>
          <select value={form.source} onChange={(e) => set("source", e.target.value)} className="field">
            {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <hr className="border-border" />

      {/* Guest data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Nombre completo *</label>
          <input type="text" value={form.guestName} onChange={(e) => set("guestName", e.target.value)} className="field" required placeholder="Nombre y apellidos" />
        </div>
        <div>
          <label className="label-field">Cédula</label>
          <input type="text" value={form.guestId} onChange={(e) => set("guestId", e.target.value)} className="field" placeholder="Opcional" />
        </div>
        <div>
          <label className="label-field">Email *</label>
          <input type="email" value={form.guestEmail} onChange={(e) => set("guestEmail", e.target.value)} className="field" required placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label className="label-field">Teléfono *</label>
          <input type="tel" value={form.guestPhone} onChange={(e) => set("guestPhone", e.target.value)} className="field" required placeholder="+57 300 0000000" />
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">Notas</label>
          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="field resize-none" placeholder="Notas internas..." />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-selva hover:bg-selva-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        Crear reserva
      </button>

      <style>{`
        .label-field { display: block; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: oklch(0.42 0.12 148); margin-bottom: 0.25rem; }
        .field { width: 100%; border: 1px solid oklch(0.88 0.04 148); border-radius: 0.5rem; padding: 0.6rem 0.75rem; font-size: 0.875rem; background: white; }
        .field:focus { outline: none; box-shadow: 0 0 0 2px oklch(0.42 0.12 148 / 0.3); }
      `}</style>
    </form>
  );
}
