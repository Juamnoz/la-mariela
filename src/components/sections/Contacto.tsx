"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}

const contactItems = [
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: "+57 300 6168064",
    href: "https://wa.me/573006168064?text=Hola%2C%20quisiera%20información%20sobre%20Casa%20Hotel%20La%20Mariela",
    color: "bg-[#25D366]",
  },
  {
    icon: "phone",
    label: "Teléfono",
    value: "+57 300 6168064",
    href: "tel:+573006168064",
    color: "bg-selva",
  },
  {
    icon: "mail",
    label: "Email",
    value: "hotellamariela@gmail.com",
    href: "mailto:hotellamariela@gmail.com",
    color: "bg-turquesa",
  },
  {
    icon: "map",
    label: "Ubicación",
    value: "Sapzurro, Acandí, Chocó",
    href: "https://maps.google.com/?q=Sapzurro+Choco+Colombia",
    color: "bg-arena",
  },
];

function ContactIcon({ type }: { type: string }) {
  if (type === "whatsapp") return <WhatsAppIcon size={22} />;
  if (type === "phone") return <Phone size={22} />;
  if (type === "mail") return <Mail size={22} />;
  return <MapPin size={22} />;
}

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/lamarielasapzurro?igsh=MWxibDdiZDZucGZjMw==",
    icon: <InstagramIcon size={20} />,
    color: "bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@lamarielasapzurro?_r=1&_t=ZS-94PO8xC9WIW",
    icon: <TikTokIcon size={20} />,
    color: "bg-black",
  },
];

export default function Contacto() {
  return (
    <section id="contacto" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-turquesa-light/30 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-turquesa text-sm font-semibold uppercase tracking-wider">
              Contáctenos
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-selva-dark mt-2 mb-3">
              Estamos aquí para usted
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Escríbanos o llámenos con cualquier pregunta. Respondemos con gusto
              y rapidez.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto items-stretch">
          {contactItems.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 0.08} className="h-full">
              <motion.a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border hover:border-selva/30 hover:shadow-md transition-all bg-white h-full"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-white`}
                >
                  <ContactIcon type={item.icon} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-selva-dark">
                  {item.value}
                </span>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2}>
          <div className="flex items-center justify-center gap-4 mt-8">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${s.color} text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:opacity-90 hover:scale-105 transition-all`}
              >
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 text-center">
            <a
              href="https://wa.me/573006168064?text=Hola%2C%20quiero%20hacer%20una%20reserva%20en%20Casa%20Hotel%20La%20Mariela"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base"
            >
              <WhatsAppIcon size={22} />
              Reservar por WhatsApp
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              También puedes hacer tu reserva directamente en nuestra plataforma
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/573006168064"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon size={28} />
      </a>
    </section>
  );
}
