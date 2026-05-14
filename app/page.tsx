import Link from "next/link";
import { matches } from "@/data/matches";
import MatchCard from "@/components/MatchCard";
import EmailCapture from "@/components/EmailCapture";
import FreeVsPremium from "@/components/FreeVsPremium";
import TrustBar from "@/components/TrustBar";

export default function HomePage() {
  const featuredMatches = matches.slice(0, 3);

  return (
    <main className="min-h-screen">

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        {/* Background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/6 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gold-500/4 rounded-full blur-3xl pointer-events-none"/>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-8">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"/>
            Análisis IA disponible ahora · Actualización diaria
          </div>

          {/* Headline */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-wider text-white mb-4 leading-[0.9]">
            APUESTA<br/>
            <span className="gradient-text">MÁS LISTO.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-4 mt-6 leading-relaxed">
            Análisis estadístico con inteligencia artificial para fútbol europeo.
            Probabilidades, factores clave y datos avanzados para tomar decisiones más informadas.
          </p>

          {/* Disclaimer inline */}
          <p className="text-xs text-slate-600 mb-10">
            ⚠️ Herramienta de análisis informativo. Sin garantía de resultados. +18. Apuesta con responsabilidad.
          </p>

          {/* Email capture - primary CTA */}
          <EmailCapture variant="hero" />

          {/* Secondary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link href="/matches"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4">
              Ver partidos de hoy →
            </Link>
            <span className="hidden sm:block text-slate-700">·</span>
            <Link href="/premium"
              className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors">
              👑 Acceso Premium — 9,99€/mes
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-16 pt-10 border-t border-white/5">
            {[
              { val: "4", label: "Ligas cubiertas" },
              { val: "73%", label: "Precisión media" },
              { val: "+2.400", label: "Usuarios activos" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl sm:text-4xl text-brand-400">{s.val}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-700 text-xs">
          <div className="w-px h-10 bg-gradient-to-b from-slate-600 to-transparent"/>
        </div>
      </section>

      {/* Trust bar */}
      <TrustBar />

      {/* ========== HOW IT WORKS ========== */}
      <section id="como-funciona" className="py-24 px-4 bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-medium tracking-widest uppercase">El sistema</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-3 tracking-wide">
              CÓMO FUNCIONA
            </h2>
            <p className="text-slate-400 mt-4 text-sm max-w-lg mx-auto">
              No somos videntes — somos analistas. Usamos datos para darte una ventaja informativa real.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                step: "01",
                title: "Recopilamos datos",
                desc: "Analizamos datos históricos, forma reciente, estadísticas de equipos, lesiones confirmadas y contexto táctico de cada partido.",
                color: "brand"
              },
              {
                icon: "🤖",
                step: "02",
                title: "La IA procesa",
                desc: "Nuestro modelo evalúa más de 40 variables por partido: xG, posesión, presión, cuotas de mercado, head-to-head y mucho más.",
                color: "violet"
              },
              {
                icon: "🎯",
                step: "03",
                title: "Recibes el análisis",
                desc: "Obtienes probabilidades claras, factores clave y una recomendación accionable antes de que empiece el partido.",
                color: "gold"
              }
            ].map((item) => (
              <div key={item.step}
                className="bg-dark-700 border border-white/8 rounded-2xl p-8 hover:border-white/15 transition-all group">
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="font-mono text-xs text-slate-600 mb-2 tracking-wider">{item.step}</div>
                <h3 className="font-display text-xl text-white tracking-wide mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Important disclaimer box */}
          <div className="mt-10 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4">
            <span className="text-2xl shrink-0">⚠️</span>
            <div>
              <h4 className="text-sm font-semibold text-amber-400 mb-1">Importante — Análisis informativo</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                MatchPulse proporciona análisis estadístico e informativo basado en datos históricos y modelos probabilísticos.
                Nuestros análisis <strong className="text-slate-300">no garantizan resultados ni beneficios económicos</strong>.
                Las apuestas deportivas conllevan riesgo económico. Apuesta únicamente lo que puedas permitirte perder. Solo mayores de 18 años.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED MATCHES ========== */}
      <section id="partidos" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-brand-400 text-sm mb-3">
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"/>
                Análisis disponibles hoy
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
                PARTIDOS DESTACADOS
              </h2>
            </div>
            <Link href="/matches" className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              Ver todos →
            </Link>
          </div>

          {/* Free vs Premium indicator */}
          <div className="flex items-center gap-6 mb-6 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-brand-500/30 border border-brand-500/60"/>
              Análisis gratuito
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-gold-500/30 border border-gold-500/60"/>
              Análisis Premium
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredMatches.map((match) => (
              <MatchCard key={match.id} match={match} isPremiumUser={false} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/matches"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm rounded-xl transition-all">
              Ver todos los partidos →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== EXAMPLE ANALYSIS (Sofascore/Flashscore style) ========== */}
      <section className="py-24 px-4 bg-dark-800 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-brand-400 text-sm font-medium tracking-widest uppercase">Vista previa real</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-3 tracking-wide">
              ASÍ SON NUESTROS ANÁLISIS
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Claro, directo y basado en datos — sin humo, sin falsas promesas.
            </p>
          </div>

          {/* Example match card — Sofascore-inspired clean layout */}
          <div className="bg-dark-700 border border-brand-500/20 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(34,197,94,0.08)" }}>

            {/* Match header bar */}
            <div className="bg-dark-800 px-6 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">🇪🇸 La Liga</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Sab 10 May · 21:00</span>
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse"/>
                <span className="text-brand-400">Análisis listo</span>
              </div>
            </div>

            {/* Teams row — Sofascore style */}
            <div className="px-6 py-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-dark-600 border-2 border-gold-500/30 flex items-center justify-center font-display text-xl text-white shrink-0">RM</div>
                  <div>
                    <p className="font-semibold text-white text-lg">Real Madrid</p>
                    <p className="text-xs text-slate-500">Local</p>
                  </div>
                </div>

                <div className="text-center shrink-0 px-4">
                  <div className="font-display text-3xl text-slate-600 tracking-widest">VS</div>
                </div>

                <div className="flex items-center gap-4 flex-1 justify-end text-right">
                  <div>
                    <p className="font-semibold text-white text-lg">FC Barcelona</p>
                    <p className="text-xs text-slate-500">Visitante</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-dark-600 border-2 border-white/10 flex items-center justify-center font-display text-xl text-white shrink-0">FCB</div>
                </div>
              </div>

              {/* Probability bars — clean data display */}
              <div className="mt-8 space-y-2">
                <div className="flex items-center text-xs text-slate-500 mb-3 justify-between">
                  <span>Probabilidades IA</span>
                  <span className="text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full text-xs">Confianza Alta</span>
                </div>
                {[
                  { label: "Victoria Real Madrid", pct: 42, color: "bg-brand-500" },
                  { label: "Empate", pct: 24, color: "bg-slate-400" },
                  { label: "Victoria Barcelona", pct: 34, color: "bg-orange-400" },
                ].map((bar) => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-40 shrink-0">{bar.label}</span>
                    <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.pct}%` }}/>
                    </div>
                    <span className="text-xs font-mono text-slate-300 w-8 text-right">{bar.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Analysis */}
              <div className="mt-6 bg-dark-800 rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
                    <path d="M12 2L13.09 8.26L19 6L15.45 11.09L21 12L15.45 12.91L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 12.91L3 12L8.55 11.09L5 6L10.91 8.26L12 2Z"/>
                  </svg>
                  <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Análisis IA</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  El Clásico llega en un momento decisivo. Real Madrid con ventaja de local y Vinícius Jr. en racha
                  goleadora (7 goles en 5 partidos). Barcelona presenta baja confirmada de Pedri, debilitando el centro del campo...
                </p>
                <div className="space-y-1.5">
                  {[
                    "Vinícius Jr. en estado de forma excepcional",
                    "Pedri baja confirmada — centro del campo debilitado",
                    "Real Madrid invicto en casa esta temporada",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-brand-400 shrink-0">▸</span>{f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-4 flex items-center gap-3 bg-brand-500/5 border border-brand-500/20 rounded-xl p-4">
                <span className="text-xl">🎯</span>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Recomendación IA</div>
                  <div className="text-sm font-bold text-brand-400">Victoria Local o Empate (1X)</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA below example */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-400 mb-4">¿Quieres ver este análisis completo + todos los partidos?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/matches"
                className="px-6 py-3 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white text-sm rounded-xl transition-all">
                Ver partidos gratis
              </Link>
              <Link href="/premium"
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold text-sm rounded-xl transition-all">
                👑 Acceso Premium — 9,99€/mes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FREE VS PREMIUM ========== */}
      <FreeVsPremium />

      {/* ========== EMAIL CAPTURE BANNER ========== */}
      <section className="py-20 px-4 bg-dark-800 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse"/>
            Gratis para siempre
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-4">
            RECIBE ANÁLISIS<br/>
            <span className="gradient-text">CADA DÍA</span>
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Únete a más de 2.400 usuarios que ya reciben nuestros análisis diarios directamente en su correo.
            Gratis, sin spam, cancela cuando quieras.
          </p>
          <div className="flex justify-center">
            <EmailCapture variant="banner" />
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-600">
            <span>✓ Sin spam</span>
            <span>✓ 1 análisis al día</span>
            <span>✓ Cancela cuando quieras</span>
          </div>
        </div>
      </section>

      {/* ========== SOCIAL PROOF ========== */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-10">Lo que dicen nuestros usuarios</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                name: "Carlos M.",
                location: "Madrid",
                text: "Por fin una plataforma que explica el POR QUÉ detrás de cada análisis. Los factores clave son lo mejor.",
                stars: 5,
              },
              {
                name: "Iván R.",
                location: "Barcelona",
                text: "Llevo 3 semanas con Premium y la calidad de los análisis es muy buena. Mucho más informado que antes.",
                stars: 5,
              },
              {
                name: "Sergio P.",
                location: "Valencia",
                text: "La versión gratuita ya aporta mucho valor. Con Premium tienes todo lo que necesitas para analizar un partido.",
                stars: 4,
              },
            ].map((review) => (
              <div key={review.name} className="bg-dark-700 border border-white/8 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <span key={i} className="text-gold-400 text-sm">★</span>
                  ))}
                  {Array.from({ length: 5 - review.stars }).map((_, i) => (
                    <span key={i} className="text-slate-700 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{review.text}"</p>
                <div>
                  <p className="text-xs font-semibold text-white">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 px-4 bg-dark-800 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-4">
            EMPIEZA HOY.<br/>
            <span className="gradient-text">GRATIS.</span>
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Sin tarjeta de crédito. Sin compromiso. Acceso inmediato a los partidos del día.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/matches"
              className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-400 text-dark-900 font-bold text-base rounded-xl transition-all glow-green">
              Ver partidos de hoy →
            </Link>
            <Link href="/premium"
              className="w-full sm:w-auto px-8 py-4 border border-gold-500/40 hover:border-gold-400 text-gold-400 font-semibold text-base rounded-xl transition-all hover:bg-gold-500/5">
              👑 Ir a Premium
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-dark-900 border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#030712" strokeWidth="2"/>
                    <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" fill="#030712"/>
                  </svg>
                </div>
                <span className="font-display text-xl tracking-wider text-white">MATCH<span className="text-brand-400">PULSE</span></span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Análisis deportivo con inteligencia artificial para fútbol europeo.
                Diseñado para apostar de forma más informada.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Navegación</h4>
              <ul className="space-y-2">
                {[
                  { label: "Partidos de hoy", href: "/matches" },
                  { label: "Cómo funciona", href: "/#como-funciona" },
                  { label: "Precios", href: "/#precios" },
                  { label: "Acceso Premium", href: "/premium" },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  { label: "Política de Privacidad", href: "/privacidad" },
                  { label: "Términos de Uso", href: "/terminos" },
                  { label: "Aviso Legal", href: "/terminos" },
                  { label: "Cookies", href: "/privacidad" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8">
            <p className="text-xs text-slate-700 text-center leading-relaxed max-w-2xl mx-auto">
              ⚠️ <strong className="text-slate-600">Aviso de juego responsable:</strong> MatchPulse es una plataforma de análisis informativo.
              No garantizamos resultados ni beneficios económicos. Las apuestas deportivas pueden causar adicción y pérdidas económicas.
              Apuesta solo lo que puedas permitirte perder. Servicio exclusivo para mayores de 18 años.
              Si crees que tienes un problema con el juego, contacta con{" "}
              <a href="https://www.jugarbien.es" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 underline">JugarBien.es</a>.
            </p>
            <p className="text-xs text-slate-700 text-center mt-4">© 2025 MatchPulse · Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
