import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReservationActions from "@/components/admin/ReservationActions";

const LISA_API = process.env.LISA_API_URL!;
const AGENT_ID = process.env.LISA_AGENT_ID!;
const AGENT_TOKEN = process.env.LISA_AGENT_TOKEN!;

const STATUS_COLORS: Record<string, string> = {
  pending:     "bg-amber-100 text-amber-700",
  confirmed:   "bg-green-100 text-green-700",
  cancelled:   "bg-red-100 text-red-700",
  checked_in:  "bg-blue-100 text-blue-700",
  checked_out: "bg-slate-100 text-slate-600",
  no_show:     "bg-orange-100 text-orange-700",
};
const STATUS_LABELS: Record<string, string> = {
  pending:     "Pendiente",
  confirmed:   "Confirmada",
  cancelled:   "Cancelada",
  checked_in:  "En casa",
  checked_out: "Check-out",
  no_show:     "No show",
};

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(
    `${LISA_API}/public/reservations/${AGENT_ID}/by-id/${id}`,
    { headers: { "x-agent-token": AGENT_TOKEN }, cache: "no-store" }
  );
  if (!res.ok) notFound();

  const data = await res.json();
  const r = data.reservation ?? data;
  const nights = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / 86400000);

  const adminR = {
    id: r.id,
    confirmationCode: r.confirmationCode,
    guestName: r.guestName,
    guestEmail: r.guestEmail,
    guestPhone: r.guestPhone,
    numPersons: r.numPersons ?? r.adults,
    roomId: r.roomTypeId,
    room: { name: r.roomTypeName ?? "—", images: [] as string[] },
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    status: r.status,
    totalAmount: r.totalAmount ?? 0,
    depositPaid: 0,
    notes: r.notes,
    source: r.source ?? "motor_web",
    createdAt: r.createdAt,
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/reservas" className="text-sm text-muted-foreground hover:text-selva">
          ← Reservas
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-mono text-sm text-selva-dark">{adminR.confirmationCode ?? adminR.id}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-selva-dark">{adminR.guestName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Fuente: {adminR.source} · Creada el{" "}
              {format(new Date(adminR.createdAt), "d MMM yyyy HH:mm", { locale: es })}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[adminR.status] ?? "bg-muted text-muted-foreground"}`}>
            {STATUS_LABELS[adminR.status] ?? adminR.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
            <a href={`mailto:${adminR.guestEmail}`} className="text-selva hover:underline">{adminR.guestEmail}</a>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Teléfono</p>
            <a href={`tel:${adminR.guestPhone}`} className="text-selva hover:underline">{adminR.guestPhone}</a>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Personas</p>
            <p>{adminR.numPersons}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-5">
        <h2 className="font-semibold text-selva-dark mb-4">Detalles de la reserva</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Habitación</p>
            <p className="font-medium">{adminR.room.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Noches</p>
            <p className="font-medium">{nights}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Check-in</p>
            <p className="font-medium">{format(new Date(adminR.checkIn), "EEEE d MMM yyyy", { locale: es })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Check-out</p>
            <p className="font-medium">{format(new Date(adminR.checkOut), "EEEE d MMM yyyy", { locale: es })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Total</p>
            <p className="font-bold text-selva-dark text-base">${adminR.totalAmount.toLocaleString("es-CO")} COP</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Anticipo (50%)</p>
            <p className="font-bold text-amber-600">${Math.ceil(adminR.totalAmount * 0.5).toLocaleString("es-CO")} COP</p>
          </div>
          {adminR.notes && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Notas</p>
              <p className="bg-arena-light rounded-lg px-3 py-2 text-sm">{adminR.notes}</p>
            </div>
          )}
        </div>
      </div>

      <ReservationActions reservation={adminR} />
    </div>
  );
}
