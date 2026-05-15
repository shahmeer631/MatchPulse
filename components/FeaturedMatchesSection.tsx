"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import MatchCard from "@/components/MatchCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Match } from "@/data/matches";
import type { MappedMatch } from "@/lib/footballData";
import { mapApiRowToMatch, pickFeaturedApiMatches } from "@/lib/mapApiToMatch";
import {
  hasPremiumAccess,
  PREMIUM_ACCESS_CHANGED,
} from "@/lib/premiumAccess";

type ApiIssue = { source: string; status: number; message: string };

export default function FeaturedMatchesSection() {
  const [featuredMatches, setFeaturedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [noApiKey, setNoApiKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    const sync = () => setIsPremiumUser(hasPremiumAccess());
    sync();
    window.addEventListener(PREMIUM_ACCESS_CHANGED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PREMIUM_ACCESS_CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const loadMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/matches", { cache: "no-store" });
      const data = await res.json();

      if (data.source === "no_key") {
        setNoApiKey(true);
        setFeaturedMatches([]);
        setError(null);
        setWarnings([]);
        setIssues([]);
        return;
      }

      setNoApiKey(false);
      setWarnings(Array.isArray(data.warnings) ? data.warnings : []);
      setIssues(Array.isArray(data.issues) ? data.issues : []);

      if (!res.ok) {
        const detail = data.issues?.[0]
          ? ` (${data.issues[0].status}: ${data.issues[0].message})`
          : "";
        throw new Error((data.error || "Error cargando partidos") + detail);
      }

      const rows = (data.matches || []) as MappedMatch[];
      const picked = pickFeaturedApiMatches(rows, 3);
      setFeaturedMatches(
        picked.map((row, i) => mapApiRowToMatch(row, { isFirstFree: i === 0 }))
      );
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setFeaturedMatches([]);
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
    const id = setInterval(() => {
      if (!document.hidden) loadMatches();
    }, 60_000);
    return () => clearInterval(id);
  }, [loadMatches]);

  return (
    <section id="partidos" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-sm mb-3">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              {loading
                ? "Cargando partidos en vivo…"
                : lastUpdated
                  ? `Actualizado ${lastUpdated.toLocaleTimeString("es-ES")} · football-data.org`
                  : "Partidos desde API en vivo"}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
              PARTIDOS DESTACADOS
            </h2>
          </div>
          <Link
            href="/matches"
            className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {noApiKey && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-amber-400 mb-2">⚙️ API de fútbol no configurada</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Añade <code className="bg-dark-700 px-1 rounded text-brand-400">FOOTBALL_API_KEY</code> en{" "}
              <code className="bg-dark-700 px-1 rounded text-brand-400">.env.local</code> y reinicia el servidor.{" "}
              <a
                href="https://www.football-data.org/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 underline"
              >
                football-data.org
              </a>
            </p>
          </div>
        )}

        {error && !noApiKey && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-300">
            {error}
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadMatches();
              }}
              className="block mt-2 text-xs underline text-slate-400 hover:text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {warnings.length > 0 && !error && !loading && (
          <div className="mb-6 text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-1">
            {warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        )}

        {issues.length > 0 && !error && (
          <details className="mb-6 text-xs text-slate-500 bg-dark-700 border border-white/10 rounded-xl p-3">
            <summary className="cursor-pointer text-slate-400">Detalles API ({issues.length})</summary>
            <ul className="mt-2 space-y-1 font-mono">
              {issues.map((i) => (
                <li key={`${i.source}-${i.status}`}>
                  {i.source} — {i.status}: {i.message}
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="flex items-center gap-6 mb-6 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-brand-500/30 border border-brand-500/60" />
            Vista previa · análisis IA en Partidos
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-gold-500/30 border border-gold-500/60" />
            Análisis Premium
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : featuredMatches.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredMatches.map((match) => (
              <MatchCard key={match.id} match={match} isPremiumUser={isPremiumUser} />
            ))}
          </div>
        ) : (
          !noApiKey &&
          !error && (
            <div className="text-center py-16 bg-dark-700/50 border border-white/8 rounded-2xl">
              <p className="text-slate-400 text-sm mb-4">
                No hay partidos en la ventana actual de la API. Prueba la página completa de partidos.
              </p>
              <Link
                href="/matches"
                className="inline-flex px-6 py-3 bg-brand-500 hover:bg-brand-400 text-dark-900 font-bold text-sm rounded-xl"
              >
                Ir a Partidos →
              </Link>
            </div>
          )
        )}

        <div className="text-center mt-10 space-y-3">
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Marcadores y horarios desde football-data.org (actualización cada 60 s). Análisis IA completo en{" "}
            <Link href="/matches" className="text-brand-400 underline">
              /matches
            </Link>
            .
          </p>
          <Link
            href="/matches"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm rounded-xl transition-all"
          >
            Ver todos los partidos →
          </Link>
        </div>
      </div>
    </section>
  );
}
