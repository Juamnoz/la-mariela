import Link from "next/link";
import { format, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Users, Clock, TrendingUp, ChevronRight, Plus, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const LISA_API = process.env.LISA_API_URL!;
const AGENT_ID = process.env.LISA_AGENT_ID!;
const AGENT_TOKEN = process.env.LISA_AGENT_TOKEN!;

type Reservation = {
  id: string;
  confirmationCode?: string;
  roomTypeId: string;
  roomTypeName: string | null;
  checkIn: string;
  checkOut: string;
  numPersons: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  status: string;
  totalAmount: number;
  createdAt: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending:     { label: "Pendiente",  color: "bg-amber-100 text-amber-700",  icon: AlertCircle },
  confirmed:   { label: "Confirmada", color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  cancelled:   { label: "Cancelada",  color: "bg-red-100 text-red-600",      icon: XCircle },
  checked_in:  { label: "En casa",    color: "bg-blue-100 text-blue-700",    icon: CheckCircle2 },
  checked_out: { label: "Check-out",  color: "bg-slate-100 text-slate-600",  icon: CheckCircle2 },
};

async function getReservations(): Promise<Reservation[]> {
  try {
    const res = await fetch(
      `${LISA_API}/public/reservations/${AGENT_ID}/list`,
      { headers: { "x-agent-token": AGENT_TOKEN }, cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.reservations ?? [];
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const reservations = await getReservations();

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const active = reservations.filter(r => r.status !== "cancelled");
  const todayCheckIns = active.filter(r => isWithinInterval(new Date(r.checkIn), { start: todayStart, end: todayEnd })).length;
  const todayCheckOuts = active.filter(r => isWithinInterval(new Date(r.checkOut), { start: todayStart, end: todayEnd })).length;
  const pending = reservations.filter(r => r.status === "pending").length;
  const occupied = active.filter(r => new Date(r.checkIn) <= today && new Date(r.checkOut) >= today).length;
  const recent = reservations.slice(0, 8);

  const statCards = [
    { label: "Check-ins hoy",      value: todayCheckIns,      icon: Calendar, color: "bg-turquesa/10 text-turquesa",  border: "border-turquesa/20" },
    { label: "Check-outs hoy",     value: todayCheckOuts,     icon: Calendar, color: "bg-selva/10 text-selva",        border: "border-selva/20" },
    { label: "Pendientes",         value: pending,            icon: Clock,    color: "bg-amber-50 text-amber-600",    border: "border-amber-200" },
    { label: "Habitaciones ocup.", value: `${occupied}/10`,   icon: Users,    color: "bg-purple-50 text-purple-600",  border: "border-purple-200" },
  ];

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-selva-dark">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(today, "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </p>
        </div>
        <Link
          href="/admin/reservas/nueva"
          className="flex items-center gap-2 bg-selva text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-selva-dark transition-colors shadow-sm"
        >
          <Plus size={15} />
          Nueva reserva
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`bg-white rounded-2xl p-5 shadow-sm border ${card.border}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-selva-dark">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-selva" />
            <h2 className="font-semibold text-selva-dark">Reservas recientes</h2>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{reservations.length} total</span>
          </div>
          <Link href="/admin/reservas" className="text-sm text-turquesa hover:underline font-medium flex items-center gap-1">
            Ver todas <ChevronRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-14 text-muted-foreground">
            <Calendar size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No hay reservas aún.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((r) => {
              const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG["pending"];
              const Icon = cfg.icon;
              return (
                <Link
                  key={r.id}
                  href={`/admin/reservas/${r.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group"
                >
                  <Icon size={16} className={r.status === "confirmed" || r.status === "checked_in" ? "text-green-500 shrink-0" : r.status === "pending" ? "text-amber-500 shrink-0" : "text-red-400 shrink-0"} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-selva-dark truncate">{r.guestName}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.roomTypeName ?? "—"} · {format(new Date(r.checkIn), "d MMM", { locale: es })} → {format(new Date(r.checkOut), "d MMM yyyy", { locale: es })}
                    </p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-sm font-semibold text-selva-dark">${r.totalAmount.toLocaleString("es-CO")}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <ChevronRight size={15} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
        <h2 className="font-semibold text-selva-dark mb-1">Motor de reservas</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Conectado a LISA · Agente <code className="bg-muted px-1 rounded">{AGENT_ID?.slice(0, 8)}…</code>
        </p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-selva/30 text-selva bg-selva/5">
            <span className="w-2 h-2 rounded-full bg-selva shrink-0" />
            LISA PMS — activo
          </div>
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-dashed border-border text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            Channel Manager — pendiente
          </div>
        </div>
      </div>
    </div>
  );
}
