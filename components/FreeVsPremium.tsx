"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StripeCheckout from "./StripeCheckout";
import { hasPremiumAccess } from "@/lib/premiumAccess";

const freeFeatures = [
  { included: true,  text: "Ver partidos del día (todas las ligas)" },
  { included: true,  text: "Probabilidades básicas por partido" },
  { included: true,  text: "1 análisis completo al día" },
  { included: true,  text: "Estadísticas generales" },
  { included: false, text: "Análisis IA completo (todos los partidos)" },
  { included: false, text: "Factores clave avanzados" },
  { included: false, text: "Recomendación accionable por partido" },
  { included: false, text: "Índice de confianza IA" },
];

const premiumFeatures = [
  { included: true, text: "Todo lo gratuito incluido" },
  { included: true, text: "Análisis IA completo todos los partidos" },
  { included: true, text: "Factores clave avanzados detallados" },
  { included: true, text: "Recomendación accionable por partido" },
  { included: true, text: "Índice de confianza IA por encuentro" },
  { included: true, text: "Champions League + Europa League" },
  { included: true, text: "Actualizaciones automáticas diarias" },
  { included: true, text: "Soporte prioritario" },
];

export default function FreeVsPremium() {
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    setIsPremiumUser(hasPremiumAccess());
  }, []);

  return (
    <section id="precios" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-400 text-sm font-medium tracking-widest uppercase">Planes y precios</span>
          <h2 className="font-display text-5xl sm:text-6xl text-white mt-3 tracking-wide">ELIGE TU ACCESO</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">Empieza gratis. Actualiza cuando veas el valor. Sin permanencia.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FREE */}
          <div className="bg-dark-700 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5">
              <h3 className="font-display text-2xl text-white tracking-wide mb-1">GRATUITO</h3>
              <p className="text-xs text-slate-500 mb-4">Para explorar la plataforma</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl text-white">0€</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
            </div>
            <div className="p-8 flex-1">
              <ul className="space-y-3">
                {freeFeatures.map(f => (
                  <li key={f.text} className={`flex items-start gap-3 text-sm ${f.included ? "text-slate-300" : "text-slate-600"}`}>
                    <span className={`shrink-0 mt-0.5 font-bold ${f.included ? "text-brand-400" : "text-slate-700"}`}>
                      {f.included ? "✓" : "✗"}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 pb-8">
              <Link href="/matches" className="block w-full text-center py-3.5 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all">
                Empezar gratis
              </Link>
            </div>
          </div>

          {/* PREMIUM */}
          <div className="relative bg-dark-700 border border-gold-500/50 rounded-2xl overflow-hidden flex flex-col"
            style={{ boxShadow: "0 0 40px rgba(245,158,11,0.12)" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"/>
            <div className="absolute top-5 right-5 bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>

            <div className="p-8 border-b border-gold-500/10">
              <h3 className="font-display text-2xl text-gold-400 tracking-wide mb-1">PREMIUM</h3>
              <p className="text-xs text-slate-500 mb-4">Para apostar con ventaja informativa</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl text-white">9,99€</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">≈ 0,33€/día · Cancela cuando quieras</p>
            </div>

            <div className="p-8 flex-1">
              <ul className="space-y-3">
                {premiumFeatures.map(f => (
                  <li key={f.text} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="shrink-0 mt-0.5 font-bold text-gold-400">✓</span>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-8 pb-8">
              {isPremiumUser ? (
                <div>
                  <div className="w-full py-4 bg-brand-500/15 border border-brand-500/40 text-brand-400 font-bold text-sm rounded-xl text-center">
                    ✅ Premium activo — pago confirmado
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-2">
                    Ya tienes acceso completo a todos los análisis IA.
                  </p>
                </div>
              ) : (
                <StripeCheckout variant="gold" label="Activar Premium → 9,99€/mes" />
              )}
            </div>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            ⚠️ <strong className="text-slate-500">Aviso:</strong> MatchPulse es análisis informativo estadístico.
            No garantizamos resultados. Apuesta con responsabilidad. Solo +18.{" "}
            <Link href="/terminos" className="underline hover:text-slate-400">Términos</Link> ·{" "}
            <Link href="/privacidad" className="underline hover:text-slate-400">Privacidad</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
