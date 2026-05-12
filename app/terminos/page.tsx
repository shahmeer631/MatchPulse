import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Uso | MatchPulse",
  description: "Términos y condiciones de uso de MatchPulse — plataforma de análisis deportivo.",
};

export default function TerminosPage() {
  const sections = [
    {
      title: "1. Aceptación de los Términos",
      content: "Al acceder y usar MatchPulse, aceptas estos Términos de Uso en su totalidad. Si no estás de acuerdo, no uses el servicio. El uso continuado implica aceptación de cualquier actualización."
    },
    {
      title: "2. Descripción del Servicio",
      content: "MatchPulse es una plataforma de análisis deportivo informativo basado en estadísticas, datos históricos e inteligencia artificial. El servicio incluye análisis de partidos de fútbol europeo, probabilidades estadísticas y recomendaciones de carácter meramente orientativo."
    },
    {
      title: "3. Aviso Legal Importante — Apuestas Deportivas",
      content: "⚠️ IMPORTANTE: MatchPulse NO es un operador de apuestas. Todo el contenido es análisis informativo y estadístico. NO garantizamos ningún resultado ni beneficio económico. Las apuestas deportivas conllevan riesgo de pérdida económica. Solo mayores de 18 años. Si tienes problemas con el juego, contacta con JugarBien.es o llama al 900 200 160 (gratuito)."
    },
    {
      title: "4. Requisito de Edad",
      content: "El acceso a MatchPulse está restringido a mayores de 18 años. Al registrarte, confirmas que tienes al menos 18 años. MatchPulse puede solicitar verificación de edad en cualquier momento."
    },
    {
      title: "5. Cuentas y Suscripciones",
      content: "La suscripción Premium cuesta 9,99€/mes con facturación mensual recurrente. Puedes cancelar en cualquier momento desde tu panel de control o contactando con soporte. No realizamos reembolsos de períodos ya facturados, salvo en los casos previstos por la normativa de consumidores de la UE."
    },
    {
      title: "6. Propiedad Intelectual",
      content: "Todo el contenido de MatchPulse (análisis, textos, diseño, marca) es propiedad de MatchPulse. Queda prohibida su reproducción, distribución o uso comercial sin autorización expresa. Los datos estadísticos de partidos son de dominio público o están licenciados."
    },
    {
      title: "7. Limitación de Responsabilidad",
      content: "MatchPulse no se hace responsable de pérdidas económicas derivadas de decisiones de apuesta basadas en nuestros análisis. El servicio se proporciona 'tal cual', sin garantías de disponibilidad continua. Nuestra responsabilidad máxima se limita al importe pagado en los últimos 3 meses."
    },
    {
      title: "8. Conducta del Usuario",
      content: "Está prohibido: compartir credenciales de acceso Premium, usar el servicio con bots o scrapers, publicar contenido ofensivo o ilegal, o intentar eludir medidas de seguridad. El incumplimiento puede resultar en cancelación inmediata de la cuenta sin reembolso."
    },
    {
      title: "9. Modificaciones del Servicio",
      content: "MatchPulse puede modificar, suspender o interrumpir el servicio en cualquier momento. Notificaremos cambios significativos con al menos 30 días de antelación via email."
    },
    {
      title: "10. Ley Aplicable",
      content: "Estos términos se rigen por la legislación española. Para cualquier disputa, las partes se someten a los tribunales de España, sin perjuicio de los derechos que la normativa de consumidores de la UE pueda reconocerte."
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6 block">← Volver al inicio</Link>
          <h1 className="font-display text-5xl text-white tracking-wide mb-3">TÉRMINOS DE USO</h1>
          <p className="text-slate-500 text-sm">Última actualización: Mayo 2025 · Versión 1.0</p>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 mb-10">
          <div className="flex gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-amber-400">Aviso de Juego Responsable:</strong> MatchPulse es una herramienta de análisis informativo. No somos un operador de apuestas. Las apuestas conllevan riesgo de pérdida. Solo +18. Ayuda: <a href="https://www.jugarbien.es" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline">jugarbien.es</a> · Tel: <strong className="text-white">900 200 160</strong> (gratuito)
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="border-b border-white/5 pb-8">
              <h2 className="font-display text-xl text-white tracking-wide mb-3">{s.title.toUpperCase()}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-dark-700 border border-white/8 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-400 mb-2">¿Tienes preguntas sobre los términos?</p>
          <a href="mailto:legal@matchpulse.com" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">legal@matchpulse.com</a>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/privacidad" className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline">Política de Privacidad</Link>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">← Inicio</Link>
        </div>
      </div>
    </main>
  );
}
