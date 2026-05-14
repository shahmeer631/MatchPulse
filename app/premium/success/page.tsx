"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { setStripePremiumVerified } from "@/lib/premiumAccess";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId    = searchParams.get("session_id");

  const [verifyState, setVerifyState] = useState<"idle" | "loading" | "ok" | "error">(
    sessionId ? "loading" : "idle"
  );
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setVerifyState("idle");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/verify-checkout-session", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ sessionId }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setVerifyError(typeof data.error === "string" ? data.error : "No se pudo verificar el pago");
          setVerifyState("error");
          return;
        }
        setStripePremiumVerified();
        setVerifyState("ok");
      } catch {
        if (!cancelled) {
          setVerifyError("Error de red al verificar el pago");
          setVerifyState("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const verifying = sessionId && verifyState === "loading";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-brand-500/20 border-2 border-brand-500 flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-display text-4xl text-white tracking-wide mb-3">¡BIENVENIDO A PREMIUM!</h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Tu suscripción está activa. Ya tienes acceso completo a todos los análisis IA de MatchPulse.
        </p>

        {verifying && (
          <p className="text-slate-500 text-xs mb-6 animate-pulse">Confirmando pago con Stripe…</p>
        )}

        {verifyState === "error" && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-left text-sm text-red-300">
            {verifyError}. Si ya pagaste, contacta soporte con tu comprobante. Puedes seguir a la zona Premium;
            el acceso se activará cuando la verificación funcione.
          </div>
        )}

        <div className="bg-dark-700 border border-brand-500/20 rounded-2xl p-6 mb-8 text-left space-y-3">
          {["Análisis IA completo — todos los partidos", "Factores clave avanzados por partido", "Recomendaciones accionables diarias", "La Liga · Premier · Serie A · Champions"].map(f => (
            <div key={f} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="text-brand-400 shrink-0">✓</span>{f}
            </div>
          ))}
        </div>

        <Link
          href="/premium"
          className={`block w-full py-4 font-bold text-sm rounded-xl transition-all ${
            verifying
              ? "bg-slate-700 text-slate-400 pointer-events-none"
              : "bg-brand-500 hover:bg-brand-400 text-dark-900"
          }`}
        >
          {verifying ? "Espera un momento…" : "Acceder a mis análisis →"}
        </Link>
        <p className="text-xs text-slate-600 mt-4">Recibirás un email de confirmación con los detalles de tu suscripción</p>
      </div>
    </main>
  );
}

function SuccessFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      <p className="text-slate-500 text-sm">Cargando…</p>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
