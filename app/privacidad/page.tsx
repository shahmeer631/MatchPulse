import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | MatchPulse",
  description: "Política de privacidad de MatchPulse — cómo recopilamos, usamos y protegemos tus datos.",
};

export default function PrivacidadPage() {
  const sections = [
    {
      title: "1. Responsable del Tratamiento",
      content: "MatchPulse es el responsable del tratamiento de tus datos personales. Para cualquier consulta relacionada con tu privacidad, puedes contactarnos en: privacidad@matchpulse.com"
    },
    {
      title: "2. Datos que Recopilamos",
      content: "Recopilamos los siguientes datos cuando usas MatchPulse: (a) Dirección de email cuando te suscribes a nuestro boletín o contratas Premium. (b) Datos de pago procesados de forma segura por Stripe — MatchPulse nunca almacena datos de tarjetas. (c) Datos de uso anónimos para mejorar la plataforma (páginas visitadas, clics, tiempo en página)."
    },
    {
      title: "3. Finalidad del Tratamiento",
      content: "Usamos tus datos para: enviar análisis deportivos diarios (si te suscribiste), gestionar tu suscripción Premium, mejorar nuestros servicios y cumplir con obligaciones legales. Nunca vendemos tus datos a terceros."
    },
    {
      title: "4. Base Legal",
      content: "El tratamiento de tus datos se basa en: tu consentimiento expreso al suscribirte, la ejecución del contrato de suscripción Premium, y nuestros intereses legítimos para mejorar el servicio."
    },
    {
      title: "5. Conservación de Datos",
      content: "Conservamos tus datos mientras mantengas tu cuenta activa o sea necesario para los fines descritos. Al cancelar tu suscripción, eliminaremos tus datos en un plazo máximo de 30 días, salvo obligación legal de conservarlos."
    },
    {
      title: "6. Tus Derechos",
      content: "Tienes derecho a: acceder a tus datos, rectificarlos, suprimirlos, oponerte al tratamiento, portabilidad de datos y limitación del tratamiento. Para ejercer cualquier derecho, escríbenos a privacidad@matchpulse.com. También puedes presentar una reclamación ante la AEPD (aepd.es)."
    },
    {
      title: "7. Cookies",
      content: "Usamos cookies técnicas necesarias para el funcionamiento del sitio y cookies analíticas (anonimizadas) para mejorar la experiencia. Puedes gestionar las cookies desde la configuración de tu navegador."
    },
    {
      title: "8. Seguridad",
      content: "Implementamos medidas técnicas y organizativas para proteger tus datos: conexiones HTTPS/TLS, pagos procesados por Stripe (certificado PCI-DSS), y acceso restringido a datos personales."
    },
    {
      title: "9. Transferencias Internacionales",
      content: "Algunos proveedores (Stripe, servicios de email) pueden procesar datos fuera del EEE bajo cláusulas contractuales tipo aprobadas por la Comisión Europea."
    },
    {
      title: "10. Cambios en esta Política",
      content: "Podemos actualizar esta política. Te notificaremos cambios significativos por email o mediante aviso en el sitio. La fecha de última actualización aparece al final del documento."
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6 block">← Volver al inicio</Link>
          <h1 className="font-display text-5xl text-white tracking-wide mb-3">POLÍTICA DE PRIVACIDAD</h1>
          <p className="text-slate-500 text-sm">Última actualización: Mayo 2025 · Versión 1.0</p>
        </div>

        {/* Intro box */}
        <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-6 mb-10">
          <p className="text-sm text-slate-300 leading-relaxed">
            En MatchPulse nos tomamos tu privacidad en serio. Esta política explica de forma clara y sencilla qué datos recopilamos, por qué los usamos y cuáles son tus derechos. Cumplimos con el <strong className="text-white">Reglamento General de Protección de Datos (RGPD)</strong> y la normativa española vigente.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="border-b border-white/5 pb-8">
              <h2 className="font-display text-xl text-white tracking-wide mb-3">{s.title.toUpperCase()}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-dark-700 border border-white/8 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-400 mb-2">¿Tienes preguntas sobre tu privacidad?</p>
          <a href="mailto:privacidad@matchpulse.com" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">privacidad@matchpulse.com</a>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/terminos" className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline">Términos de Uso</Link>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">← Inicio</Link>
        </div>
      </div>
    </main>
  );
}
