"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Hotel, LogOut, ExternalLink, Plug } from "lucide-react";
import { logoutAction } from "./actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservas", label: "Reservas", icon: Calendar, exact: false },
  { href: "/admin/integraciones", label: "Integraciones", icon: Plug, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="w-60 bg-selva-dark text-white shrink-0 hidden md:flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-turquesa/20 rounded-lg flex items-center justify-center">
            <Hotel size={16} className="text-turquesa" />
          </div>
          <div>
            <p className="font-heading font-semibold text-sm text-white leading-tight">La Mariela</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <item.icon size={16} className={active ? "text-turquesa" : ""} />
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 bg-turquesa rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
        >
          <ExternalLink size={15} />
          Ver sitio web
        </a>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

export function AdminMobileTopbar() {
  const pathname = usePathname();
  return (
    <div className="md:hidden bg-selva-dark text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Hotel size={16} className="text-turquesa" />
        <span className="font-heading font-semibold text-sm">La Mariela Admin</span>
      </div>
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <form action={logoutAction} className="ml-1">
          <button
            type="submit"
            className="p-1.5 rounded-lg text-white/50 hover:text-red-300 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
