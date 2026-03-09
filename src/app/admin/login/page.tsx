"use client";
import { useActionState } from "react";
import { loginAction } from "../actions";
import Image from "next/image";
import { Eye, EyeOff, Lock, Loader2, Hotel } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-selva-dark via-selva to-turquesa/60 flex items-center justify-center px-4">
      {/* Background blur blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-turquesa/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-selva/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-7">

          {/* Logo + Brand */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg ring-2 ring-selva/20">
                <Image
                  src="/images/logo.jpg"
                  alt="La Mariela"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-selva-dark">
                Casa Hotel La Mariela
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
                <Hotel size={11} />
                Panel de administración
              </p>
            </div>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            {/* Error */}
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="text-base">⚠️</span>
                {state.error}
              </div>
            )}

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-selva uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={11} />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  autoFocus
                  placeholder="••••••••"
                  className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-selva/30 bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-selva transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 bg-selva hover:bg-selva-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {pending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Hotel size={16} />
              )}
              {pending ? "Verificando..." : "Ingresar al panel"}
            </button>
          </form>

          {/* Back to site */}
          <p className="text-center text-xs text-muted-foreground">
            <a href="/" className="hover:text-selva transition-colors">
              ← Volver al sitio web
            </a>
          </p>
        </div>

        <p className="text-center text-white/40 text-xs mt-4">
          Sapzurro · Chocó · Colombia
        </p>
      </div>
    </div>
  );
}
