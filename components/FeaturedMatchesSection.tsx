"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { matches } from "@/data/matches";
import MatchCard from "@/components/MatchCard";
import {
  hasPremiumAccess,
  PREMIUM_ACCESS_CHANGED,
} from "@/lib/premiumAccess";

export default function FeaturedMatchesSection() {
  const featuredMatches = matches.slice(0, 3);
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

  return (
    <section id="partidos" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-sm mb-3">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              Análisis disponibles hoy
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
              PARTIDOS DESTACADOS
            </h2>
          </div>
          <Link href="/matches" className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            Ver todos →
          </Link>
        </div>

        <div className="flex items-center gap-6 mb-6 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-brand-500/30 border border-brand-500/60" />
            Análisis gratuito
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-gold-500/30 border border-gold-500/60" />
            Análisis Premium
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredMatches.map((match) => (
            <MatchCard key={match.id} match={match} isPremiumUser={isPremiumUser} />
          ))}
        </div>

        <div className="text-center mt-10">
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
