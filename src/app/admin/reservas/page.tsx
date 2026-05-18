import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, ChevronRight, AlertCircle, Phone } from "lucide-react";

const LISA_API = process.env.LISA_API_URL!;
const AGENT_ID = process.env.LISA_AGENT_ID!;
const AGENT_TOKEN = process.env.LISA_AGENT_TOKEN!;

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  pending:     { label: "Pendiente",  color: "bg-amber-100 text-amber-700",  dot: "bg-amber-400" },
  confirmed:   { label: "Confirmada", color: "bg-green-100 text-green-700",  dot: "bg-green-500" },
  cancelled:   { label: "Cancelada",  color: "bg-red-100 text-red-600",      dot: "bg-red-400" },
  checked_in:  { label: "En casa",    color: "bg-blue-100 text-blue-700",    dot: "bg-blue-500" },
  checked_out: { label: "Check-out",  color: "bg-slate-100 text-slate-600",  dot: "bg-slate-400" },
  no_show:     { label: "No show",    color: "bg-orange-100 text-orange-700",dot: "bg-orange-400" },
};

const FILTER_TABS = [
  { value: undefined,    label: "Todas" },
  { value: "pending",    label: "Pendientes" },
  { value: "confirmed",  label: "Confirmadas" },
  { value: "cancelled",  label: "Canceladas" },
];

async function getReservations(status?: string) {
  try {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    const res = await fetch(
      `${LISA_API}/public/reservations/${AGENT_ID}/list?${params}`,
      { headers: { "x-agent-token": AGENT_TOKEN }, cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.reservations ?? [];
  } catch {
    return [];
  }
}

export default async function ReservasPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const reservations = await getReservations(status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-selva-dark">Reservas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{reservations.length} resultado{reservations.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/reservas/nueva"
          className="flex items-center gap-2 bg-selva text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-selva-dark transition-colors shadow-sm"
        >
          <Plus size={15} />
          Nueva
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => {
          const active = status === tab.value || (!status && !tab.value);
          return (
            <Link
              key={tab.label}
              href={tab.value ? `/admin/reservas?status=${tab.value}` : "/admin/reservas"}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors border ${
                active
                  ? "bg-selva text-white border-selva"
                  : "bg-white border-border text-muted-foreground hover:border-selva/40 hover:text-selva-dark"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border py-16 text-center">
          <AlertCircle size={36} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No hay reservas en esta categoría.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-xs uppercase text-muted-foreground tracking-wide border-b border-border">
                  <th className="text-left px-5 py-3">Huésped</th>
                  <th className="text-left px-4 py-3">Habitación</th>
                  <th className="text-left px-4 py-3">Fechas</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-right px-5 py-3">Total</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reservations.map((r: typeof reservations[0]) => {
                  const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG["pending"];
                  return (
                    <tr key={r.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-selva-dark">{r.guestName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{r.confirmationCode ?? r.id}</p>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{r.roomTypeName ?? "—"}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {format(new Date(r.checkIn), "d MMM", { locale: es })} →{" "}
                        {format(new Date(r.checkOut), "d MMM yyyy", { locale: es })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-selva-dark">
                        ${r.totalAmount?.toLocaleString("es-CO") ?? "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/admin/reservas/${r.id}`} className="text-turquesa hover:text-selva transition-colors">
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {reservations.map((r: typeof reservations[0]) => {
              const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG["pending"];
              return (
                <Link
                  key={r.id}
                  href={`/admin/reservas/${r.id}`}
                  className="block bg-white rounded-2xl border border-border p-4 shadow-sm hover:border-selva/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-selva-dark">{r.guestName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{r.confirmationCode ?? r.id}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>{r.roomTypeName ?? "—"}</span>
                    <span className="text-right font-semibold text-selva-dark text-sm">
                      ${r.totalAmount?.toLocaleString("es-CO") ?? "—"}
                    </span>
                    <span>
                      {format(new Date(r.checkIn), "d MMM", { locale: es })} → {format(new Date(r.checkOut), "d MMM", { locale: es })}
                    </span>
                    <span className="text-right flex items-center justify-end gap-1">
                      <Phone size={11} /> {r.guestPhone}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
