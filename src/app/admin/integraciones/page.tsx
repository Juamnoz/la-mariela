import { hosroomEnabled } from "@/lib/hosroom";
import { channelManagerEnabled } from "@/lib/channel-manager";
import { HosroomPanel, ChannelManagerPanel } from "./IntegrationClient";
import { CheckCircle2, AlertTriangle, Plug, Globe, RefreshCw, Webhook } from "lucide-react";

function StatusBadge({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
      <CheckCircle2 size={12} /> Configurado
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
      <AlertTriangle size={12} /> Pendiente config.
    </span>
  );
}

function EnvInstructions({ vars }: { vars: { key: string; description: string }[] }) {
  return (
    <div className="bg-muted/60 rounded-xl p-4 text-xs space-y-2">
      <p className="font-semibold text-selva-dark mb-2">Variables requeridas en <code className="bg-white border border-border px-1.5 py-0.5 rounded">.env.local</code>:</p>
      {vars.map((v) => (
        <div key={v.key} className="flex gap-2">
          <code className="text-selva font-mono shrink-0">{v.key}=</code>
          <span className="text-muted-foreground">{v.description}</span>
        </div>
      ))}
    </div>
  );
}

export default function IntegracionesPage() {
  const hosroom = hosroomEnabled;
  const channelMgr = channelManagerEnabled;

  return (
    <div className="space-y-7 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-selva-dark flex items-center gap-2">
          <Plug size={22} className="text-turquesa" />
          Integraciones
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona la sincronización manual con el PMS y el Channel Manager.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-2xl border p-4 ${hosroom ? "bg-green-50 border-green-200" : "bg-white border-border"}`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">PMS</p>
          <p className="font-heading font-bold text-selva-dark">Hosroom</p>
          <div className="mt-2"><StatusBadge enabled={hosroom} /></div>
        </div>
        <div className={`rounded-2xl border p-4 ${channelMgr ? "bg-green-50 border-green-200" : "bg-white border-border"}`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Channel Manager</p>
          <p className="font-heading font-bold text-selva-dark">OTA Channels</p>
          <div className="mt-2"><StatusBadge enabled={channelMgr} /></div>
        </div>
      </div>

      {/* Hosroom PMS */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-selva/10 rounded-xl flex items-center justify-center">
              <Globe size={18} className="text-selva" />
            </div>
            <div>
              <h2 className="font-semibold text-selva-dark">Hosroom PMS</h2>
              <p className="text-xs text-muted-foreground">Property Management System</p>
            </div>
          </div>
          <StatusBadge enabled={hosroom} />
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Sincroniza reservas creadas en esta plataforma con Hosroom para unificar la gestión de tu propiedad.
          </p>

          {!hosroom && (
            <EnvInstructions vars={[
              { key: "HOSROOM_API_URL", description: "URL base de la API (ej: https://api.hosroom.com)" },
              { key: "HOSROOM_API_KEY", description: "API Key que te entrega Hosroom" },
            ]} />
          )}

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Acciones manuales</p>
            <HosroomPanel isConfigured={hosroom} />
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Qué sincroniza</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {["Reservas nuevas → Hosroom (crea booking en PMS)", "Cancelaciones → actualiza estado en PMS", "Disponibilidad ← Hosroom (consulta disponibilidad real)"].map((item) => (
                <li key={item} className="flex items-start gap-2"><span className="text-selva mt-0.5">→</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Channel Manager */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-turquesa/10 rounded-xl flex items-center justify-center">
              <RefreshCw size={18} className="text-turquesa" />
            </div>
            <div>
              <h2 className="font-semibold text-selva-dark">Channel Manager</h2>
              <p className="text-xs text-muted-foreground">Booking.com · Airbnb · Expedia</p>
            </div>
          </div>
          <StatusBadge enabled={channelMgr} />
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Mantén la disponibilidad actualizada en todos tus canales OTA automáticamente para evitar overbooking.
          </p>

          {!channelMgr && (
            <EnvInstructions vars={[
              { key: "CHANNEL_MANAGER_API_URL", description: "URL del Channel Manager (Cloudbeds, Beds24, SiteMinder…)" },
              { key: "CHANNEL_MANAGER_API_KEY", description: "API Key del Channel Manager" },
            ]} />
          )}

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Acciones manuales</p>
            <ChannelManagerPanel isConfigured={channelMgr} />
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Canales soportados</p>
            <div className="flex gap-2 flex-wrap">
              {["Booking.com", "Airbnb", "Expedia", "Despegar"].map((ch) => (
                <span key={ch} className="text-xs bg-arena-light text-selva-dark px-2.5 py-1 rounded-full font-medium">{ch}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Webhook info */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <Webhook size={16} className="text-muted-foreground" />
          <h2 className="font-semibold text-selva-dark">Webhook para reservas entrantes</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Configura este endpoint en tu Channel Manager para recibir reservas automáticamente:
        </p>
        <code className="block bg-muted rounded-xl px-4 py-3 text-xs text-selva-dark font-mono break-all">
          POST {process.env.NEXT_PUBLIC_BASE_URL}/api/reservas/webhook
        </code>
        <p className="text-xs text-muted-foreground mt-2">
          El endpoint procesa reservas de Booking.com, Airbnb y Expedia directamente en tu base de datos.
        </p>
      </div>
    </div>
  );
}
