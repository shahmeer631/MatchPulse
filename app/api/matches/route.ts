import { NextResponse } from "next/server";
import {
  FOOTBALL_COMPETITIONS,
  FOOTBALL_DATA_BASE,
  dateRangeWindow,
  mapFootballMatch,
  leagueMetaFromMatchRow,
  readFootballDataError,
  getFootballApiKey,
  sortMatches,
  type MappedMatch,
} from "@/lib/footballData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type FetchIssue = { source: string; status: number; message: string };

async function fetchJson(
  url: string,
  apiKey: string
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; issue: FetchIssue }> {
  try {
    const res = await fetch(url, {
      headers: { "X-Auth-Token": apiKey },
      cache: "no-store",
    });
    if (!res.ok) {
      const message = await readFootballDataError(res);
      return {
        ok: false,
        issue: { source: url.replace(FOOTBALL_DATA_BASE, ""), status: res.status, message },
      };
    }
    const data = (await res.json()) as Record<string, unknown>;
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return {
      ok: false,
      issue: { source: url.replace(FOOTBALL_DATA_BASE, ""), status: 0, message },
    };
  }
}

function parseMatchesFromPayload(
  data: Record<string, unknown>,
  defaultLeague?: string,
  defaultFlag?: string,
  competitionCode?: string
): MappedMatch[] {
  const rows = (data.matches || []) as Record<string, unknown>[];
  const out: MappedMatch[] = [];
  for (const m of rows) {
    const meta = defaultLeague
      ? { league: defaultLeague, flag: defaultFlag || "⚽" }
      : leagueMetaFromMatchRow(m);
    const mapped = mapFootballMatch(
      m,
      meta.league,
      meta.flag,
      competitionCode || ("code" in meta ? meta.code : undefined)
    );
    if (mapped) out.push(mapped);
  }
  return out;
}

/** One request — best for rate limits (free tier: 10/min). */
async function fetchAggregated(
  apiKey: string,
  dateFrom: string,
  dateTo: string
): Promise<{ matches: MappedMatch[]; issue?: FetchIssue }> {
  const codes = FOOTBALL_COMPETITIONS.map((c) => c.code).join(",");
  const url = `${FOOTBALL_DATA_BASE}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&competitions=${codes}`;
  const result = await fetchJson(url, apiKey);
  if (!result.ok) return { matches: [], issue: result.issue };
  return { matches: parseMatchesFromPayload(result.data) };
}

/** Per-league fallback if aggregated call fails or returns empty. */
async function fetchPerCompetition(
  apiKey: string,
  dateFrom: string,
  dateTo: string
): Promise<{ matches: MappedMatch[]; issues: FetchIssue[] }> {
  const byId = new Map<string, MappedMatch>();
  const issues: FetchIssue[] = [];

  for (const comp of FOOTBALL_COMPETITIONS) {
    const url = `${FOOTBALL_DATA_BASE}/competitions/${comp.code}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const result = await fetchJson(url, apiKey);
    if (!result.ok) {
      issues.push(result.issue);
      continue;
    }
    for (const m of parseMatchesFromPayload(result.data, comp.league, comp.flag, comp.code)) {
      byId.set(m.id, m);
    }
  }

  return { matches: [...byId.values()], issues };
}

export async function GET() {
  const API_KEY = getFootballApiKey();

  if (!API_KEY) {
    return NextResponse.json(
      {
        source: "no_key",
        error: "FOOTBALL_API_KEY not set. Add it to .env.local (local) or Vercel Environment Variables (production), then restart the server.",
        setup: "https://www.football-data.org/register",
        matches: [],
      },
      { status: 503 }
    );
  }

  const { dateFrom, dateTo } = dateRangeWindow(7, 14);
  const issues: FetchIssue[] = [];
  let matches: MappedMatch[] = [];
  let fetchMode: "aggregated" | "per_competition" | "none" = "none";

  const aggregated = await fetchAggregated(API_KEY, dateFrom, dateTo);
  if (aggregated.issue) issues.push(aggregated.issue);

  if (aggregated.matches.length > 0) {
    matches = aggregated.matches;
    fetchMode = "aggregated";
  } else {
    const fallback = await fetchPerCompetition(API_KEY, dateFrom, dateTo);
    issues.push(...fallback.issues);
    matches = fallback.matches;
    fetchMode = "per_competition";
  }

  const deduped = [...new Map(matches.map((m) => [m.id, m])).values()];
  const sorted = sortMatches(deduped);

  const invalidToken = issues.some(
    (i) =>
      i.status === 400 &&
      /invalid|token/i.test(i.message)
  );
  const authFailed = issues.some((i) => i.status === 401 || i.status === 403);

  if (sorted.length === 0 && (invalidToken || authFailed)) {
    return NextResponse.json(
      {
        source: "error",
        error: invalidToken
          ? "FOOTBALL_API_KEY is invalid. Log in at football-data.org → Account → API token, copy the token only (not email/password), paste in .env.local as FOOTBALL_API_KEY=your_token with no quotes, then restart npm run dev."
          : "Invalid or unauthorized FOOTBALL_API_KEY. Create a new key at football-data.org and ensure it is copied without spaces.",
        matches: [],
        dateFrom,
        dateTo,
        issues,
      },
      { status: invalidToken ? 400 : 401 }
    );
  }

  if (sorted.length === 0 && issues.length > 0 && issues.every((i) => i.status >= 400 || i.status === 0)) {
    return NextResponse.json(
      {
        source: "error",
        error: "football-data.org returned no matches and all requests failed. See issues for details.",
        matches: [],
        dateFrom,
        dateTo,
        fetchMode,
        issues,
      },
      { status: 502 }
    );
  }

  const warnings: string[] = [];
  if (sorted.length === 0) {
    warnings.push(
      `No fixtures between ${dateFrom} and ${dateTo} for PL, PD, SA, CL (off-season or international break). Data will appear when matches are scheduled.`
    );
  }
  if (issues.length > 0 && sorted.length > 0) {
    warnings.push("Some competition requests failed; showing partial results.");
  }

  return NextResponse.json({
    source: "live",
    lastUpdated: new Date().toISOString(),
    count: sorted.length,
    matches: sorted,
    dateFrom,
    dateTo,
    fetchMode,
    issues: issues.length ? issues : undefined,
    warnings: warnings.length ? warnings : undefined,
  });
}
