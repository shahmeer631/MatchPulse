import type { Match, Insight, League } from "@/data/matches";
import type { MappedMatch } from "@/lib/footballData";

const LEAGUES: League[] = ["La Liga", "Premier League", "Serie A", "Champions League"];

function asLeague(name: string): League {
  return LEAGUES.includes(name as League) ? (name as League) : "La Liga";
}

function emptyTeamStats() {
  return {
    form: "—",
    goalsScored: 0,
    goalsConceded: 0,
    possession: 0,
    xG: 0,
    xGA: 0,
    shots: 0,
    shotsOnTarget: 0,
    pressureIndex: 0,
    cleanSheets: 0,
    corners: 0,
  };
}

function placeholderInsight(isPremium: boolean, home: string, away: string): Insight {
  return {
    homeWin: 34,
    draw: 33,
    awayWin: 33,
    analysis: isPremium
      ? `Análisis IA completo para ${home} vs ${away}. Desbloquea Premium o abre la ficha en Partidos para generarlo al instante.`
      : `Partido en vivo desde football-data.org. Abre «Partidos» y pulsa «Ver análisis IA» para generar el informe completo con Claude.`,
    tacticalBreakdown: "Disponible tras generar el análisis IA en la página de partidos.",
    contextAnalysis: "Datos de calendario y marcador en tiempo real vía API.",
    keyFactors: [
      "Datos de equipos y horario actualizados desde la API",
      "Marcador en directo cuando el partido está en juego",
      "Análisis IA bajo demanda en /matches",
    ],
    teamStats: { home: emptyTeamStats(), away: emptyTeamStats() },
    headToHead: {
      played: 0,
      homeWins: 0,
      draws: 0,
      awayWins: 0,
      avgGoals: 0,
      lastResults: [],
      bttsRate: 0,
      over25Rate: 0,
    },
    marketData: {
      homeOdds: 0,
      drawOdds: 0,
      awayOdds: 0,
      over25Odds: 0,
      bttsOdds: 0,
      asianHandicap: "—",
    },
    tactical: {
      homeFormation: "—",
      awayFormation: "—",
      keyBattle: "—",
      pressureZone: "—",
      setpieces: "—",
      tempo: "—",
    },
    playerAlerts: [],
    bettingAngles: {
      primaryBet: "—",
      primaryRationale: "Genera el análisis en /matches",
      secondaryBet: "—",
      secondaryRationale: "—",
      avoidBet: "—",
      avoidRationale: "—",
      valueRating: 0,
    },
    recommendation: "Ver análisis en Partidos",
    confidence: "Media",
    riskLevel: "Medio",
    isPremium,
    predictedScore: "—",
    predictedGoals: 0,
  };
}

/** Map football-data row → homepage `MatchCard` shape (placeholder insight until user opens /matches). */
export function mapApiRowToMatch(
  row: MappedMatch,
  options: { isFirstFree?: boolean } = {}
): Match {
  const isPremiumInsight = !options.isFirstFree;

  return {
    id: row.id,
    homeTeam: row.homeTeam,
    awayTeam: row.awayTeam,
    homeScore: row.homeScore ?? undefined,
    awayScore: row.awayScore ?? undefined,
    dateISO: row.dateISO,
    league: asLeague(row.league),
    leagueFlag: row.leagueFlag,
    status: row.status,
    minute: row.minute ?? undefined,
    venue: row.venue,
    insight: placeholderInsight(isPremiumInsight, row.homeTeam, row.awayTeam),
  };
}

export function pickFeaturedApiMatches(rows: MappedMatch[], limit = 3): MappedMatch[] {
  const order = { live: 0, scheduled: 1, finished: 2 };
  const sorted = [...rows].sort((a, b) => {
    const sa = order[a.status] ?? 1;
    const sb = order[b.status] ?? 1;
    if (sa !== sb) return sa - sb;
    return a.dateISO < b.dateISO ? -1 : 1;
  });
  return sorted.slice(0, limit);
}
