"use client";
import { useState } from "react";

interface EmailCaptureProps {
  variant?: "hero" | "inline" | "banner";
}

export default function EmailCapture({ variant = "hero" }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Introduce un email válido");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-3 ${variant === "hero" ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-400">¡Registrado con éxito!</p>
          <p className="text-xs text-slate-500">Te avisaremos con las mejores predicciones del día.</p>
        </div>
      </div>
    );
  }

  const inputClass = "flex-1 min-w-0 bg-dark-700 border border-white/10 focus:border-brand-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-all";
  const btnClass = "shrink-0 px-6 py-3.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-dark-900 font-bold text-sm rounded-xl transition-all whitespace-nowrap";

  return (
    <form onSubmit={handleSubmit} className={`w-full ${variant === "hero" ? "max-w-md mx-auto" : "max-w-lg"}`} suppressHydrationWarning>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="tu@email.com"
          className={inputClass}
          suppressHydrationWarning
        />
        <button type="submit" disabled={loading} className={btnClass}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </span>
          ) : variant === "banner" ? "Recibir análisis gratis" : "Acceso gratuito →"}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      <p className="text-xs text-slate-600 mt-2 text-center sm:text-left">
        Sin spam · Análisis diarios · Cancela cuando quieras
      </p>
    </form>
  );
}
