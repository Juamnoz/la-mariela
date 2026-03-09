import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-selva-dark text-white/90">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="font-heading text-xl font-semibold text-white mb-3">
            Casa Hotel La Mariela
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Hospedaje familiar en Sapzurro, el paraíso más austral del Caribe
            colombiano. Naturaleza, tranquilidad y trato personalizado.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-3">
            Contacto
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-[#25D366] shrink-0"><WhatsAppIcon /></span>
              <a href="https://wa.me/573006168064" className="hover:text-white transition-colors">
                +57 300 6168064
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-turquesa shrink-0" />
              <a href="mailto:hotellamariela@gmail.com" className="hover:text-white transition-colors">
                hotellamariela@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-turquesa shrink-0 mt-0.5" />
              <span className="text-white/70">
                Sapzurro, Acandí, Chocó, Colombia
              </span>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-3">
            Navegación
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#habitaciones" className="hover:text-white transition-colors">Habitaciones</a></li>
            <li><a href="#galeria" className="hover:text-white transition-colors">Galería</a></li>
            <li><a href="#como-llegar" className="hover:text-white transition-colors">Cómo llegar</a></li>
            <li>
              <Link href="/reservar" className="hover:text-white transition-colors text-turquesa-light">
                Reservar ahora
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-white/60 transition-colors text-white/25 text-xs">
                Acceso administrador
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Casa Hotel La Mariela. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/lamarielasapzurro?igsh=MWxibDdiZDZucGZjMw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#e6683c] transition-colors"
              aria-label="Instagram @lamarielasapzurro"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.tiktok.com/@lamarielasapzurro?_r=1&_t=ZS-94PO8xC9WIW"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
              aria-label="TikTok @lamarielasapzurro"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
