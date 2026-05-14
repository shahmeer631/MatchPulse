import { NextResponse } from "next/server";

const API_KEY  = process.env.FOOTBALL_API_KEY;
const BASE_URL = "https://api.football-data.org/v4";

const COMPETITIONS = [
  { id: "PD", league: "La Liga",          flag: "🇪🇸" },
  { id: "PL", league: "Premier League",   flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "SA", league: "Serie A",          flag: "🇮🇹" },
  { id: "CL", league: "Champions League", flag: "🏆" },
];

function mapStatus(s: string): "scheduled" | "live" | "finished" {
  if (["IN_PLAY", "PAUSED", "HALFTIME"].includes(s)) return "live";
  if (["FINISHED", "AWARDED"].includes(s))           return "finished";
  return "scheduled";
}

export async function GET() {
  if (!API_KEY || API_KEY.includes("REPLACE")) {
    return NextResponse.json({
      source: "no_key",
      error:  "FOOTBALL_API_KEY not set in .env.local",
      setup:  "Register free at https://www.football-data.org/register",
      matches: [],
    }, { status: 503 });
  }

  const today = new Date();
  const from  = new Date(today); from.setDate(from.getDate() - 1);
  const to    = new Date(today); to.setDate(to.getDate()   + 3);
  const dateFrom = from.toISOString().split("T")[0];
  const dateTo   = to.toISOString().split("T")[0];

  const results: Record<string, unknown>[] = [];

  for (const comp of COMPETITIONS) {
    try {
      const res = await fetch(
        `${BASE_URL}/competitions/${comp.id}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        {
          headers: { "X-Auth-Token": API_KEY },
          next: { revalidate: 55 },
        }
      );
      if (!res.ok) continue;

      const data = await res.json();
      for (const m of (data.matches || []) as Record<string, unknown>[]) {
        const score    = m.score    as Record<string, unknown>;
        const ft       = score?.fullTime as Record<string, number | null>;
        const ht       = score?.halfTime as Record<string, number | null>;
        const home     = m.homeTeam as Record<string, unknown>;
        const away     = m.awayTeam as Record<string, unknown>;

        results.push({
          id:            String(m.id),
          homeTeam:      String(home?.shortName || home?.name || ""),
          awayTeam:      String(away?.shortName || away?.name || ""),
          homeTeamFull:  String(home?.name || ""),
          awayTeamFull:  String(away?.name || ""),
          homeCrest:     String(home?.crest || ""),
          awayCrest:     String(away?.crest || ""),
          dateISO:       String(m.utcDate || ""),
          status:        mapStatus(String(m.status || "")),
          minute:        (m.minute as number | null) ?? null,
          homeScore:     ft?.home ?? ht?.home ?? null,
          awayScore:     ft?.away ?? ht?.away ?? null,
          league:        comp.league,
          leagueFlag:    comp.flag,
          venue:         String((m.venue as string) || ""),
          matchday:      (m.matchday as number | null) ?? null,
          stage:         String(m.stage || ""),
        });
      }
    } catch (err) {
      console.error(`Error fetching ${comp.id}:`, err);
    }
  }

  // Sort: live first, then by date
  results.sort((a, b) => {
    const order = { live: 0, scheduled: 1, finished: 2 };
    const sa = order[(a.status as keyof typeof order)] ?? 1;
    const sb = order[(b.status as keyof typeof order)] ?? 1;
    if (sa !== sb) return sa - sb;
    return String(a.dateISO) < String(b.dateISO) ? -1 : 1;
  });

  return NextResponse.json({
    source:      "live",
    lastUpdated: new Date().toISOString(),
    count:       results.length,
    matches:     results,
  });
}
