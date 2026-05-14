"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { hasPremiumAccess } from "@/lib/premiumAccess";

// Only initialise Stripe when publishable key exists
const getStripe = (() => {
  let promise: ReturnType<typeof loadStripe> | null = null;
  return () => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key || key.includes("REPLACE")) return null;
    if (!promise) promise = loadStripe(key);
    return promise;
  };
})();

interface Props {
  variant?: "primary" | "gold" | "compact";
  label?: string;
  email?: string;
}

export default function StripeCheckout({ variant = "gold", label = "Suscribirse — 9,99€/mes", email }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const isConfigured = !!(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes("REPLACE")
  );

  const handleCheckout = async () => {
    if (hasPremiumAccess()) {
      window.location.href = "/premium";
      return;
    }

    if (!isConfigured) {
      alert("💳 Stripe aún no configurado.\n\nPara activar el pago:\n1. Añade tus claves de Stripe en .env.local\n2. Crea un producto en dashboard.stripe.com\n3. Añade STRIPE_PRICE_ID (price_… o prod_…) a .env.local\n\nPara acceso de prueba: usa la contraseña 'matchpulse2025'");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Error iniciando pago");

      // Prefer direct URL redirect (Stripe Checkout hosted page)
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Fallback to redirectToCheckout
      const stripe = await getStripe();
      if (!stripe) throw new Error("Stripe no disponible");
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (stripeError) throw new Error(stripeError.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      setLoading(false);
    }
  };

  const base = "flex items-center justify-center gap-2 font-bold text-sm rounded-xl transition-all duration-200 disabled:opacity-60 cursor-pointer";
  const styles = {
    gold:    `w-full py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 ${base}`,
    primary: `w-full py-4 bg-brand-500 hover:bg-brand-400 text-dark-900 ${base}`,
    compact: `px-6 py-3 bg-gold-500 hover:bg-gold-400 text-dark-900 ${base}`,
  };

  return (
    <div className="w-full">
      <button onClick={handleCheckout} disabled={loading} className={styles[variant]}>
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Redirigiendo al pago...
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            {label}
          </>
        )}
      </button>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-4 mt-3">
        {[
          { icon: "🔒", text: "SSL 256-bit" },
          { icon: "🛡️", text: "Pago seguro" },
          { icon: "↩️", text: "Cancela gratis" },
        ].map(b => (
          <div key={b.text} className="flex items-center gap-1 text-xs text-slate-600">
            <span>{b.icon}</span><span>{b.text}</span>
          </div>
        ))}
      </div>

      {/* Card logos */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {["VISA", "MC", "AMEX", "SEPA", "Stripe"].map(c => (
          <div key={c} className={`border rounded px-1.5 py-0.5 text-[10px] font-mono ${c === "Stripe" ? "border-brand-500/30 text-brand-400" : "border-white/10 text-slate-600"}`}>
            {c}
          </div>
        ))}
      </div>

      {!isConfigured && (
        <p className="text-center text-[10px] text-slate-700 mt-2">
          ⚙️ Stripe pendiente de configuración — añadir claves en .env.local
        </p>
      )}

      {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}
