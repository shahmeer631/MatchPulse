import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StatsTicker from "@/components/StatsTicker";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://matchpulse.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "MatchPulse | Análisis de Fútbol con Inteligencia Artificial",
    template: "%s | MatchPulse",
  },
  description:
    "Plataforma de análisis deportivo con IA para fútbol europeo. Probabilidades precisas, factores clave y análisis estadístico para La Liga, Premier League, Serie A y Champions League.",
  keywords: [
    "análisis fútbol IA", "predicciones fútbol España", "apuestas deportivas análisis",
    "La Liga predicciones", "Premier League análisis", "Champions League estadísticas",
    "probabilidades fútbol", "inteligencia artificial deporte",
  ],
  authors: [{ name: "MatchPulse" }],
  creator: "MatchPulse",
  publisher: "MatchPulse",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },

  // Open Graph — social sharing
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: APP_URL,
    siteName: "MatchPulse",
    title: "MatchPulse | Análisis de Fútbol con Inteligencia Artificial",
    description: "Probabilidades precisas, factores clave y análisis IA para La Liga, Premier League, Serie A y Champions League.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "MatchPulse — Análisis deportivo con IA",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "MatchPulse | Análisis de Fútbol con IA",
    description: "Probabilidades y análisis estadístico para apostar de forma más informada.",
    images: ["/og-image.svg"],
    creator: "@matchpulse",
  },

  // Favicon
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },

  // Manifest for PWA-readiness
  manifest: "/manifest.json",

  // Canonical
  alternates: { canonical: APP_URL },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#22C55E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Structured data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MatchPulse",
              url: APP_URL,
              description: "Plataforma de análisis deportivo con inteligencia artificial para fútbol europeo",
              inLanguage: "es-ES",
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        <div className="pt-16">
          <StatsTicker />
        </div>
        {children}
      </body>
    </html>
  );
}
