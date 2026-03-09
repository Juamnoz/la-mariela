"use client";
import { useState } from "react";
import { Loader2, RefreshCw, Wifi, WifiOff, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

type Result = { ok: boolean; message: string; count?: number } | null;

function ResultBadge({ result }: { result: Result }) {
  if (!result) return null;
  return (
    <div className={`flex items-start gap-2 text-sm rounded-xl px-4 py-3 mt-3 ${
      result.ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
    }`}>
      {result.ok ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
      <span>{result.message}</span>
    </div>
  );
}

function SyncButton({ label, icon: Icon = RefreshCw, variant = "primary", onClick, loading }: {
  label: string;
  icon?: typeof RefreshCw;
  variant?: "primary" | "secondary";
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60 ${
        variant === "primary"
          ? "bg-selva hover:bg-selva-dark text-white"
          : "bg-white border border-border hover:border-selva/40 text-selva-dark hover:bg-muted/30"
      }`}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Icon size={15} />}
      {label}
    </button>
  );
}

export function HosroomPanel({ isConfigured }: { isConfigured: boolean }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);

  async function run(action: () => Promise<Result>, key: string) {
    setLoading(key);
    setResult(null);
    const r = await action();
    setResult(r);
    setLoading(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <SyncButton
          label="Probar conexión"
          icon={Wifi}
          variant="secondary"
          loading={loading === "test"}
          onClick={async () => {
            const { testHosroomConnection } = await import("./actions");
            run(testHosroomConnection, "test");
          }}
        />
        <SyncButton
          label="Sincronizar todas las reservas"
          icon={RefreshCw}
          loading={loading === "sync"}
          onClick={async () => {
            const { syncAllReservationsToHosroom } = await import("./actions");
            run(syncAllReservationsToHosroom, "sync");
          }}
        />
      </div>
      <ResultBadge result={result} />
    </div>
  );
}

export function ChannelManagerPanel({ isConfigured }: { isConfigured: boolean }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);

  async function run(action: () => Promise<Result>, key: string) {
    setLoading(key);
    setResult(null);
    const r = await action();
    setResult(r);
    setLoading(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <SyncButton
          label="Probar conexión"
          icon={Wifi}
          variant="secondary"
          loading={loading === "test"}
          onClick={async () => {
            const { testChannelManagerConnection } = await import("./actions");
            run(testChannelManagerConnection, "test");
          }}
        />
        <SyncButton
          label="Sincronizar disponibilidad"
          icon={RefreshCw}
          loading={loading === "avail"}
          onClick={async () => {
            const { syncAvailabilityToChannels } = await import("./actions");
            run(syncAvailabilityToChannels, "avail");
          }}
        />
      </div>
      <ResultBadge result={result} />
    </div>
  );
}
