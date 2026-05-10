export type League = "La Liga" | "Premier League" | "Serie A" | "Champions League";

export interface Insight {
  homeWin: number;
  draw: number;
  awayWin: number;
  analysis: string;
  keyFactors: string[];
  recommendation: string;
  confidence: "Alta" | "Media" | "Baja";
  isPremium: boolean;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  date: string;
  time: string;
  league: League;
  leagueFlag: string;
  insight: Insight;
}

export const matches: Match[] = [
  {
    id: "1",
    homeTeam: "Real Madrid",
    awayTeam: "FC Barcelona",
    homeLogo: "https://api.dicebear.com/7.x/initials/svg?seed=RM&backgroundColor=fbbf24&textColor=0f172a",
    awayLogo: "https://api.dicebear.com/7.x/initials/svg?seed=FCB&backgroundColor=3b82f6&textColor=ffffff",
    date: "2025-05-10",
    time: "21:00",
    league: "La Liga",
    leagueFlag: "🇪🇸",
    insight: {
      homeWin: 42,
      draw: 24,
      awayWin: 34,
      analysis: "El Clásico llega en un momento decisivo para la clasificación. Real Madrid llega con ventaja en casa y con Vinícius Jr. en estado de forma excepcional (7 goles en los últimos 5 partidos). Barcelona presenta baja de Pedri por lesión, lo que debilita su centro del campo.",
      keyFactors: [
        "Vinícius Jr. en racha goleadora (7 goles en 5 partidos)",
        "Pedri baja confirmada para Barcelona",
        "Real Madrid invicto en casa en la última temporada",
        "Barça encajó en sus últimos 4 desplazamientos",
        "Árbitro favorable históricamente al equipo local"
      ],
      recommendation: "Victoria Local o Empate (1X)",
      confidence: "Alta",
      isPremium: false,
    },
  },
  {
    id: "2",
    homeTeam: "Atlético Madrid",
    awayTeam: "Sevilla FC",
    homeLogo: "https://api.dicebear.com/7.x/initials/svg?seed=ATM&backgroundColor=ef4444&textColor=ffffff",
    awayLogo: "https://api.dicebear.com/7.x/initials/svg?seed=SFC&backgroundColor=f97316&textColor=ffffff",
    date: "2025-05-10",
    time: "18:30",
    league: "La Liga",
    leagueFlag: "🇪🇸",
    insight: {
      homeWin: 55,
      draw: 22,
      awayWin: 23,
      analysis: "Atlético llega líder y con la necesidad de sumar para mantener distancia. Sevilla en mala dinámica, sin ganar en los últimos 6 desplazamientos. El Cholo Simeone tiene un registro histórico excepcional en este tipo de encuentros.",
      keyFactors: [
        "Atlético lleva 8 partidos sin perder en casa",
        "Sevilla sin ganar fuera en sus últimos 6",
        "Morata recuperado al 100% tras lesión muscular",
        "Sevilla encaja una media de 2.1 goles/partido fuera",
        "Simeone tiene 80% winrate vs equipos medios en casa"
      ],
      recommendation: "Victoria Local (1)",
      confidence: "Alta",
      isPremium: true,
    },
  },
  {
    id: "3",
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    homeLogo: "https://api.dicebear.com/7.x/initials/svg?seed=MCI&backgroundColor=60a5fa&textColor=0f172a",
    awayLogo: "https://api.dicebear.com/7.x/initials/svg?seed=ARS&backgroundColor=ef4444&textColor=ffffff",
    date: "2025-05-11",
    time: "17:30",
    league: "Premier League",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    insight: {
      homeWin: 47,
      draw: 26,
      awayWin: 27,
      analysis: "Partido estelar en el Etihad. City con Haaland plenamente recuperado marca 1.8 goles de promedio en casa. Arsenal llega en racha pero históricamente sufre en estos desplazamientos. Ambos equipos juegan alto y generan muchas ocasiones.",
      keyFactors: [
        "Haaland recuperado y en forma excepcional",
        "Arsenal sin ganar en el Etihad en los últimos 5 años",
        "Partido con promedio de +3.1 goles en los últimos 6 enfrentamientos",
        "City presiona altísimo, Arsenal vulnerable al contraataque",
        "Ambos equipos necesitan los 3 puntos para el título"
      ],
      recommendation: "Más de 2.5 goles + Victoria Local",
      confidence: "Media",
      isPremium: true,
    },
  },
  {
    id: "4",
    homeTeam: "Liverpool",
    awayTeam: "Chelsea",
    homeLogo: "https://api.dicebear.com/7.x/initials/svg?seed=LIV&backgroundColor=dc2626&textColor=ffffff",
    awayLogo: "https://api.dicebear.com/7.x/initials/svg?seed=CHE&backgroundColor=1d4ed8&textColor=ffffff",
    date: "2025-05-11",
    time: "14:00",
    league: "Premier League",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    insight: {
      homeWin: 52,
      draw: 21,
      awayWin: 27,
      analysis: "Anfield como fortaleza. Liverpool invicto en casa esta temporada con 14 victorias. Chelsea en reconstrucción bajo nuevo entrenador, aún sin encontrar estabilidad defensiva. Mo Salah en su mejor versión.",
      keyFactors: [
        "Liverpool 14-0-0 en casa esta temporada",
        "Salah top scorer de la Premier con 24 goles",
        "Chelsea encaja en el 80% de sus desplazamientos",
        "Nuevo sistema táctico de Chelsea aún sin consolidar",
        "Anfield ejerce una presión psicológica enorme"
      ],
      recommendation: "Victoria Local (1)",
      confidence: "Alta",
      isPremium: true,
    },
  },
  {
    id: "5",
    homeTeam: "Juventus",
    awayTeam: "Inter de Milán",
    homeLogo: "https://api.dicebear.com/7.x/initials/svg?seed=JUV&backgroundColor=1e293b&textColor=ffffff",
    awayLogo: "https://api.dicebear.com/7.x/initials/svg?seed=INT&backgroundColor=1d4ed8&textColor=ffffff",
    date: "2025-05-12",
    time: "20:45",
    league: "Serie A",
    leagueFlag: "🇮🇹",
    insight: {
      homeWin: 33,
      draw: 30,
      awayWin: 37,
      analysis: "Derby d'Italia siempre impredecible. Inter llega como campeón defensor y en mejor forma. Juventus en casa pero sin convencer. Partido muy táctico esperado con pocos goles.",
      keyFactors: [
        "Inter ganó los últimos 3 enfrentamientos directos",
        "Juventus en casa con registro mediocre (50% victorias)",
        "Duván Zapata baja confirmada para Inter",
        "Histórico de Under 2.5 en el 65% de este enfrentamiento",
        "Juventus sin perder en sus últimos 4 partidos en casa"
      ],
      recommendation: "Menos de 2.5 goles + Empate o Victoria Visitante",
      confidence: "Media",
      isPremium: true,
    },
  },
  {
    id: "6",
    homeTeam: "Bayern Múnich",
    awayTeam: "PSG",
    homeLogo: "https://api.dicebear.com/7.x/initials/svg?seed=BAY&backgroundColor=dc2626&textColor=ffffff",
    awayLogo: "https://api.dicebear.com/7.x/initials/svg?seed=PSG&backgroundColor=1e3a5f&textColor=ffffff",
    date: "2025-05-13",
    time: "21:00",
    league: "Champions League",
    leagueFlag: "🏆",
    insight: {
      homeWin: 48,
      draw: 19,
      awayWin: 33,
      analysis: "Semifinal de Champions League con máxima tensión. Bayern en casa con el Allianz Arena como ventaja histórica. PSG con Mbappé ausente (lesión en el PSG... espera, ahora en Real Madrid). El equipo galo presenta dudas defensivas que Bayern puede explotar.",
      keyFactors: [
        "Bayern con 89% de victorias en semis de CL en casa",
        "PSG eliminó al Barça en cuartos pero con muchos apuros",
        "Kane en racha con 5 goles en Champions esta edición",
        "PSG encajó en los últimos 4 partidos europeos",
        "Ambiente brutal en el Allianz Arena, factor clave"
      ],
      recommendation: "Victoria Local con +1.5 goles",
      confidence: "Alta",
      isPremium: true,
    },
  },
];
