/** Shared football-data.org v4 helpers for /api/matches and /api/scores */

export const FOOTBALL_DATA_BASE = "https://api.football-data.org/v4";

/** Read and normalize FOOTBALL_API_KEY from env (trim, strip accidental quotes). */
export function getFootballApiKey(): string | undefined {
  const raw = process.env.FOOTBALL_API_KEY;
  if (!raw || raw.includes("REPLACE")) return undefined;
  const key = raw.trim().replace(/^['"]|['"]$/g, "");
  return key.length > 0 ? key : undefined;
}

export const FOOTBALL_COMPETITIONS = [
  { code: "PL", league: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "PD", league: "La Liga", flag: "🇪🇸" },
  { code: "SA", league: "Serie A", flag: "🇮🇹" },
  { code: "CL", league: "Champions League", flag: "🏆" },
] as const;

const CODE_TO_META = Object.fromEntries(
  FOOTBALL_COMPETITIONS.map((c) => [c.code, c])
) as Record<string, { league: string; flag: string }>;

export function mapFootballStatus(s: string): "scheduled" | "live" | "finished" {
  if (["IN_PLAY", "PAUSED", "HALFTIME", "LIVE"].includes(s)) return "live";
  if (["FINISHED", "AWARDED"].includes(s)) return "finished";
  return "scheduled";
}

export type MappedMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamFull: string;
  awayTeamFull: string;
  homeCrest: string;
  awayCrest: string;
  dateISO: string;
  status: "scheduled" | "live" | "finished";
  minute: number | null;
  homeScore: number | null;
  awayScore: number | null;
  league: string;
  leagueFlag: string;
  venue: string;
  matchday: number | null;
  stage: string;
  competitionCode?: string;
};

export function mapFootballMatch(
  m: Record<string, unknown>,
  league: string,
  leagueFlag: string,
  competitionCode?: string
): MappedMatch | null {
  const home = m.homeTeam as Record<string, unknown> | undefined;
  const away = m.awayTeam as Record<string, unknown> | undefined;
  const homeName = String(home?.shortName || home?.name || "").trim();
  const awayName = String(away?.shortName || away?.name || "").trim();
  if (!homeName || !awayName) return null;

  const score = m.score as Record<string, unknown> | undefined;
  const ft = score?.fullTime as Record<string, number | null> | undefined;
  const ht = score?.halfTime as Record<string, number | null> | undefined;

  return {
    id: String(m.id),
    homeTeam: homeName,
    awayTeam: awayName,
    homeTeamFull: String(home?.name || homeName),
    awayTeamFull: String(away?.name || awayName),
    homeCrest: String(home?.crest || ""),
    awayCrest: String(away?.crest || ""),
    dateISO: String(m.utcDate || ""),
    status: mapFootballStatus(String(m.status || "")),
    minute: (m.minute as number | null) ?? null,
    homeScore: ft?.home ?? ht?.home ?? null,
    awayScore: ft?.away ?? ht?.away ?? null,
    league,
    leagueFlag,
    venue: String((m.venue as string) || ""),
    matchday: (m.matchday as number | null) ?? null,
    stage: String(m.stage || ""),
    competitionCode,
  };
}

export function leagueMetaFromMatchRow(m: Record<string, unknown>): {
  league: string;
  flag: string;
  code: string;
} {
  const comp = m.competition as Record<string, unknown> | undefined;
  const code = String(comp?.code || "");
  const meta = CODE_TO_META[code];
  if (meta) return { ...meta, code };
  return {
    league: String(comp?.name || "Competition"),
    flag: "⚽",
    code,
  };
}

export function sortMatches(matches: MappedMatch[]): MappedMatch[] {
  const order = { live: 0, scheduled: 1, finished: 2 };
  return [...matches].sort((a, b) => {
    const sa = order[a.status] ?? 1;
    const sb = order[b.status] ?? 1;
    if (sa !== sb) return sa - sb;
    return a.dateISO < b.dateISO ? -1 : 1;
  });
}

export function dateRangeWindow(daysBack = 7, daysForward = 14): {
  dateFrom: string;
  dateTo: string;
} {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - daysBack);
  const to = new Date(today);
  to.setDate(to.getDate() + daysForward);
  return {
    dateFrom: from.toISOString().split("T")[0],
    dateTo: to.toISOString().split("T")[0],
  };
}

export async function readFootballDataError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    const msg = (body as { message?: string }).message;
    if (msg) return msg;
  } catch {
    /* ignore */
  }
  return res.statusText || `HTTP ${res.status}`;
}
