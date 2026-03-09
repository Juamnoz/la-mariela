import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingForm from "@/components/booking/BookingForm";

export const metadata = {
  title: "Reservar — Casa Hotel La Mariela",
  description: "Reserve su estadía en Casa Hotel La Mariela, Sapzurro.",
};

export default function ReservarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-arena-light pt-20">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-selva-dark mb-2">
              Reserve su estadía
            </h1>
            <p className="text-muted-foreground text-sm">
              Proceso seguro en 4 pasos. Pague solo el 50% para confirmar.
            </p>
          </div>
          <Suspense fallback={<div className="text-center py-20">Cargando...</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
