import { NextResponse } from "next/server";

// Free API: https://www.football-data.org/ (get free key, 10 calls/min)
// Competitions: PL=39, PD=140, SA=135, CL=2021
const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = "https://api.football-data.org/v4";

function getMockScores(source: "mock" | "error", reason?: string) {
  return NextResponse.json({
    source,
    reason,
    lastUpdated: new Date().toISOString(),
    matches: [
      { id: "1", homeScore: null, awayScore: null, status: "scheduled", minute: null },
      { id: "2", homeScore: null, awayScore: null, status: "scheduled", minute: null },
      { id: "3", homeScore: null, awayScore: null, status: "scheduled", minute: null },
      { id: "4", homeScore: null, awayScore: null, status: "scheduled", minute: null },
      { id: "5", homeScore: null, awayScore: null, status: "scheduled", minute: null },
      { id: "6", homeScore: null, awayScore: null, status: "scheduled", minute: null },
    ],
  });
}

export async function GET() {
  const sanitizedApiKey = API_KEY?.replace(/\s+/g, "").trim();

  // If no API key configured, return mock live data
  if (!sanitizedApiKey || sanitizedApiKey.includes("REPLACE")) {
    return getMockScores("mock", "missing_api_key");
  }

  try {
    // Fetch today's matches from top competitions
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `${BASE_URL}/matches?dateFrom=${today}&dateTo=${today}&competitions=PL,PD,SA,CL`,
      {
        headers: { "X-Auth-Token": sanitizedApiKey },
        next: { revalidate: 60 }, // cache 60 seconds
      }
    );

    if (!res.ok) {
      const rawBody = await res.text();
      console.error("Scores upstream API error:", res.status, rawBody);
      return getMockScores("error", `upstream_${res.status}`);
    }
    const data = await res.json();

    // Map to our format
    const matches = (data.matches || []).map((m: Record<string, unknown>) => {
      const score = m.score as Record<string, unknown>;
      const fullTime = score?.fullTime as Record<string, number | null>;
      const currentPeriod = score?.currentPeriod as Record<string, number | null>;
      return {
        apiId: m.id,
        homeScore: fullTime?.home ?? currentPeriod?.home ?? null,
        awayScore: fullTime?.away ?? currentPeriod?.away ?? null,
        status: String(m.status).toLowerCase(),
        minute: m.minute ?? null,
      };
    });

    return NextResponse.json({
      source: "live",
      lastUpdated: new Date().toISOString(),
      matches,
    });
  } catch (err) {
    console.error("Scores API error:", err);
    return getMockScores("error", "request_failed");
  }
}
