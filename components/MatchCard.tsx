"use client";
import { useState } from "react";
import { Match } from "@/data/matches";
import InsightCard from "./InsightCard";

interface MatchCardProps {
  match: Match;
  isPremiumUser: boolean;
}

const leagueBadgeColors: Record<string, string> = {
  "La Liga": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Premier League": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Serie A": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Champions League": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export default function MatchCard({ match, isPremiumUser }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const canSeeInsight = isPremiumUser || !match.insight.isPremium;

  return (
    <div className="match-card bg-dark-700 border border-white/8 rounded-2xl overflow-hidden">
      {/* Match Header */}
      <div className="p-5">
        {/* League badge + time */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${leagueBadgeColors[match.league]}`}>
            {match.leagueFlag} {match.league}
          </span>
          <div className="text-right">
            <div className="text-xs text-slate-500">{match.date}</div>
            <div className="text-sm font-mono text-slate-300 font-medium">{match.time}</div>
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-dark-600 border border-white/10 overflow-hidden flex items-center justify-center">
              <span className="text-xl font-display">{match.homeTeam.slice(0, 2).toUpperCase()}</span>
            </div>
            <span className="text-sm font-medium text-center text-white leading-tight">{match.homeTeam}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-xs font-mono text-slate-500 bg-dark-600 px-3 py-1 rounded-lg border border-white/5">VS</div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-dark-600 border border-white/10 overflow-hidden flex items-center justify-center">
              <span className="text-xl font-display">{match.awayTeam.slice(0, 2).toUpperCase()}</span>
            </div>
            <span className="text-sm font-medium text-center text-white leading-tight">{match.awayTeam}</span>
          </div>
        </div>

        {/* Quick probability bars */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-16 shrink-0">Local</span>
            <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full stat-bar" style={{ width: canSeeInsight ? `${match.insight.homeWin}%` : '0%' }}/>
            </div>
            <span className="w-8 text-right font-mono">{canSeeInsight ? `${match.insight.homeWin}%` : '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-16 shrink-0">Empate</span>
            <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 rounded-full stat-bar" style={{ width: canSeeInsight ? `${match.insight.draw}%` : '0%' }}/>
            </div>
            <span className="w-8 text-right font-mono">{canSeeInsight ? `${match.insight.draw}%` : '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-16 shrink-0">Visitante</span>
            <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full stat-bar" style={{ width: canSeeInsight ? `${match.insight.awayWin}%` : '0%' }}/>
            </div>
            <span className="w-8 text-right font-mono">{canSeeInsight ? `${match.insight.awayWin}%` : '—'}</span>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/8 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">
          {expanded ? 'Ocultar análisis' : 'Ver análisis IA'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* Expanded insight */}
      {expanded && (
        <InsightCard insight={match.insight} canSeeInsight={canSeeInsight} matchId={match.id} />
      )}
    </div>
  );
}
