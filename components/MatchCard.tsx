"use client";
import { useState, useEffect } from "react";
import { Match } from "@/data/matches";
import InsightCard from "./InsightCard";
import { toLocalTime, toLocalDate } from "@/lib/dateUtils";

interface MatchCardProps {
  match: Match;
  isPremiumUser: boolean;
}

const leagueBadgeColors: Record<string, string> = {
  "La Liga":          "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Premier League":   "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Serie A":          "bg-blue-500/20  text-blue-300  border-blue-500/30",
  "Champions League": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Programado", color: "text-slate-400" },
  live:       { label: "EN DIRECTO", color: "text-red-400" },
  finished:   { label: "Finalizado",  color: "text-slate-500" },
};

export default function MatchCard({ match, isPremiumUser }: MatchCardProps) {
  const [expanded, setExpanded]   = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const canSeeInsight = isPremiumUser || !match.insight.isPremium;
  const statusInfo    = statusLabels[match.status] || statusLabels.scheduled;

  // Timezone-aware display — only computed client-side after mount
  const localTime = mounted ? toLocalTime(match.dateISO) : "--:--";
  const localDate = mounted ? toLocalDate(match.dateISO) : "—";

  return (
    <div className="match-card bg-dark-700 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
      {/* League + status row */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${leagueBadgeColors[match.league]}`}>
          {match.leagueFlag} {match.league}
        </span>
        <div className="text-right">
          {match.status === "live" ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"/>
              {match.minute ? `${match.minute}'` : "EN VIVO"}
            </span>
          ) : (
            <span className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
          )}
        </div>
      </div>

      {/* Teams + score */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-full bg-dark-600 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-display font-bold leading-none">
                {match.homeTeam.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-medium text-center text-white leading-tight w-full truncate px-1">
              {match.homeTeam}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            {match.homeScore !== undefined && match.homeScore !== null ? (
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl text-white">{match.homeScore}</span>
                <span className="font-display text-lg text-slate-600">-</span>
                <span className="font-display text-2xl text-white">{match.awayScore}</span>
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-500 bg-dark-600 px-3 py-1 rounded-lg border border-white/5">
                VS
              </div>
            )}
            {/* Time / timezone */}
            <div className="text-center mt-1">
              <div className="text-xs font-mono text-slate-300 font-medium">{localTime}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">{localDate}</div>
            </div>
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-full bg-dark-600 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-display font-bold leading-none">
                {match.awayTeam.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-medium text-center text-white leading-tight w-full truncate px-1">
              {match.awayTeam}
            </span>
          </div>
        </div>

        {/* Premium lock badge */}
        {match.insight.isPremium && !isPremiumUser && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gold-400/70 mt-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Análisis Premium
          </div>
        )}

        {/* Probability bars */}
        <div className="mt-4 space-y-1.5">
          {[
            { label: "Local",    pct: match.insight.homeWin, color: "bg-brand-500" },
            { label: "Empate",   pct: match.insight.draw,    color: "bg-slate-400" },
            { label: "Visitante",pct: match.insight.awayWin, color: "bg-orange-400" },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-16 shrink-0 text-right">{bar.label}</span>
              <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                  style={{ width: mounted && canSeeInsight ? `${bar.pct}%` : "0%" }}
                />
              </div>
              <span className="w-8 text-right font-mono shrink-0">
                {canSeeInsight ? `${bar.pct}%` : "—"}
              </span>
            </div>
          ))}
        </div>

        {/* Toggle insight */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all"
        >
          {expanded ? "Ocultar análisis" : "Ver análisis IA"}
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* Insight panel */}
      {expanded && (
        <InsightCard insight={match.insight} canSeeInsight={canSeeInsight} matchId={match.id} />
      )}
    </div>
  );
}
