import Link from "next/link";
import db from "@/lib/db";
import { format, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Users, Clock, TrendingUp, ChevronRight, Plus, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

async function getStats() {
  const today = new Date();
  const [todayCheckIns, todayCheckOuts, pending, confirmed, occupied, total] = await Promise.all([
    db.reservation.count({ where: { checkIn: { gte: startOfDay(today), lte: endOfDay(today) }, status: { not: "CANCELLED" } } }),
    db.reservation.count({ where: { checkOut: { gte: startOfDay(today), lte: endOfDay(today) }, status: { not: "CANCELLED" } } }),
    db.reservation.count({ where: { status: "PENDING" } }),
    db.reservation.count({ where: { status: "CONFIRMED" } }),
    db.reservation.count({ where: { status: { not: "CANCELLED" }, checkIn: { lte: today }, checkOut: { gte: today } } }),
    db.reservation.count({ where: { status: { not: "CANCELLED" } } }),
  ]);
  return { todayCheckIns, todayCheckOuts, pending, confirmed, occupied, total };
}

async function getRecentReservations() {
  const reservations = await db.reservation.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  return reservations.map((r) => ({ ...r, room: { ...r.room, images: JSON.parse(r.room.images) } }));
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  PENDING:   { label: "Pendiente",  color: "bg-amber-100 text-amber-700",  icon: AlertCircle },
  CONFIRMED: { label: "Confirmada", color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  CANCELLED: { label: "Cancelada",  color: "bg-red-100 text-red-600",      icon: XCircle },
};

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentReservations()]);

  const statCards = [
    { label: "Check-ins hoy",     value: stats.todayCheckIns,  icon: Calendar,    color: "bg-turquesa/10 text-turquesa",  border: "border-turquesa/20" },
    { label: "Check-outs hoy",    value: stats.todayCheckOuts, icon: Calendar,    color: "bg-selva/10 text-selva",        border: "border-selva/20" },
    { label: "Pendientes",        value: stats.pending,        icon: Clock,       color: "bg-amber-50 text-amber-600",    border: "border-amber-200" },
    { label: "Habitaciones ocup.", value: `${stats.occupied}/3`, icon: Users,    color: "bg-purple-50 text-purple-600",  border: "border-purple-200" },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-selva-dark">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
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

      {/* Stat cards */}
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

      {/* Recent reservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-selva" />
            <h2 className="font-semibold text-selva-dark">Reservas recientes</h2>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{stats.total} total</span>
          </div>
          <Link href="/admin/reservas" className="text-sm text-turquesa hover:underline font-medium flex items-center gap-1">
            Ver todas <ChevronRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-14 text-muted-foreground">
            <Calendar size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No hay reservas aún.</p>
            <Link href="/admin/reservas/nueva" className="text-xs text-turquesa hover:underline mt-1 inline-block">
              Crear la primera reserva
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((r) => {
              const cfg = STATUS_CONFIG[r.status];
              const Icon = cfg.icon;
              return (
                <Link
                  key={r.id}
                  href={`/admin/reservas/${r.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group"
                >
                  {/* Status dot */}
                  <Icon size={16} className={r.status === "CONFIRMED" ? "text-green-500 shrink-0" : r.status === "PENDING" ? "text-amber-500 shrink-0" : "text-red-400 shrink-0"} />

                  {/* Guest info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-selva-dark truncate">{r.guestName}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.room.name} · {format(new Date(r.checkIn), "d MMM", { locale: es })} → {format(new Date(r.checkOut), "d MMM yyyy", { locale: es })}
                    </p>
                  </div>

                  {/* Amount */}
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

      {/* Integration stubs */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
        <h2 className="font-semibold text-selva-dark mb-1">Integraciones</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Configura las claves en <code className="bg-muted px-1 rounded">.env.local</code> para activar la sincronización.
        </p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-dashed border-border text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            Hosroom PMS — pendiente config.
          </div>
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-dashed border-border text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            Channel Manager — pendiente config.
          </div>
        </div>
      </div>
    </div>
  );
}
