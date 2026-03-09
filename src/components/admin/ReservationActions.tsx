"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

interface Reservation {
  id: string;
  status: string;
  guestEmail: string;
}

export default function ReservationActions({ reservation }: { reservation: Reservation }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(status: string) {
    setLoading(status);
    setError("");
    try {
      const res = await fetch(`/api/reservas/${reservation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error actualizando estado");
    } finally {
      setLoading(null);
    }
  }

  async function cancelReservation() {
    if (!confirm("¿Está seguro de cancelar esta reserva?")) return;
    setLoading("CANCELLED");
    setError("");
    try {
      const res = await fetch(`/api/reservas/${reservation.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cancelando reserva");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5 space-y-3">
      <h2 className="font-semibold text-selva-dark">Acciones</h2>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}
      <div className="flex gap-3 flex-wrap">
        {reservation.status === "PENDING" && (
          <button
            onClick={() => updateStatus("CONFIRMED")}
            disabled={!!loading}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === "CONFIRMED" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Confirmar reserva
          </button>
        )}
        {reservation.status === "CONFIRMED" && (
          <button
            onClick={() => updateStatus("PENDING")}
            disabled={!!loading}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Marcar como pendiente
          </button>
        )}
        {reservation.status !== "CANCELLED" && (
          <button
            onClick={cancelReservation}
            disabled={!!loading}
            className="flex items-center gap-2 border border-destructive/30 text-destructive hover:bg-destructive/5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === "CANCELLED" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            Cancelar reserva
          </button>
        )}
        <a
          href={`https://wa.me/${reservation.guestEmail.replace(/\D/g, "")}?text=Hola,%20le%20contactamos%20de%20Casa%20Hotel%20La%20Mariela%20sobre%20su%20reserva%20${reservation.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-selva text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-selva-dark transition-colors"
        >
          Contactar huésped
        </a>
      </div>
    </div>
  );
}
