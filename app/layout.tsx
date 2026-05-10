import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StatsTicker from "@/components/StatsTicker";

export const metadata: Metadata = {
  title: "MatchPulse | Inteligencia Artificial para Apuestas Deportivas",
  description: "Análisis deportivo con IA. Predicciones precisas, factores clave y probabilidades en tiempo real para fútbol europeo.",
  keywords: "apuestas deportivas, análisis fútbol, predicciones IA, La Liga, Premier League, Champions League",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <div className="pt-16">
          <StatsTicker />
        </div>
        {children}
      </body>
    </html>
  );
}
