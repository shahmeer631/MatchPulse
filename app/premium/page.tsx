"use client";
import { useState, useEffect } from "react";
import { matches } from "@/data/matches";
import MatchCard from "@/components/MatchCard";
import StripeCheckout from "@/components/StripeCheckout";
import Link from "next/link";
import { hasPremiumAccess, setPremiumAccess } from "@/lib/premiumAccess";

const PREMIUM_PASSWORD = "matchpulse123";

const freeFeatures = [
  { text: "Ver todos los partidos del día",     ok: true  },
  { text: "Probabilidades básicas (3 valores)", ok: true  },
  { text: "1 análisis completo al día",          ok: true  },
  { text: "Acceso a estadísticas generales",     ok: true  },
  { text: "Análisis IA completo por partido",    ok: false },
  { text: "Factores clave avanzados",            ok: false },
  { text: "Recomendación accionable IA",         ok: false },
  { text: "Índice de confianza por partido",     ok: false },
  { text: "Champions League — cobertura total",  ok: false },
  { text: "Soporte prioritario",                 ok: false },
];

const premiumFeatures = [
  { text: "Todo lo gratuito incluido",           ok: true },
  { text: "Análisis IA completo — todos los partidos", ok: true },
  { text: "Factores clave avanzados detallados", ok: true },
  { text: "Recomendación accionable IA",         ok: true },
  { text: "Índice de confianza Alta/Media/Baja", ok: true },
  { text: "Champions League — cobertura total",  ok: true },
  { text: "Actualizaciones automáticas diarias", ok: true },
  { text: "Análisis de Champions League + UCL",  ok: true },
  { text: "Soporte prioritario por email",       ok: true },
  { text: "Acceso a histórico de predicciones",  ok: true },
];

function CanceledBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-sm text-amber-400 text-center">
      Pago cancelado — puedes volver a intentarlo cuando quieras.
    </div>
  );
}

export default function PremiumPage() {
  const [password, setPassword]       = useState("");
  const [isAuth, setIsAuth]           = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [activeTab, setActiveTab]     = useState<"login" | "subscribe">("subscribe");

  useEffect(() => {
    const verifyCheckoutSession = async () => {
      const params = new URLSearchParams(window.location.search);
      setShowCanceled(params.get("canceled") === "1" || params.get("canceled") === "true");
      if (hasPremiumAccess()) {
        setIsAuth(true);
      }

      const sessionId = params.get("session_id");
      if (!sessionId) return;

      setVerifyingSession(true);
      try {
        const res = await fetch(`/api/verify-premium-session?session_id=${encodeURIComponent(sessionId)}`);
        const data: { active?: boolean } = await res.json();
        if (res.ok && data.active) {
          setIsAuth(true);
          setPremiumAccess(true);
          setActiveTab("login");
          setError("");
          window.history.replaceState({}, "", "/premium");
        } else {
          setError("No se pudo validar tu suscripción. Escríbenos si el cobro ya fue realizado.");
        }
      } catch {
        setError("Error al validar la sesión de pago. Inténtalo de nuevo en unos segundos.");
      } finally {
        setVerifyingSession(false);
      }
    };

    void verifyCheckoutSession();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (password === PREMIUM_PASSWORD) {
        setIsAuth(true);
        setPremiumAccess(true);
      } else {
        setError("Contraseña incorrecta. Verifica tus credenciales.");
      }
      setLoading(false);
    }, 600);
  };

  if (verifyingSession) {
    return (
      <main className="min-h-screen pt-28 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs px-3 py-2 rounded-full mb-4">
            Verificando suscripción...
          </div>
          <p className="text-sm text-slate-500">Estamos comprobando tu pago con Stripe.</p>
        </div>
      </main>
    );
  }

  // Authenticated premium view
  if (isAuth) {
    return (
      <main className="min-h-screen pb-20">
        <div className="bg-dark-800 border-b border-white/5 pt-20 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs px-3 py-1.5 rounded-full">
                <span>👑</span> Sesión Premium Activa
              </div>
              <button onClick={() => { setIsAuth(false); setPassword(""); setPremiumAccess(false); }}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline">
                Cerrar sesión
              </button>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide mb-2">ANÁLISIS PREMIUM</h1>
            <p className="text-slate-400 text-sm">Acceso completo — todos los análisis IA desbloqueados.</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} isPremiumUser={true} />
            ))}
          </div>
          <p className="text-center text-xs text-slate-700 mt-10">
            ⚠️ Análisis informativo. Sin garantía de resultados. +18.{" "}
            <Link href="/terminos" className="underline">Términos</Link> ·{" "}
            <Link href="/privacidad" className="underline">Privacidad</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center pt-12 mb-12">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs px-4 py-2 rounded-full mb-6">
            👑 Acceso Premium MatchPulse
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wide mb-4">
            ANÁLISIS SIN<br/><span className="text-gold-400">LÍMITES.</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Desbloquea el análisis IA completo de todos los partidos de fútbol europeo. Toma decisiones más informadas, cada día.
          </p>
        </div>

        {/* Canceled notice */}
        <CanceledBanner show={showCanceled} />

        {/* ── Free vs Premium comparison table ── */}
        <div className="mb-12 overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr>
                <th className="bg-dark-800 text-left px-5 py-4 text-sm font-semibold text-slate-400 w-1/2">Funcionalidad</th>
                <th className="bg-dark-800 text-center px-5 py-4 text-sm font-semibold text-slate-400 w-1/4">Gratuito</th>
                <th className="bg-gold-500/10 text-center px-5 py-4 text-sm font-bold text-gold-400 w-1/4 border-l border-gold-500/20">
                  👑 Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {freeFeatures.map((feature, i) => (
                <tr key={feature.text} className={i % 2 === 0 ? "bg-dark-700" : "bg-dark-800"}>
                  <td className="px-5 py-3 text-sm text-slate-300">{feature.text}</td>
                  <td className="px-5 py-3 text-center">
                    {feature.ok
                      ? <span className="text-brand-400 font-bold text-base">✓</span>
                      : <span className="text-slate-700 text-base">✗</span>}
                  </td>
                  <td className="px-5 py-3 text-center border-l border-gold-500/10 bg-gold-500/5">
                    <span className="text-gold-400 font-bold text-base">✓</span>
                  </td>
                </tr>
              ))}
              {/* Price row */}
              <tr className="bg-dark-900 border-t border-white/8">
                <td className="px-5 py-4 text-sm font-bold text-white">Precio</td>
                <td className="px-5 py-4 text-center">
                  <span className="font-display text-xl text-white">0€</span>
                  <span className="text-xs text-slate-500">/mes</span>
                </td>
                <td className="px-5 py-4 text-center border-l border-gold-500/20 bg-gold-500/5">
                  <span className="font-display text-xl text-gold-400">9,99€</span>
                  <span className="text-xs text-slate-500">/mes</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main content — 2 columns */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* LEFT — Pricing + Stripe */}
          <div className="space-y-5">
            <div className="relative bg-dark-700 border border-gold-500/40 rounded-2xl p-8 overflow-hidden"
              style={{ boxShadow: "0 0 40px rgba(245,158,11,0.1)" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"/>
              <div className="absolute top-5 right-5 bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">MÁS POPULAR</div>

              <div className="mb-2">
                <span className="text-2xl">👑</span>
                <h2 className="font-display text-3xl text-gold-400 tracking-wide mt-1">PREMIUM</h2>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-6xl text-white">9,99€</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">≈ 0,33€/día · Sin permanencia · Cancela cuando quieras</p>

              <ul className="space-y-2.5 mb-8">
                {premiumFeatures.slice(0, 6).map(f => (
                  <li key={f.text} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-gold-400 shrink-0 mt-0.5">✓</span>{f.text}
                  </li>
                ))}
              </ul>

              {/* Stripe checkout */}
              <StripeCheckout variant="gold" label="Suscribirse — 9,99€/mes" />
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🔒", label: "Pago\nseguro SSL" },
                { icon: "❌", label: "Sin\npermanencia" },
                { icon: "📊", label: "Datos\nreales" },
              ].map(t => (
                <div key={t.label} className="bg-dark-700 border border-white/8 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{t.icon}</div>
                  <p className="text-[11px] text-slate-500 whitespace-pre-line leading-tight">{t.label}</p>
                </div>
              ))}
            </div>

            {/* Gambling disclaimer */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                ⚠️ <strong className="text-slate-400">Solo análisis informativo.</strong> MatchPulse no garantiza resultados. Apuesta con responsabilidad. +18.{" "}
                <a href="https://www.jugarbien.es" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline">JugarBien.es</a>
              </p>
            </div>
          </div>

          {/* RIGHT — Login tabs */}
          <div>
            {/* Tabs */}
            <div className="flex bg-dark-800 border border-white/8 rounded-xl p-1 mb-5">
              <button onClick={() => setActiveTab("subscribe")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "subscribe" ? "bg-dark-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                Suscribirse
              </button>
              <button onClick={() => setActiveTab("login")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "login" ? "bg-dark-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                Ya tengo acceso
              </button>
            </div>

            {activeTab === "subscribe" ? (
              <div className="bg-dark-700 border border-white/10 rounded-2xl p-8">
                <h2 className="font-display text-2xl text-white tracking-wide mb-2">NUEVA SUSCRIPCIÓN</h2>
                <p className="text-slate-400 text-sm mb-6">Activa tu acceso Premium ahora mismo</p>
                <StripeCheckout variant="gold" label="Comenzar con Stripe — 9,99€/mes" />
                <p className="text-xs text-slate-600 text-center mt-4">
                  Al suscribirte aceptas nuestros{" "}
                  <Link href="/terminos" className="underline hover:text-slate-400">Términos de Uso</Link> y{" "}
                  <Link href="/privacidad" className="underline hover:text-slate-400">Política de Privacidad</Link>.
                </p>
              </div>
            ) : (
              <div className="bg-dark-700 border border-white/10 rounded-2xl p-8">
                <h2 className="font-display text-2xl text-white tracking-wide mb-2">ACCESO CON CONTRASEÑA</h2>
                <p className="text-slate-400 text-sm mb-6">Para clientes con acceso directo</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                      Contraseña de acceso
                    </label>
                    <input type="password" value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••••••"
                      className="w-full bg-dark-800 border border-white/10 focus:border-gold-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-mono"
                      suppressHydrationWarning
                    />
                    {error && <p className="text-red-400 text-xs mt-2">⚠ {error}</p>}
                  </div>
                  <button type="submit" disabled={loading || !password}
                    className="w-full py-4 bg-dark-600 hover:bg-dark-500 border border-white/15 hover:border-white/30 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all">
                    {loading ? "Verificando..." : "Acceder →"}
                  </button>
                </form>

                <div className="mt-5 bg-dark-800 border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-500 text-center">
                    🔑 Demo: <code className="font-mono text-slate-300 bg-dark-700 px-1.5 py-0.5 rounded">matchpulse123</code>
                  </p>
                </div>
              </div>
            )}

            {/* What you unlock */}
            <div className="mt-5 bg-dark-700 border border-white/8 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Con Premium desbloqueas:</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🤖", title: "Análisis IA completo" },
                  { icon: "🎯", title: "Recomendación accionable" },
                  { icon: "🔑", title: "Factores clave avanzados" },
                  { icon: "📈", title: "Índice de confianza" },
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-2 bg-dark-800 border border-white/5 rounded-xl p-3">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <p className="text-xs font-medium text-white leading-tight">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← Volver al inicio</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
