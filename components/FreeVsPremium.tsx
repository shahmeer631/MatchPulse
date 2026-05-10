import Link from "next/link";

const freeFeatures = [
  { included: true,  text: "Ver partidos del día (todas las ligas)" },
  { included: true,  text: "Probabilidades básicas por partido" },
  { included: true,  text: "1 análisis completo al día" },
  { included: false, text: "Análisis IA completo (todos los partidos)" },
  { included: false, text: "Factores clave avanzados" },
  { included: false, text: "Recomendación accionable por partido" },
  { included: false, text: "Índice de confianza IA" },
  { included: false, text: "Cobertura Champions League completa" },
];

const premiumFeatures = [
  { included: true, text: "Todo lo gratuito incluido" },
  { included: true, text: "Análisis IA completo todos los partidos" },
  { included: true, text: "Factores clave avanzados detallados" },
  { included: true, text: "Recomendación accionable por partido" },
  { included: true, text: "Índice de confianza IA por encuentro" },
  { included: true, text: "Champions League + Europa League" },
  { included: true, text: "Historial de predicciones anteriores" },
  { included: true, text: "Soporte prioritario" },
];

export default function FreeVsPremium() {
  return (
    <section id="precios" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-400 text-sm font-medium tracking-widest uppercase">Planes y precios</span>
          <h2 className="font-display text-5xl sm:text-6xl text-white mt-3 tracking-wide">
            ELIGE TU ACCESO
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Empieza gratis y actualiza cuando veas el valor. Sin permanencia, sin compromisos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FREE */}
          <div className="bg-dark-700 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🆓</span>
                <div>
                  <h3 className="font-display text-2xl text-white tracking-wide">GRATUITO</h3>
                  <p className="text-xs text-slate-500">Para explorar la plataforma</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl text-white">0€</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
            </div>

            <div className="p-8 flex-1">
              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f.text} className={`flex items-start gap-3 text-sm ${f.included ? "text-slate-300" : "text-slate-600"}`}>
                    <span className={`mt-0.5 shrink-0 font-bold ${f.included ? "text-brand-400" : "text-slate-700"}`}>
                      {f.included ? "✓" : "✗"}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-8 pb-8">
              <Link href="/matches"
                className="block w-full text-center py-3.5 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all">
                Empezar gratis
              </Link>
            </div>
          </div>

          {/* PREMIUM */}
          <div className="relative bg-dark-700 border border-gold-500/50 rounded-2xl overflow-hidden flex flex-col"
            style={{ boxShadow: "0 0 40px rgba(245,158,11,0.12)" }}>
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"/>

            {/* Popular badge */}
            <div className="absolute top-5 right-5 bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
              MÁS POPULAR
            </div>

            <div className="p-8 border-b border-gold-500/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">👑</span>
                <div>
                  <h3 className="font-display text-2xl text-gold-400 tracking-wide">PREMIUM</h3>
                  <p className="text-xs text-slate-500">Para apostar con ventaja real</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl text-white">9,99€</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">≈ 0,33€/día · Cancela cuando quieras</p>
            </div>

            <div className="p-8 flex-1">
              <ul className="space-y-3">
                {premiumFeatures.map((f) => (
                  <li key={f.text} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 shrink-0 font-bold text-gold-400">✓</span>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-8 pb-8 space-y-3">
              <Link href="/premium"
                className="block w-full text-center py-3.5 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold text-sm rounded-xl transition-all">
                Activar Premium → 9,99€/mes
              </Link>
              <p className="text-center text-xs text-slate-600">
                Pago seguro · Sin permanencia · Cancela en 1 clic
              </p>
            </div>
          </div>
        </div>

        {/* Trust signal */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            ⚠️ <strong className="text-slate-500">Aviso importante:</strong> MatchPulse es una herramienta de análisis informativo basada en estadísticas y datos históricos.
            No garantizamos resultados ni beneficios económicos. Las apuestas deportivas conllevan riesgo. Apuesta de forma responsable. Solo mayores de 18 años.
          </p>
        </div>
      </div>
    </section>
  );
}
