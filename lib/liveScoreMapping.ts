import { matches as staticMatches } from "@/data/matches";

/** Normalize for fuzzy team name comparison (API vs display names). */
export function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function significantWords(normalized: string): string[] {
  const stop = new Set([
    "fc", "cf", "ac", "sc", "club", "de", "the", "fk", "sv", "afc", "bc",
  ]);
  return normalized
    .split(" ")
    .filter((w) => w.length > 2 && !stop.has(w));
}

/** Match football-data team label to our static `homeTeam` / `awayTeam` strings. */
export function teamsRoughMatch(apiName: string, ourName: string): boolean {
  const a = normalizeTeamName(apiName);
  const o = normalizeTeamName(ourName);
  if (!a.length || !o.length) return false;
  if (a === o) return true;
  if (a.includes(o) || o.includes(a)) return true;

  const ours = significantWords(o);
  const apis = significantWords(a);
  if (!ours.length || !apis.length) return false;

  const hits = ours.filter((w) => a.includes(w)).length;
  return hits >= Math.ceil(ours.length * 0.5) || ours.some((w) => w.length >= 5 && a.includes(w));
}

/** Resolve football-data match row to our internal match `id`, or null. */
export function matchApiTeamsToStaticId(apiHome: string, apiAway: string): string | null {
  for (const m of staticMatches) {
    if (teamsRoughMatch(apiHome, m.homeTeam) && teamsRoughMatch(apiAway, m.awayTeam)) {
      return m.id;
    }
  }
  return null;
}

/** Map football-data status string to our MatchStatus. */
export function mapLiveStatus(status: string): "scheduled" | "live" | "finished" {
  const u = status.toUpperCase();
  if (u === "IN_PLAY" || u === "LIVE" || u === "PAUSED") return "live";
  if (u === "FINISHED" || u === "AWARDED") return "finished";
  return "scheduled";
}
