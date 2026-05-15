"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmailCapture from "@/components/EmailCapture";
import { toLocalTime, toLocalDate } from "@/lib/dateUtils";
import { hasPremiumAccess, PREMIUM_ACCESS_CHANGED } from "@/lib/premiumAccess";

// ── Types returned by our /api/matches route ─────────────────────
interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamFull?: string;
  awayTeamFull?: string;
  homeCrest?: string;
  awayCrest?: string;
  dateISO: string;
  status: "scheduled" | "live" | "finished";
  minute?: number | null;
  homeScore: number | null;
  awayScore: number | null;
  league: string;
  leagueFlag: string;
  venue?: string;
  matchday?: number | null;
  stage?: string;
  // AI analysis — loaded lazily per match
  ai?: AIAnalysis;
  aiLoading?: boolean;
  aiError?: string;
}

interface AIAnalysis {
  homeWin: number;
  draw: number;
  awayWin: number;
  analysis: string;
  tacticalBreakdown: string;
  contextAnalysis: string;
  keyFactors: string[];
  recommendation: string;
  confidence: "Alta" | "Media" | "Baja";
  riskLevel: "Bajo" | "Medio" | "Alto";
  predictedScore: string;
  predictedGoals: number;
  primaryBet: string;
  primaryRationale: string;
  secondaryBet: string;
  secondaryRationale: string;
  avoidBet: string;
  avoidRationale: string;
  valueRating: number;
  homeFormation: string;
  awayFormation: string;
  keyBattle: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  over25Odds: number;
  bttsOdds: number;
  asianHandicap: string;
  valuebet?: string;
}

const LEAGUES     = ["Todas", "La Liga", "Premier League", "Serie A", "Champions League"] as const;
const LEAGUE_ICONS: Record<string, string> = {
  "Todas": "⚽", "La Liga": "🇪🇸", "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Serie A": "🇮🇹", "Champions League": "🏆",
};
const BADGE_COLORS: Record<string, string> = {
  "La Liga":          "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Premier League":   "bg-violet-500/20  text-violet-300  border-violet-500/30",
  "Serie A":          "bg-blue-500/20   text-blue-300   border-blue-500/30",
  "Champions League": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};
const CONFIDENCE_COLORS = {
  Alta:  "text-brand-400  bg-brand-500/10  border-brand-500/30",
  Media: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  Baja:  "text-red-400    bg-red-500/10    border-red-500/30",
};
const REFRESH_INTERVAL = 60; // seconds

// ── MatchCard ─────────────────────────────────────────────────────
function MatchCard({
  match, isPremium, onLoadAI,
}: {
  match: LiveMatch;
  isPremium: boolean;
  onLoadAI: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [mounted,  setMounted]  = useState(false);
  useEffect(() => setMounted(true), []);

  const localTime = mounted ? toLocalTime(match.dateISO) : "--:--";
  const localDate = mounted ? toLocalDate(match.dateISO) : "—";

  const handleExpand = () => {
    setExpanded(v => !v);
    if (!expanded && !match.ai && !match.aiLoading) {
      onLoadAI(match.id);
    }
  };

  return (
    <div className="match-card bg-dark-700 border border-white/8 rounded-2xl overflow-hidden">
      <div className="p-5">
        {/* League + status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${BADGE_COLORS[match.league] || "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}>
            {match.leagueFlag} {match.league}
            {match.matchday ? ` · J${match.matchday}` : ""}
          </span>
          <div className="text-right">
            {match.status === "live" ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"/>
                {match.minute ? `${match.minute}'` : "EN VIVO"}
              </span>
            ) : match.status === "finished" ? (
              <span className="text-xs text-slate-500">Finalizado</span>
            ) : (
              <div className="text-right">
                <div className="text-xs font-mono text-slate-300">{localTime}</div>
                <div className="text-[10px] text-slate-600">{localDate}</div>
              </div>
            )}
          </div>
        </div>

        {/* Teams + score */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            {match.homeCrest ? (
              <img src={match.homeCrest} alt={match.homeTeam} className="w-10 h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-dark-600 border border-white/10 flex items-center justify-center">
                <span className="text-xs font-display font-bold">{match.homeTeam.slice(0,2).toUpperCase()}</span>
              </div>
            )}
            <span className="text-xs font-semibold text-white text-center leading-tight w-full truncate px-1">{match.homeTeam}</span>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0">
            {(match.homeScore !== null && match.awayScore !== null) ? (
              <div className="flex items-center gap-2">
                <span className={`font-display text-2xl ${match.status === "live" ? "text-red-300" : "text-white"}`}>{match.homeScore}</span>
                <span className="text-slate-600">-</span>
                <span className={`font-display text-2xl ${match.status === "live" ? "text-red-300" : "text-white"}`}>{match.awayScore}</span>
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-500 bg-dark-600 px-3 py-1 rounded-lg border border-white/5">VS</div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            {match.awayCrest ? (
              <img src={match.awayCrest} alt={match.awayTeam} className="w-10 h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-dark-600 border border-white/10 flex items-center justify-center">
                <span className="text-xs font-display font-bold">{match.awayTeam.slice(0,2).toUpperCase()}</span>
              </div>
            )}
            <span className="text-xs font-semibold text-white text-center leading-tight w-full truncate px-1">{match.awayTeam}</span>
          </div>
        </div>

        {/* Quick probability bars — only if AI loaded */}
        {match.ai && (
          <div className="mt-4 space-y-1.5">
            {[
              { label: "Local",     pct: match.ai.homeWin, color: "bg-brand-500" },
              { label: "Empate",    pct: match.ai.draw,    color: "bg-slate-400" },
              { label: "Visitante", pct: match.ai.awayWin, color: "bg-orange-400" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-16 shrink-0">{b.label}</span>
                <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full transition-all duration-1000`} style={{ width: `${b.pct}%` }}/>
                </div>
                <span className="w-8 text-right font-mono">{b.pct}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Expand button */}
        <button onClick={handleExpand}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">
          {match.aiLoading ? (
            <><LoadingSpinner size="sm" /> Generando análisis IA...</>
          ) : expanded ? "Ocultar análisis" : "Ver análisis IA"}
          {!match.aiLoading && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          )}
        </button>
      </div>

      {/* Expanded AI Analysis Panel */}
      {expanded && (
        <div className="border-t border-white/8 bg-dark-800 p-5">
          {match.aiLoading && (
            <div className="flex flex-col items-center py-8 gap-3">
              <LoadingSpinner size="md" />
              <p className="text-xs text-slate-500 animate-pulse">La IA está analizando el partido...</p>
            </div>
          )}

          {match.aiError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-xs text-red-400">Error generando análisis: {match.aiError}</p>
              <button onClick={() => onLoadAI(match.id)}
                className="mt-2 text-xs text-slate-400 hover:text-white underline">
                Reintentar
              </button>
            </div>
          )}

          {match.ai && !match.aiLoading && (() => {
            const ai = match.ai!;
            // Free users see only the first match's analysis; premium see all
            const isLocked = !isPremium && match.id !== "first-free";

            return isLocked ? (
              <div className="relative">
                {/* Blurred preview */}
                <div className="premium-blur space-y-3 pointer-events-none select-none">
                  <p className="text-sm text-slate-300">{ai.analysis.slice(0, 150)}...</p>
                  {ai.keyFactors.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-400">
                      <span className="text-brand-400">▸</span>{f}
                    </div>
                  ))}
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-800/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center space-y-3 px-4">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-white">Análisis Premium</p>
                    <p className="text-xs text-slate-400">Accede al análisis completo con Premium</p>
                    <Link href="/premium"
                      className="inline-block px-5 py-2 bg-gold-500 hover:bg-gold-400 text-dark-900 text-xs font-bold rounded-xl transition-colors">
                      Desbloquear — 9,99€/mes
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Header badges */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-xs bg-brand-500/10 border border-brand-500/20 text-brand-400 px-3 py-1 rounded-full">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 8.26L19 6L15.45 11.09L21 12L15.45 12.91L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 12.91L3 12L8.55 11.09L5 6L10.91 8.26L12 2Z"/>
                    </svg>
                    Análisis IA en tiempo real
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CONFIDENCE_COLORS[ai.confidence]}`}>
                    Confianza: {ai.confidence}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    ai.riskLevel === "Bajo" ? "text-brand-400 bg-brand-500/10 border-brand-500/30" :
                    ai.riskLevel === "Medio" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" :
                    "text-red-400 bg-red-500/10 border-red-500/30"
                  }`}>Riesgo: {ai.riskLevel}</span>
                </div>

                {/* Probabilities big display */}
                <div className="grid grid-cols-3 gap-3 bg-dark-700 rounded-xl p-4">
                  <div className="text-center">
                    <div className="font-display text-2xl text-brand-400">{ai.homeWin}%</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Local</div>
                  </div>
                  <div className="text-center border-x border-white/8">
                    <div className="font-display text-2xl text-slate-400">{ai.draw}%</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Empate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl text-orange-400">{ai.awayWin}%</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Visitante</div>
                  </div>
                </div>

                {/* Score prediction */}
                <div className="flex items-center gap-3 bg-dark-700 rounded-xl p-3">
                  <span className="text-lg">🎯</span>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Resultado predicho</div>
                    <div className="text-sm font-bold text-white">{ai.predictedScore} · {ai.predictedGoals} goles esperados</div>
                  </div>
                </div>

                {/* Main analysis */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Análisis del Partido</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{ai.analysis}</p>
                </div>

                {/* Tactical */}
                {ai.tacticalBreakdown && (
                  <div className="bg-dark-700 rounded-xl p-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Análisis Táctico · {ai.homeFormation} vs {ai.awayFormation}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{ai.tacticalBreakdown}</p>
                    {ai.keyBattle && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-brand-400 shrink-0">⚔️</span>
                        <span className="text-slate-400">{ai.keyBattle}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Key factors */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Factores Clave</h4>
                  <div className="space-y-1.5">
                    {ai.keyFactors.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-brand-400 shrink-0 mt-0.5">▸</span>{f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Context */}
                {ai.contextAnalysis && (
                  <div className="bg-dark-700 rounded-xl p-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Contexto del Partido</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{ai.contextAnalysis}</p>
                  </div>
                )}

                {/* Betting angles */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ángulos de Apuesta</h4>
                  <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500 mb-1">Principal</div>
                    <div className="text-sm font-bold text-brand-400">{ai.primaryBet}</div>
                    <div className="text-xs text-slate-500 mt-1">{ai.primaryRationale}</div>
                  </div>
                  {ai.secondaryBet && (
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                      <div className="text-[10px] text-slate-500 mb-1">Alternativa</div>
                      <div className="text-sm font-bold text-yellow-400">{ai.secondaryBet}</div>
                      <div className="text-xs text-slate-500 mt-1">{ai.secondaryRationale}</div>
                    </div>
                  )}
                  {ai.avoidBet && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                      <div className="text-[10px] text-slate-500 mb-1">⚠️ Evitar</div>
                      <div className="text-sm font-bold text-red-400">{ai.avoidBet}</div>
                      <div className="text-xs text-slate-500 mt-1">{ai.avoidRationale}</div>
                    </div>
                  )}
                </div>

                {/* Odds */}
                {ai.homeOdds && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Cuotas Estimadas</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: "Local (1)",  val: ai.homeOdds },
                        { label: "Empate (X)", val: ai.drawOdds },
                        { label: "Visit. (2)", val: ai.awayOdds },
                        { label: "+2.5 goles", val: ai.over25Odds },
                      ].map(o => (
                        <div key={o.label} className="bg-dark-700 border border-white/8 rounded-xl p-3 text-center">
                          <div className="text-[10px] text-slate-500">{o.label}</div>
                          <div className="font-mono text-sm font-bold text-white mt-0.5">{o.val?.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    {ai.valuebet && (
                      <div className="mt-2 bg-gold-500/10 border border-gold-500/20 rounded-xl p-3 flex items-center gap-2">
                        <span className="text-gold-400 shrink-0">💎</span>
                        <p className="text-xs text-slate-300">{ai.valuebet}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendation */}
                <div className="flex items-center gap-3 bg-brand-500/5 border border-brand-500/20 rounded-xl p-4">
                  <div className="text-brand-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 8.26L19 6L15.45 11.09L21 12L15.45 12.91L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 12.91L3 12L8.55 11.09L5 6L10.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Recomendación IA</div>
                    <div className="text-sm font-bold text-brand-400">{ai.recommendation}</div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-700 italic">
                  ⚠️ Análisis informativo generado por IA. Sin garantía de resultados. Apuesta con responsabilidad. +18.
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function MatchesPage() {
  const [matches,      setMatches]      = useState<LiveMatch[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [activeLeague, setActiveLeague] = useState<string>("Todas");
  const [countdown,    setCountdown]    = useState(REFRESH_INTERVAL);
  const [lastUpdated,  setLastUpdated]  = useState<Date | null>(null);
  const [refreshing,   setRefreshing]   = useState(false);
  const [noApiKey,     setNoApiKey]     = useState(false);
  const [apiWarnings,  setApiWarnings]  = useState<string[]>([]);
  const [apiIssues,    setApiIssues]    = useState<{ source: string; status: number; message: string }[]>([]);
  const [dateWindow,   setDateWindow]   = useState<{ from: string; to: string } | null>(null);
  const [isPremium,    setIsPremium]    = useState(false);

  useEffect(() => {
    const sync = () => setIsPremium(hasPremiumAccess());
    sync();
    window.addEventListener(PREMIUM_ACCESS_CHANGED, sync);
    return () => window.removeEventListener(PREMIUM_ACCESS_CHANGED, sync);
  }, []);

  const firstFreeMatchSet = useRef(false);

  const fetchMatches = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res  = await fetch("/api/matches", { cache: "no-store" });
      const data = await res.json();

      if (data.source === "no_key") {
        setNoApiKey(true);
        setApiWarnings([]);
        setApiIssues([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setNoApiKey(false);
      setApiWarnings(Array.isArray(data.warnings) ? data.warnings : []);
      setApiIssues(Array.isArray(data.issues) ? data.issues : []);
      if (data.dateFrom && data.dateTo) {
        setDateWindow({ from: data.dateFrom, to: data.dateTo });
      }

      if (!res.ok) {
        const detail = Array.isArray(data.issues) && data.issues[0]
          ? ` (${data.issues[0].status}: ${data.issues[0].message})`
          : "";
        throw new Error((data.error || "API error") + detail);
      }

      // Mark the first non-premium match as free
      const raw: LiveMatch[] = (data.matches || []).map((m: LiveMatch, i: number) => ({
        ...m,
        id: i === 0 && !firstFreeMatchSet.current ? "first-free" : m.id,
      }));
      if (raw.length > 0) firstFreeMatchSet.current = true;

      setMatches(prev => {
        // Preserve any already-loaded AI analysis when refreshing
        return raw.map(m => {
          const existing = prev.find(p => p.id === m.id);
          return existing?.ai ? { ...m, ai: existing.ai } : m;
        });
      });
      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  // Auto-refresh every 60s — pauses when tab hidden
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) fetchMatches();
    }, REFRESH_INTERVAL * 1000);
    return () => clearInterval(id);
  }, [fetchMatches]);

  // Countdown ticker
  useEffect(() => {
    if (!lastUpdated) return;
    const id = setInterval(() => setCountdown(p => p <= 1 ? REFRESH_INTERVAL : p - 1), 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  // Load AI analysis for a specific match
  const handleLoadAI = useCallback(async (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || match.ai || match.aiLoading) return;

    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, aiLoading: true, aiError: undefined } : m));

    try {
      const res  = await fetch("/api/ai-analysis", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ match }),
      });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || "AI error");

      setMatches(prev => prev.map(m => m.id === matchId
        ? { ...m, ai: data.analysis, aiLoading: false }
        : m
      ));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      setMatches(prev => prev.map(m => m.id === matchId
        ? { ...m, aiLoading: false, aiError: msg }
        : m
      ));
    }
  }, [matches]);

  const filtered = activeLeague === "Todas"
    ? matches
    : matches.filter(m => m.league === activeLeague);

  const liveCount     = matches.filter(m => m.status === "live").length;
  const scheduledCount= matches.filter(m => m.status === "scheduled").length;

  // ── Loading state ────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-slate-500 text-sm mt-4 animate-pulse">Cargando partidos en tiempo real...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/5 pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-brand-400 text-sm mb-3 flex-wrap">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"/>
            {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            {liveCount > 0 && (
              <span className="flex items-center gap-1 text-red-400 text-xs font-bold ml-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"/>
                {liveCount} EN DIRECTO
              </span>
            )}
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide mb-3">PARTIDOS</h1>
          <p className="text-slate-400 text-sm max-w-xl mb-4">
            Datos en tiempo real · Análisis IA generado al instante para cada partido.
          </p>

          {/* Stats chips */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-xl px-3 py-2">
              <span className="text-slate-400">⚽ {matches.length} partidos</span>
            </div>
            {liveCount > 0 && (
              <div className="flex items-center gap-2 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-red-400">
                🔴 {liveCount} en directo
              </div>
            )}
            <div className="flex items-center gap-2 text-xs bg-dark-700 border border-white/8 rounded-xl px-3 py-2">
              <span className="text-slate-400">📅 {scheduledCount} programados</span>
            </div>
            <button onClick={() => fetchMatches(true)} disabled={refreshing}
              className="flex items-center gap-1.5 text-xs bg-dark-700 border border-white/8 rounded-xl px-3 py-2 text-slate-400 hover:text-brand-400 transition-colors disabled:opacity-50">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={refreshing ? "animate-spin" : ""}>
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              {refreshing ? "Actualizando..." : `Refresh ${countdown}s`}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">

        {/* No API key warning */}
        {noApiKey && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-amber-400 mb-2">⚙️ Configuración requerida</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Para mostrar partidos en tiempo real necesitas configurar la API de fútbol.
              Regístrate gratis en <a href="https://www.football-data.org/register" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline">football-data.org</a>,
              obtén tu clave gratuita y añádela a <code className="bg-dark-700 px-1 py-0.5 rounded text-brand-400">FOOTBALL_API_KEY</code> en <code className="bg-dark-700 px-1 py-0.5 rounded text-brand-400">.env.local</code>.
            </p>
            <div className="bg-dark-700 rounded-xl p-3 font-mono text-xs text-brand-400">
              FOOTBALL_API_KEY=tu_clave_aqui
            </div>
          </div>
        )}

        {apiWarnings.length > 0 && !error && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
            {apiWarnings.map((w) => (
              <p key={w} className="text-xs text-amber-200/90 leading-relaxed">{w}</p>
            ))}
            {dateWindow && (
              <p className="text-[11px] text-slate-500 mt-2 font-mono">
                Ventana: {dateWindow.from} → {dateWindow.to}
              </p>
            )}
          </div>
        )}

        {apiIssues.length > 0 && !error && (
          <details className="mb-8 bg-dark-700 border border-white/10 rounded-2xl p-4 text-xs text-slate-400">
            <summary className="cursor-pointer text-slate-300 font-medium">
              Detalles técnicos de football-data.org ({apiIssues.length})
            </summary>
            <ul className="mt-3 space-y-2 font-mono">
              {apiIssues.map((i) => (
                <li key={`${i.source}-${i.status}`}>
                  {i.source} — {i.status || "network"}: {i.message}
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Generic error */}
        {error && !noApiKey && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-red-400 text-xl shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Error cargando partidos</p>
              <p className="text-xs text-slate-500 mt-0.5">{error}</p>
            </div>
            <button onClick={() => fetchMatches(true)} className="ml-auto text-xs text-slate-400 hover:text-white underline shrink-0">
              Reintentar
            </button>
          </div>
        )}

        {/* Premium banner */}
        {!isPremium && matches.length > 0 && (
          <div className="mb-8 relative overflow-hidden bg-dark-700 border border-gold-500/30 rounded-2xl p-5"
            style={{ boxShadow: "0 0 30px rgba(245,158,11,0.08)" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"/>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">👑</span>
                <div>
                  <h3 className="text-sm font-bold text-gold-400 mb-1">Análisis Premium bloqueado</h3>
                  <p className="text-xs text-slate-400">
                    El primer partido es gratis. Activa Premium para acceder al análisis IA completo de todos los partidos.
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
          {LEAGUES.map(league => (
            <button key={league} onClick={() => setActiveLeague(league)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeLeague === league
                  ? "bg-brand-500 text-dark-900"
                  : "bg-dark-700 border border-white/8 text-slate-400 hover:text-white hover:border-white/20"
              }`}>
              <span>{LEAGUE_ICONS[league]}</span>
              <span className="hidden sm:inline">{league}</span>
            </button>
          ))}
        </div>

        {/* Matches grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                isPremium={isPremium}
                onLoadAI={handleLoadAI}
              />
            ))}
          </div>
        ) : !loading && !noApiKey && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚽</div>
            <p className="font-display text-xl text-white tracking-wide mb-2">Sin partidos disponibles</p>
            <p className="text-sm text-slate-500">No hay partidos programados en los próximos días para {activeLeague !== "Todas" ? activeLeague : "estas ligas"}.</p>
          </div>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <p className="text-center text-xs text-slate-700 mt-6">
            Actualizado: {lastUpdated.toLocaleTimeString("es-ES")} · Auto-refresh cada {REFRESH_INTERVAL}s
          </p>
        )}

        {/* Email capture */}
        <div className="mt-16 bg-dark-800 border border-white/8 rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl text-white tracking-wide mb-2">ANÁLISIS DIARIOS EN TU EMAIL</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Recibe los análisis IA antes de cada jornada. Gratis.</p>
          <div className="flex justify-center"><EmailCapture variant="banner" /></div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-8 max-w-2xl mx-auto leading-relaxed">
          ⚠️ Análisis informativo. Sin garantía de resultados. +18. Apuesta con responsabilidad.{" "}
          <Link href="/terminos" className="underline hover:text-slate-500">Términos</Link> ·{" "}
          <Link href="/privacidad" className="underline hover:text-slate-500">Privacidad</Link>
        </p>
      </div>
    </main>
  );
}
