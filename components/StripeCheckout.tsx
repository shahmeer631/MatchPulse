"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface StripeCheckoutProps {
  variant?: "primary" | "gold" | "compact";
  label?: string;
}

export default function StripeCheckout({
  variant = "gold",
  label = "Suscribirse — 9,99€/mes",
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      });

      const data = await res.json();

      if (data.error) {
        // Stripe not configured yet — show friendly message
        if (data.error.includes("no configurado")) {
          alert("💳 Sistema de pago próximamente disponible.\n\nPara acceso de prueba usa la contraseña: matchpulse123");
          setLoading(false);
          return;
        }
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe no cargado");
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al procesar";
      setError(message);
      setLoading(false);
    }
  };

  const baseClass = "flex items-center justify-center gap-2 font-bold text-sm rounded-xl transition-all duration-200 disabled:opacity-60";
  const variants = {
    gold: `w-full py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 ${baseClass}`,
    primary: `w-full py-4 bg-brand-500 hover:bg-brand-400 text-dark-900 ${baseClass}`,
    compact: `px-6 py-3 bg-gold-500 hover:bg-gold-400 text-dark-900 ${baseClass}`,
  };

  return (
    <div className="w-full">
      <button onClick={handleCheckout} disabled={loading} className={variants[variant]}>
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Redirigiendo a pago seguro...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            {label}
          </>
        )}
      </button>

      {/* Secure payment badges */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Pago 100% seguro
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          SSL 256-bit
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
          Cancela gratis
        </div>
      </div>

      {/* Payment method icons */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {["VISA", "MC", "AMEX", "SEPA"].map((card) => (
          <div key={card} className="bg-dark-600 border border-white/10 rounded px-2 py-0.5 text-xs font-mono text-slate-500">
            {card}
          </div>
        ))}
        <div className="bg-dark-600 border border-white/10 rounded px-2 py-0.5 text-xs font-mono text-brand-400">
          Stripe
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
