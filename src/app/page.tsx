import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Habitaciones from "@/components/sections/Habitaciones";
import Galeria from "@/components/sections/Galeria";
import Resenas from "@/components/sections/Resenas";
import ComoLlegar from "@/components/sections/ComoLlegar";
import Contacto from "@/components/sections/Contacto";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Habitaciones />
        <Galeria />
        <Resenas />
        <ComoLlegar />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
