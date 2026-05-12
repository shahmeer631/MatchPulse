"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  const params = useSearchParams();
  useEffect(() => setMounted(true), []);
  const sessionId = params.get("session_id");
  const premiumHref = sessionId ? `/premium?session_id=${encodeURIComponent(sessionId)}` : "/premium";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-brand-500/20 border-2 border-brand-500 flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-display text-4xl text-white tracking-wide mb-3">¡BIENVENIDO A PREMIUM!</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Tu suscripción está activa. Ya tienes acceso completo a todos los análisis IA de MatchPulse.
        </p>
        <div className="bg-dark-700 border border-brand-500/20 rounded-2xl p-6 mb-8 text-left space-y-3">
          {["Análisis IA completo — todos los partidos", "Factores clave avanzados por partido", "Recomendaciones accionables diarias", "La Liga · Premier · Serie A · Champions"].map(f => (
            <div key={f} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="text-brand-400 shrink-0">✓</span>{f}
            </div>
          ))}
        </div>
        <Link href={premiumHref} className="block w-full py-4 bg-brand-500 hover:bg-brand-400 text-dark-900 font-bold text-sm rounded-xl transition-all">
          Acceder a mis análisis →
        </Link>
        <p className="text-xs text-slate-600 mt-4">Recibirás un email de confirmación con los detalles de tu suscripción</p>
      </div>
    </main>
  );
}
