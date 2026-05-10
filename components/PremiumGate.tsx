"use client";
import { useState } from "react";
import Link from "next/link";

interface PremiumGateProps {
  onUnlock: () => void;
}

const PREMIUM_PASSWORD = "matchpulse123";

export default function PremiumGate({ onUnlock }: PremiumGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    if (password === PREMIUM_PASSWORD) {
      onUnlock();
    } else {
      setError("Contraseña incorrecta. Verifica tu acceso premium.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-dark-700 border border-gold-500/30 rounded-2xl p-8">
        <div className="text-center mb-6">
          <span className="text-4xl">👑</span>
          <h2 className="font-display text-2xl text-white tracking-wide mt-3">ACCESO PREMIUM</h2>
          <p className="text-slate-400 text-sm mt-2">Introduce tu contraseña para desbloquear</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña premium"
            className="w-full bg-dark-800 border border-white/10 focus:border-gold-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-all font-mono"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-dark-900 font-bold text-sm rounded-xl transition-all">
            {loading ? "Verificando..." : "Acceder →"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/premium" className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline">
            Ir a la página de acceso completa
          </Link>
        </div>
      </div>
    </div>
  );
}
