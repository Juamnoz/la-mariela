"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get("password") as string;
  const expected = process.env.ADMIN_PASSWORD;

  if (!password) return { error: "Ingresa la contraseña" };
  if (password !== expected) return { error: "Contraseña incorrecta" };

  const cookieStore = await cookies();
  cookieStore.set("admin_session", `auth_${expected}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
