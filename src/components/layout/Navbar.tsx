"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#habitaciones", label: "Habitaciones" },
  { href: "#galeria", label: "Galería" },
  { href: "#como-llegar", label: "Cómo llegar" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-selva/10 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt="Casa Hotel La Mariela"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span
            className={`font-heading font-semibold text-lg leading-tight hidden sm:block transition-colors duration-300 ${
              scrolled ? "text-selva-dark" : "text-white drop-shadow"
            }`}
          >
            La Mariela
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                scrolled
                  ? "text-foreground/80 hover:text-selva"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/reservar"
            className={`hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              scrolled
                ? "bg-selva text-white hover:bg-selva-dark"
                : "bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30"
            }`}
          >
            Reservar ahora
          </Link>
          <button
            className={`md:hidden p-2 rounded-md transition-colors duration-300 ${
              scrolled ? "text-selva" : "text-white"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-selva/10 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/80 hover:text-selva"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/reservar"
            className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-selva text-white text-sm font-semibold"
            onClick={() => setOpen(false)}
          >
            Reservar ahora
          </Link>
        </div>
      )}
    </header>
  );
}
