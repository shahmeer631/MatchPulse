"use client";
import { useState } from "react";
import { matches } from "@/data/matches";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";

const PREMIUM_PASSWORD = "matchpulse123";

export default function PremiumPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (password === PREMIUM_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        setError("Contraseña incorrecta. Verifica tu acceso premium.");
      }
      setLoading(false);
    }, 600);
  };

  if (isAuthenticated) {
    return (
      <main className="min-h-screen pb-20">
        <div className="bg-dark-800 border-b border-white/5 pt-20 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs px-3 py-1.5 rounded-full">
                <span>👑</span> Sesión Premium Activa
              </div>
              <button
                onClick={() => { setIsAuthenticated(false); setPassword(""); }}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline">
                Cerrar sesión
              </button>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide mb-3">
              ANÁLISIS PREMIUM
            </h1>
            <p className="text-slate-400 text-sm">
              Acceso completo desbloqueado — todos los análisis IA disponibles.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} isPremiumUser={true} />
            ))}
          </div>
          <p className="text-center text-xs text-slate-700 mt-10">
            ⚠️ Análisis informativo. Sin garantía de resultados. +18. Juega con responsabilidad.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 pb-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center pt-12 mb-12">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs px-4 py-2 rounded-full mb-6">
            👑 Acceso Premium MatchPulse
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wide mb-4">
            ANÁLISIS SIN<br/>
            <span className="text-gold-400">LÍMITES.</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Desbloquea el análisis IA completo de todos los partidos de fútbol europeo.
            Toma decisiones más informadas, cada día.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* LEFT — Pricing + value */}
          <div className="space-y-5">
            {/* Pricing card */}
            <div className="relative bg-dark-700 border border-gold-500/40 rounded-2xl p-8 overflow-hidden"
              style={{ boxShadow: "0 0 40px rgba(245,158,11,0.1)" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"/>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-6xl text-white">9,99€</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">≈ 0,33€/día · Sin permanencia · Cancela cuando quieras</p>

              <ul className="space-y-2.5 mb-6">
                {[
                  "Análisis IA completo todos los partidos",
                  "Factores clave avanzados por partido",
                  "Recomendación accionable IA",
                  "Índice de confianza por encuentro",
                  "La Liga · Premier League · Serie A · CL",
                  "Actualizaciones diarias automáticas",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-gold-400 shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => alert("¡Próximamente! El sistema de pago estará disponible en breve.\n\nPara acceso de prueba usa la contraseña: matchpulse123")}
                className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold text-sm rounded-xl transition-all mb-3">
                Contratar Premium — 9,99€/mes →
              </button>
              <p className="text-center text-xs text-slate-600">
                Pago seguro · Sin permanencia · Cancela en 1 clic
              </p>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🔒", label: "Pago\nseguro" },
                { icon: "❌", label: "Sin\npermanencia" },
                { icon: "📊", label: "Datos\nreales" },
              ].map((t) => (
                <div key={t.label} className="bg-dark-700 border border-white/8 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{t.icon}</div>
                  <p className="text-xs text-slate-500 whitespace-pre-line leading-tight">{t.label}</p>
                </div>
              ))}
            </div>

            {/* Responsible gambling */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                ⚠️ <strong className="text-slate-400">Análisis informativo.</strong> MatchPulse proporciona estadísticas y análisis basado en datos.
                No garantizamos resultados. Apuesta de forma responsable. Solo +18.
                Si tienes problemas con el juego: <a href="https://www.jugarbien.es" target="_blank" className="text-brand-400 underline">JugarBien.es</a>
              </p>
            </div>
          </div>

          {/* RIGHT — Login form */}
          <div>
            <div className="bg-dark-700 border border-white/10 rounded-2xl p-8">
              <h2 className="font-display text-2xl text-white tracking-wide mb-2">YA TENGO ACCESO</h2>
              <p className="text-slate-400 text-sm mb-6">Introduce tu contraseña para entrar al área Premium</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                    Contraseña de acceso
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••••••"
                    className="w-full bg-dark-800 border border-white/10 focus:border-gold-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-mono"
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5">
                      <span>⚠</span> {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full py-4 bg-dark-600 hover:bg-dark-500 border border-white/15 hover:border-white/30 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Verificando...
                    </span>
                  ) : "Acceder →"}
                </button>
              </form>

              {/* Demo hint */}
              <div className="mt-5 bg-dark-800 border border-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-500 text-center">
                  🔑 <strong>Demo:</strong> contraseña{" "}
                  <code className="font-mono text-slate-300 bg-dark-700 px-1.5 py-0.5 rounded">matchpulse123</code>
                </p>
              </div>
            </div>

            {/* What's included preview */}
            <div className="mt-5 bg-dark-700 border border-white/8 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Con Premium desbloqueas:</h3>
              <div className="space-y-3">
                {[
                  { icon: "🤖", title: "Análisis IA completo", desc: "Texto completo para cada partido" },
                  { icon: "🎯", title: "Recomendación accionable", desc: "Qué apuesta analiza la IA" },
                  { icon: "🔑", title: "Factores clave avanzados", desc: "Hasta 5 factores por partido" },
                  { icon: "📈", title: "Confianza de la IA", desc: "Alta / Media / Baja por partido" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
