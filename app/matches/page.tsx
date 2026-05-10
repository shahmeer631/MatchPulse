"use client";
import { useState } from "react";
import { matches, League } from "@/data/matches";
import MatchCard from "@/components/MatchCard";
import EmailCapture from "@/components/EmailCapture";
import Link from "next/link";

const leagues: (League | "Todas")[] = ["Todas", "La Liga", "Premier League", "Serie A", "Champions League"];

const leagueIcons: Record<string, string> = {
  "Todas": "⚽",
  "La Liga": "🇪🇸",
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Serie A": "🇮🇹",
  "Champions League": "🏆",
};

export default function MatchesPage() {
  const [activeLeague, setActiveLeague] = useState<League | "Todas">("Todas");
  const isPremiumUser = false;

  const filtered = activeLeague === "Todas"
    ? matches
    : matches.filter((m) => m.league === activeLeague);

  const freeCount = filtered.filter(m => !m.insight.isPremium).length;
  const premiumCount = filtered.filter(m => m.insight.isPremium).length;

  return (
    <main className="min-h-screen pb-20">

      {/* Page header */}
      <div className="bg-dark-800 border-b border-white/5 pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-brand-400 text-sm mb-3">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"/>
            Actualizado hoy · {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide mb-3">
            PARTIDOS DE HOY
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Análisis estadístico con IA para cada partido. Los usuarios gratuitos tienen acceso parcial —
            activa Premium para ver el análisis completo.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-lg px-3 py-1.5">
              <span className="w-2 h-2 bg-brand-500 rounded-full"/>
              <span className="text-slate-400">{freeCount} análisis gratuitos</span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-lg px-3 py-1.5">
              <span className="w-2 h-2 bg-gold-500 rounded-full"/>
              <span className="text-slate-400">{premiumCount} análisis premium</span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-lg px-3 py-1.5">
              <span className="text-slate-400">⚽ {filtered.length} partidos en total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Premium upgrade banner */}
        {!isPremiumUser && (
          <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-dark-700 to-dark-700 border border-gold-500/30 rounded-2xl p-5"
            style={{ boxShadow: "0 0 30px rgba(245,158,11,0.08)" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"/>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">👑</span>
                <div>
                  <h3 className="text-sm font-bold text-gold-400 mb-1">
                    {premiumCount} análisis bloqueados por Premium
                  </h3>
                  <p className="text-xs text-slate-400">
                    Activa Premium por 9,99€/mes y desbloquea el análisis completo de todos los partidos:
                    probabilidades detalladas, factores clave avanzados y recomendaciones accionables.
                  </p>
                </div>
              </div>
              <Link href="/premium"
                className="shrink-0 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold text-sm rounded-xl transition-all whitespace-nowrap">
                Activar Premium →
              </Link>
            </div>
          </div>
        )}

        {/* League filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {leagues.map((league) => (
            <button
              key={league}
              onClick={() => setActiveLeague(league)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeLeague === league
                  ? "bg-brand-500 text-dark-900"
                  : "bg-dark-700 border border-white/8 text-slate-400 hover:text-white hover:border-white/20"
              }`}>
              <span>{leagueIcons[league]}</span>
              {league}
            </button>
          ))}
        </div>

        {/* Match grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} isPremiumUser={isPremiumUser} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <div className="text-5xl mb-4">⚽</div>
            <p className="text-lg font-display tracking-wide text-white mb-2">Sin partidos disponibles</p>
            <p className="text-sm">No hay partidos para esta liga hoy. Prueba otra categoría.</p>
          </div>
        )}

        {/* Email capture section */}
        <div className="mt-16 bg-dark-800 border border-white/8 rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl text-white tracking-wide mb-2">
            ¿QUIERES RECIBIRLOS CADA DÍA?
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Suscríbete gratis y recibe los análisis del día directamente en tu email, antes de que empiecen los partidos.
          </p>
          <div className="flex justify-center">
            <EmailCapture variant="banner" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-700 max-w-2xl mx-auto leading-relaxed">
            ⚠️ Análisis meramente informativo basado en estadísticas y datos históricos.
            No garantizamos resultados ni beneficios económicos.
            Las apuestas deportivas conllevan riesgo de pérdida económica. +18. Juega con responsabilidad.
          </p>
        </div>
      </div>
    </main>
  );
}
