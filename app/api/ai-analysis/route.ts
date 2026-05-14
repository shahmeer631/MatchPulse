import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_KEY || ANTHROPIC_KEY.includes("REPLACE")) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured in .env.local" },
      { status: 503 }
    );
  }

  const { match } = await req.json();
  if (!match?.homeTeam || !match?.awayTeam) {
    return NextResponse.json({ error: "Invalid match data" }, { status: 400 });
  }

  const prompt = `Eres un analista experto de apuestas deportivas con acceso a estadísticas avanzadas. 
Genera un análisis completo en ESPAÑOL para el siguiente partido de fútbol.

PARTIDO: ${match.homeTeam} vs ${match.awayTeam}
LIGA: ${match.league}
FECHA UTC: ${match.dateISO}
ESTADO: ${match.status}
${match.homeScore != null ? `MARCADOR ACTUAL: ${match.homeScore}-${match.awayScore}` : ""}
${match.venue ? `ESTADIO: ${match.venue}` : ""}

Responde EXCLUSIVAMENTE con un objeto JSON válido (sin markdown, sin explicaciones, solo JSON puro):
{
  "homeWin": <número 0-100 sin símbolo %>,
  "draw": <número 0-100>,
  "awayWin": <número 0-100>,
  "analysis": "<análisis principal de 3-4 oraciones, forma reciente, factores clave del partido>",
  "tacticalBreakdown": "<análisis táctico de 2-3 oraciones, formaciones esperadas, duelos clave>",
  "contextAnalysis": "<contexto del partido: importancia clasificatoria, motivación, presión>",
  "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>", "<factor 4>", "<factor 5>"],
  "recommendation": "<apuesta recomendada, ej: Victoria Local (1), Empate (X), BTTS>",
  "confidence": "<Alta|Media|Baja>",
  "riskLevel": "<Bajo|Medio|Alto>",
  "predictedScore": "<ej: 2-1>",
  "predictedGoals": <número decimal ej: 2.4>,
  "primaryBet": "<apuesta principal>",
  "primaryRationale": "<razón en 1 oración>",
  "secondaryBet": "<apuesta secundaria>",
  "secondaryRationale": "<razón en 1 oración>",
  "avoidBet": "<qué evitar apostar>",
  "avoidRationale": "<razón en 1 oración>",
  "valueRating": <número 1-5>,
  "homeFormation": "<ej: 4-3-3>",
  "awayFormation": "<ej: 4-2-3-1>",
  "keyBattle": "<duelo táctico principal>",
  "homeOdds": <número decimal ej: 1.85>,
  "drawOdds": <número decimal ej: 3.50>,
  "awayOdds": <número decimal ej: 4.20>,
  "over25Odds": <número decimal ej: 1.75>,
  "bttsOdds": <número decimal ej: 1.80>,
  "asianHandicap": "<ej: -0.5 Local>",
  "valuebet": "<apuesta de valor destacada con cuota aproximada>"
}

IMPORTANTE: Los tres valores homeWin + draw + awayWin deben sumar exactamente 100.
Basa el análisis en el conocimiento real de estos equipos, su forma histórica y el contexto de esta competición.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":         "application/json",
        "x-api-key":            ANTHROPIC_KEY,
        "anthropic-version":    "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-opus-4-5",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error ${res.status}: ${err}`);
    }

    const data    = await res.json();
    const content = data.content?.[0]?.text || "";

    // Strip any markdown code fences if present
    const clean = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Normalise probabilities to sum to 100
    const total = (parsed.homeWin || 0) + (parsed.draw || 0) + (parsed.awayWin || 0);
    if (total > 0 && Math.abs(total - 100) > 1) {
      const factor = 100 / total;
      parsed.homeWin = Math.round(parsed.homeWin * factor);
      parsed.draw    = Math.round(parsed.draw    * factor);
      parsed.awayWin = 100 - parsed.homeWin - parsed.draw;
    }

    return NextResponse.json({ success: true, analysis: parsed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI error";
    console.error("AI analysis error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
