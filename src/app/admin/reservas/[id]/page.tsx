import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReservationActions from "@/components/admin/ReservationActions";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await db.reservation.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!reservation) notFound();

  const r = { ...reservation, room: { ...reservation.room, images: JSON.parse(reservation.room.images) } };
  const nights = Math.ceil(
    (new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / 86400000
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/reservas" className="text-sm text-muted-foreground hover:text-selva">
          ← Reservas
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-mono text-sm text-selva-dark">{r.id}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-selva-dark">{r.guestName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Fuente: {r.source || "directo"} · Creada el{" "}
              {format(new Date(r.createdAt), "d MMM yyyy HH:mm", { locale: es })}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[r.status]}`}>
            {STATUS_LABELS[r.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
            <a href={`mailto:${r.guestEmail}`} className="text-selva hover:underline">{r.guestEmail}</a>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Teléfono</p>
            <a href={`tel:${r.guestPhone}`} className="text-selva hover:underline">{r.guestPhone}</a>
          </div>
          {r.guestId && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Cédula</p>
              <p>{r.guestId}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Personas</p>
            <p>{r.numPersons}</p>
          </div>
        </div>
      </div>

      {/* Booking details */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-5">
        <h2 className="font-semibold text-selva-dark mb-4">Detalles de la reserva</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Habitación</p>
            <p className="font-medium">{r.room.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Noches</p>
            <p className="font-medium">{nights}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Check-in</p>
            <p className="font-medium">
              {format(new Date(r.checkIn), "EEEE d MMM yyyy", { locale: es })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Check-out</p>
            <p className="font-medium">
              {format(new Date(r.checkOut), "EEEE d MMM yyyy", { locale: es })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Total</p>
            <p className="font-bold text-selva-dark text-base">
              ${r.totalAmount.toLocaleString("es-CO")} COP
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Abono pagado</p>
            <p className={`font-bold ${r.depositPaid > 0 ? "text-green-600" : "text-amber-500"}`}>
              ${r.depositPaid.toLocaleString("es-CO")} COP
            </p>
          </div>
          {r.wompiTxId && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Tx Wompi</p>
              <p className="font-mono text-xs">{r.wompiTxId}</p>
            </div>
          )}
          {r.notes && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Notas</p>
              <p className="bg-arena-light rounded-lg px-3 py-2 text-sm">{r.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <ReservationActions reservation={r} />
    </div>
  );
}
