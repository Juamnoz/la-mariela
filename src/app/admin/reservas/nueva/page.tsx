import NewReservationForm from "@/components/admin/NewReservationForm";
import Link from "next/link";

export default function NuevaReservaPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/reservas" className="text-sm text-muted-foreground hover:text-selva">
          ← Reservas
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-selva-dark">Nueva reserva manual</span>
      </div>
      <h1 className="font-heading text-2xl font-bold text-selva-dark">Nueva reserva</h1>
      <NewReservationForm />
    </div>
  );
}
