import { Suspense } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ConfirmacionPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-arena-light pt-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 bg-selva/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-selva" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-selva-dark mb-3">
            ¡Pago recibido!
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Gracias por su reserva en Casa Hotel La Mariela. Le enviaremos la
            confirmación a su correo y nos pondremos en contacto para los
            detalles de llegada.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/573006168064?text=Hola%2C%20acabo%20de%20realizar%20el%20pago%20de%20mi%20reserva"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Confirmar por WhatsApp
            </a>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-selva transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
