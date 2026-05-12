"use client";
import { useState, useEffect, useCallback } from "react";
import { matches as staticMatches, Match, League } from "@/data/matches";
import MatchCard from "@/components/MatchCard";
import EmailCapture from "@/components/EmailCapture";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { hasPremiumAccess } from "@/lib/premiumAccess";

const leagues: (League | "Todas")[] = ["Todas", "La Liga", "Premier League", "Serie A", "Champions League"];
const leagueIcons: Record<string, string> = {
  "Todas": "⚽", "La Liga": "🇪🇸", "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Serie A": "🇮🇹", "Champions League": "🏆",
};

const REFRESH_INTERVAL = 60; // seconds

export default function MatchesPage() {
  const [activeLeague, setActiveLeague] = useState<League | "Todas">("Todas");
  const [matches, setMatches]           = useState<Match[]>(staticMatches);
  const [loading, setLoading]           = useState(true);
  const [lastRefresh, setLastRefresh]   = useState<Date | null>(null);
  const [countdown, setCountdown]       = useState(REFRESH_INTERVAL);
  const [refreshing, setRefreshing]     = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // Merge live scores from API into static match data
  const fetchScores = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/scores", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      if (data.matches?.length) {
        setMatches(prev =>
          prev.map(m => {
            const live = data.matches.find((l: { id: string; homeScore: number | null; awayScore: number | null; status: string; minute?: number }) => l.id === m.id);
            if (!live) return m;
            return {
              ...m,
              homeScore: live.homeScore ?? m.homeScore,
              awayScore: live.awayScore ?? m.awayScore,
              status: live.status || m.status,
              minute: live.minute ?? m.minute,
            };
          })
        );
      }
      setLastRefresh(new Date());
      setCountdown(REFRESH_INTERVAL);
    } catch (_) {
      // silently fail — keep showing static data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsPremiumUser(hasPremiumAccess());
    fetchScores();
  }, [fetchScores]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) fetchScores();
    }, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchScores]);

  // Countdown display
  useEffect(() => {
    if (!lastRefresh) return;
    const tick = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastRefresh]);

  const filtered = activeLeague === "Todas"
    ? matches
    : matches.filter(m => m.league === activeLeague);

  const liveCount     = filtered.filter(m => m.status === "live").length;
  const premiumCount  = filtered.filter(m => m.insight.isPremium).length;
  const freeCount     = filtered.length - premiumCount;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24">
        <LoadingSpinner size="lg" text="Cargando partidos..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Page header */}
      <div className="bg-dark-800 border-b border-white/5 pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-brand-400 text-sm mb-3">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"/>
            {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {liveCount > 0 && (
              <span className="ml-3 flex items-center gap-1 text-red-400 text-xs font-bold">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"/>
                {liveCount} EN DIRECTO
              </span>
            )}
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide mb-3">
            PARTIDOS DE HOY
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mb-5">
            Análisis estadístico con IA. Los análisis Premium están bloqueados para usuarios gratuitos.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-xl px-3 py-2">
              <span className="w-2 h-2 bg-brand-500 rounded-full"/>
              <span className="text-slate-400">{freeCount} gratuitos</span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-xl px-3 py-2">
              <span className="w-2 h-2 bg-gold-500 rounded-full"/>
              <span className="text-slate-400">{premiumCount} premium</span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-xl px-3 py-2">
              <span className="text-slate-400">⚽ {filtered.length} partidos</span>
            </div>
            {/* Auto-refresh indicator */}
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-xl px-3 py-2">
              <button
                onClick={() => fetchScores(true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 text-slate-400 hover:text-brand-400 transition-colors disabled:opacity-50"
              >
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={refreshing ? "animate-spin" : ""}
                >
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                {refreshing ? "Actualizando..." : `Auto-refresh ${countdown}s`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Premium upgrade banner */}
        {!isPremiumUser && premiumCount > 0 && (
          <div className="mb-8 relative overflow-hidden bg-dark-700 border border-gold-500/30 rounded-2xl p-5"
            style={{ boxShadow: "0 0 30px rgba(245,158,11,0.08)" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"/>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">👑</span>
                <div>
                  <h3 className="text-sm font-bold text-gold-400 mb-1">
                    {premiumCount} análisis bloqueados
                  </h3>
                  <p className="text-xs text-slate-400">
                    Activa Premium y accede al análisis completo: probabilidades detalladas, factores clave y recomendaciones accionables.
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

        {/* League filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {leagues.map((league) => (
            <button key={league} onClick={() => setActiveLeague(league)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeLeague === league
                  ? "bg-brand-500 text-dark-900"
                  : "bg-dark-700 border border-white/8 text-slate-400 hover:text-white hover:border-white/20"
              }`}>
              <span>{leagueIcons[league]}</span>
              <span className="hidden sm:inline">{league}</span>
              <span className="sm:hidden">{league === "Todas" ? "Todas" : leagueIcons[league]}</span>
            </button>
          ))}
        </div>

        {/* Match grid — responsive, no overflow */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((match) => (
              <MatchCard key={match.id} match={match} isPremiumUser={isPremiumUser} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚽</div>
            <p className="font-display text-xl text-white tracking-wide mb-2">Sin partidos disponibles</p>
            <p className="text-sm text-slate-500">No hay partidos para esta liga hoy.</p>
          </div>
        )}

        {/* Last refresh info */}
        {lastRefresh && (
          <p className="text-center text-xs text-slate-700 mt-6">
            Última actualización: {lastRefresh.toLocaleTimeString("es-ES")} · Se actualiza automáticamente cada {REFRESH_INTERVAL}s
          </p>
        )}

        {/* Email capture */}
        <div className="mt-16 bg-dark-800 border border-white/8 rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl text-white tracking-wide mb-2">¿QUIERES RECIBIRLOS CADA DÍA?</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Recibe los análisis del día en tu email, antes de que empiecen los partidos. Gratis.
          </p>
          <div className="flex justify-center">
            <EmailCapture variant="banner" />
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-700 mt-8 max-w-2xl mx-auto leading-relaxed">
          ⚠️ Análisis informativo basado en estadísticas. Sin garantía de resultados. +18. Juega con responsabilidad.
          <Link href="/terminos" className="underline ml-1 hover:text-slate-500 transition-colors">Términos</Link> ·
          <Link href="/privacidad" className="underline ml-1 hover:text-slate-500 transition-colors">Privacidad</Link>
        </p>
      </div>
    </main>
  );
}
