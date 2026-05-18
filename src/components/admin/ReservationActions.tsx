"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

interface Reservation {
  id: string;
  status: string;
  guestPhone?: string;
  guestName?: string;
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
      if (!res.ok) throw new Error((await res.json()).error ?? "Error");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error actualizando estado");
    } finally {
      setLoading(null);
    }
  }

  async function cancelReservation() {
    if (!confirm("¿Está seguro de cancelar esta reserva?")) return;
    setLoading("cancelled");
    setError("");
    try {
      const res = await fetch(`/api/reservas/${reservation.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Error");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cancelando reserva");
    } finally {
      setLoading(null);
    }
  }

  const isPending = reservation.status === "pending";
  const isConfirmed = reservation.status === "confirmed";
  const isCancelled = reservation.status === "cancelled";

  const waPhone = reservation.guestPhone?.replace(/\D/g, "") ?? "";
  const waMsg = encodeURIComponent(
    `Hola ${reservation.guestName ?? ""}, le contactamos de Casa Hotel La Mariela sobre su reserva ${reservation.id}.`
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5 space-y-3">
      <h2 className="font-semibold text-selva-dark">Acciones</h2>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}
      <div className="flex gap-3 flex-wrap">
        {isPending && (
          <button
            onClick={() => updateStatus("confirmed")}
            disabled={!!loading}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === "confirmed" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Confirmar reserva
          </button>
        )}
        {isConfirmed && (
          <>
            <button
              onClick={() => updateStatus("checked_in")}
              disabled={!!loading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Check-in
            </button>
            <button
              onClick={() => updateStatus("pending")}
              disabled={!!loading}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Marcar como pendiente
            </button>
          </>
        )}
        {reservation.status === "checked_in" && (
          <button
            onClick={() => updateStatus("checked_out")}
            disabled={!!loading}
            className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Check-out
          </button>
        )}
        {!isCancelled && (
          <button
            onClick={cancelReservation}
            disabled={!!loading}
            className="flex items-center gap-2 border border-destructive/30 text-destructive hover:bg-destructive/5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === "cancelled" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            Cancelar reserva
          </button>
        )}
        {waPhone && (
          <a
            href={`https://wa.me/${waPhone}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            WhatsApp huésped
          </a>
        )}
      </div>
    </div>
  );
}
