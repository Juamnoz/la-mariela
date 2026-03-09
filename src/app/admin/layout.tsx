import { AdminLayoutWrapper } from "./AdminLayoutWrapper";

export const metadata = {
  title: "Admin — Casa Hotel La Mariela",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
