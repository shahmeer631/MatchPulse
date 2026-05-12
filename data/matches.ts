export type League = "La Liga" | "Premier League" | "Serie A" | "Champions League";
export type MatchStatus = "scheduled" | "live" | "finished";

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
  homeScore?: number;
  awayScore?: number;
  dateISO: string;       // ISO 8601 UTC — client converts to local timezone
  league: League;
  leagueFlag: string;
  status: MatchStatus;
  minute?: number;       // if live
  insight: Insight;
}

// All times in UTC — the UI converts to user local timezone via Intl API
export const matches: Match[] = [
  {
    id: "1",
    homeTeam: "Real Madrid",
    awayTeam: "FC Barcelona",
    dateISO: "2025-05-10T19:00:00Z", // 21:00 CET (Spain)
    league: "La Liga",
    leagueFlag: "🇪🇸",
    status: "scheduled",
    insight: {
      homeWin: 42,
      draw: 24,
      awayWin: 34,
      analysis: "El Clásico llega en un momento decisivo de la temporada. Real Madrid parte como favorito local con Vinícius Jr. en una racha goleadora excepcional (7 goles en los últimos 5 partidos). Barcelona confirma la baja de Pedri por lesión muscular, lo que debilita considerablemente su control del centro del campo. Históricamente, Real Madrid gana el 58% de los Clásicos disputados en el Bernabéu.",
      keyFactors: [
        "Vinícius Jr. en racha goleadora — 7 goles en 5 partidos",
        "Pedri baja confirmada — centro del campo barcelonista mermado",
        "Real Madrid invicto en casa en la última temporada (14V 2E)",
        "Barça encajó en sus últimos 4 desplazamientos de alto nivel",
        "Real Madrid ganó 3 de los últimos 4 Clásicos en el Bernabéu"
      ],
      recommendation: "Victoria Local o Empate (1X)",
      confidence: "Alta",
      isPremium: false,
    },
  },
  {
    id: "2",
    homeTeam: "Atlético de Madrid",
    awayTeam: "Sevilla FC",
    dateISO: "2025-05-10T16:30:00Z", // 18:30 CET
    league: "La Liga",
    leagueFlag: "🇪🇸",
    status: "scheduled",
    insight: {
      homeWin: 55,
      draw: 22,
      awayWin: 23,
      analysis: "Atlético de Madrid llega líder con la necesidad de sumar para mantener la ventaja en la clasificación. Sevilla atraviesa un bache de forma preocupante: sin ganar en sus últimos 6 desplazamientos y con problemas defensivos evidentes. Simeone tiene un historial dominante frente a equipos en descenso de forma en el Metropolitano.",
      keyFactors: [
        "Atlético: 8 partidos sin perder como local esta temporada",
        "Sevilla sin ganar fuera en sus últimos 6 desplazamientos",
        "Morata recuperado al 100% de su lesión muscular",
        "Sevilla encaja media de 2.1 goles/partido como visitante",
        "Simeone: 78% de victorias vs equipos de la mitad baja en casa"
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
    dateISO: "2025-05-11T15:30:00Z", // 16:30 CET (UK = UTC+1)
    league: "Premier League",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    status: "scheduled",
    insight: {
      homeWin: 47,
      draw: 26,
      awayWin: 27,
      analysis: "Duelo de candidatos al título en el Etihad. Erling Haaland está plenamente recuperado y promedia 1.8 goles por partido como local. Arsenal llega en buena dinámica pero históricamente sufre en este estadio: sin ganar en el Etihad en los últimos 5 años. Partido con alta expectativa de goles dados los estilos ofensivos de ambos equipos.",
      keyFactors: [
        "Haaland recuperado — 1.8 goles promedio en casa",
        "Arsenal sin ganar en el Etihad en los últimos 5 años",
        "Promedio de +3.1 goles en los últimos 6 enfrentamientos directos",
        "City presiona alto — Arsenal vulnerable al juego directo en transición",
        "Ambos equipos necesitan puntuar para aspirar al título"
      ],
      recommendation: "Victoria Local + Más de 2.5 goles",
      confidence: "Media",
      isPremium: true,
    },
  },
  {
    id: "4",
    homeTeam: "Liverpool",
    awayTeam: "Chelsea",
    dateISO: "2025-05-11T12:00:00Z", // 13:00 CET
    league: "Premier League",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    status: "scheduled",
    insight: {
      homeWin: 52,
      draw: 21,
      awayWin: 27,
      analysis: "Anfield como fortaleza inquebrantable. Liverpool permanece invicto en casa esta temporada con 14 victorias consecutivas. Mo Salah encabeza la tabla de goleadores de la Premier con 24 tantos. Chelsea continúa en proceso de reconstrucción bajo su nuevo cuerpo técnico, con una defensa que encaja en el 80% de sus desplazamientos.",
      keyFactors: [
        "Liverpool: 14 victorias consecutivas como local esta temporada",
        "Salah: máximo goleador Premier con 24 goles en la temporada",
        "Chelsea encaja en el 80% de sus desplazamientos fuera",
        "Sistema táctico nuevo de Chelsea aún en fase de consolidación",
        "La presión de Anfield es un factor psicológico determinante"
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
    dateISO: "2025-05-12T18:45:00Z", // 20:45 CET
    league: "Serie A",
    leagueFlag: "🇮🇹",
    status: "scheduled",
    insight: {
      homeWin: 33,
      draw: 30,
      awayWin: 37,
      analysis: "El Derby d'Italia es siempre el partido más impredecible de la Serie A. Inter llega como campeón defensor y en mejor racha de forma. Juventus en casa pero sin convincente rendimiento reciente. El análisis histórico apunta a un partido muy táctico con escasos goles: el 65% de estos enfrentamientos terminó con Under 2.5 en la última década.",
      keyFactors: [
        "Inter ganó los últimos 3 enfrentamientos directos",
        "Juventus: solo 50% de victorias como local esta temporada",
        "Duván Zapata baja confirmada para Inter por lesión",
        "65% de los últimos Derby d'Italia terminó con menos de 2.5 goles",
        "Juventus lleva 4 partidos en casa sin perder (3E 1V)"
      ],
      recommendation: "Menos de 2.5 goles (Under)",
      confidence: "Media",
      isPremium: true,
    },
  },
  {
    id: "6",
    homeTeam: "Bayern de Múnich",
    awayTeam: "PSG",
    dateISO: "2025-05-13T19:00:00Z", // 21:00 CET
    league: "Champions League",
    leagueFlag: "🏆",
    status: "scheduled",
    insight: {
      homeWin: 48,
      draw: 19,
      awayWin: 33,
      analysis: "Semifinal de la UEFA Champions League en el Allianz Arena. Bayern de Múnich cuenta con el factor local en un estadio que se convierte en una trampa para los visitantes en noches europeas. Harry Kane lleva 5 goles en la Champions esta edición y llega en un estado de forma óptimo. PSG eliminó al Barça en cuartos pero mostró vulnerabilidades defensivas que Bayern puede explotar con presión alta.",
      keyFactors: [
        "Bayern: 89% de pases a semifinales de CL como local en su historia",
        "Kane: 5 goles en Champions esta edición, en racha goleadora",
        "PSG encajó en sus últimos 4 partidos europeos como visitante",
        "Allianz Arena — ambiente de 75.000 espectadores, factor clave",
        "PSG mostró debilidades defensivas ante presión alta en cuartos"
      ],
      recommendation: "Victoria Local con Ambos equipos marcan",
      confidence: "Alta",
      isPremium: true,
    },
  },
];
