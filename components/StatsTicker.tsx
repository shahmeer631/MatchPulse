"use client";
import { useEffect, useState } from "react";

const stats = [
  { label: "Partidos analizados hoy", value: "24" },
  { label: "Precisión media", value: "73%" },
  { label: "Usuarios activos", value: "1.2K" },
  { label: "Ligas cubiertas", value: "4" },
  { label: "Análisis generados", value: "8.400+" },
  { label: "Tasa de acierto", value: "71%" },
  { label: "Nuevos usuarios hoy", value: "47" },
  { label: "Partidos en directo", value: "6" },
];

/** Duplicate for seamless loop — same structure on server and client to avoid hydration DOM errors */
const tickerItems = [...stats, ...stats];

export default function StatsTicker() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="overflow-hidden border-b border-white/5 bg-dark-800/60 py-2.5">
      <div
        className={`flex whitespace-nowrap ${animate ? "animate-ticker" : ""}`}
        aria-live="polite"
      >
        {tickerItems.map((stat, i) => (
          <div key={`${stat.label}-${i}`} className="flex items-center gap-2 mx-10 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-xs text-slate-500">{stat.label}:</span>
            <span className="text-xs font-mono font-semibold text-brand-400">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
