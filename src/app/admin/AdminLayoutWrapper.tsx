"use client";
import { usePathname } from "next/navigation";
import { AdminSidebar, AdminMobileTopbar } from "./AdminSidebar";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-arena-light flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminMobileTopbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
