"use client";
import Link from "next/link";
import { Insight } from "@/data/matches";

interface InsightCardProps {
  insight: Insight;
  canSeeInsight: boolean;
  matchId: string;
}

const confidenceColors = {
  Alta: "text-brand-400 bg-brand-500/10 border-brand-500/30",
  Media: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  Baja: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function InsightCard({ insight, canSeeInsight, matchId }: InsightCardProps) {
  return (
    <div className="border-t border-white/8 bg-dark-800 p-5 relative">
      {/* AI badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs bg-brand-500/10 border border-brand-500/20 text-brand-400 px-3 py-1 rounded-full">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L19 6L15.45 11.09L21 12L15.45 12.91L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 12.91L3 12L8.55 11.09L5 6L10.91 8.26L12 2Z"/>
          </svg>
          Análisis IA
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${confidenceColors[insight.confidence]}`}>
          Confianza: {insight.confidence}
        </span>
      </div>

      {/* Blurred content for premium */}
      {!canSeeInsight ? (
        <div className="relative">
          {/* Blurred preview */}
          <div className="premium-blur space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              {insight.analysis.slice(0, 120)}...
            </p>
            <div className="space-y-2">
              {insight.keyFactors.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-brand-400 mt-0.5">▸</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-800/70 rounded-lg backdrop-blur-sm">
            <div className="text-center space-y-3 px-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Contenido Premium</p>
                <p className="text-xs text-slate-400 mt-1">Accede al análisis completo con Premium</p>
              </div>
              <Link href="/premium"
                className="inline-block px-4 py-2 bg-gold-500 hover:bg-gold-400 text-dark-900 text-xs font-bold rounded-lg transition-colors">
                Desbloquear ahora
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Analysis text */}
          <p className="text-sm text-slate-300 leading-relaxed">{insight.analysis}</p>

          {/* Key factors */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Factores Clave</h4>
            <div className="space-y-1.5">
              {insight.keyFactors.map((factor, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-brand-400 mt-0.5 shrink-0">▸</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="flex items-center gap-3 bg-brand-500/5 border border-brand-500/20 rounded-xl p-3 mt-4">
            <div className="text-brand-400 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L19 6L15.45 11.09L21 12L15.45 12.91L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 12.91L3 12L8.55 11.09L5 6L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Recomendación IA</div>
              <div className="text-sm font-semibold text-brand-400">{insight.recommendation}</div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-slate-600 italic">
            ⚠️ Esto es análisis informativo, no garantía de resultados. Apuesta con responsabilidad.
          </p>
        </div>
      )}
    </div>
  );
}
