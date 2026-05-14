export type League = "La Liga" | "Premier League" | "Serie A" | "Champions League";
export type MatchStatus = "scheduled" | "live" | "finished";
export type Confidence = "Alta" | "Media" | "Baja";

// ── Deep stats object ──────────────────────────────────────────────────────
export interface TeamStats {
  form: string;               // e.g. "VVEVD" last 5
  goalsScored: number;        // avg per game this season
  goalsConceded: number;      // avg per game this season
  possession: number;         // avg % this season
  xG: number;                 // expected goals per game
  xGA: number;                // expected goals against per game
  shots: number;              // avg shots per game
  shotsOnTarget: number;      // avg on target per game
  pressureIndex: number;      // 0–100, high press intensity
  cleanSheets: number;        // this season
  corners: number;            // avg per game
}

export interface HeadToHead {
  played: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  avgGoals: number;
  lastResults: string[];      // e.g. ["2-1", "0-0", "3-1"] home perspective
  bttsRate: number;           // both teams to score %
  over25Rate: number;         // over 2.5 goals %
}

export interface MarketData {
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  over25Odds: number;
  bttsOdds: number;
  asianHandicap: string;      // e.g. "-0.5 Local"
  valuebet?: string;          // highlighted value bet if any
}

export interface TacticalAnalysis {
  homeFormation: string;      // e.g. "4-3-3"
  awayFormation: string;
  keyBattle: string;          // main tactical duel
  pressureZone: string;       // where the match will be decided
  setpieces: string;          // set piece danger assessment
  tempo: string;              // expected match tempo
}

export interface PlayerAlert {
  name: string;
  team: "home" | "away";
  type: "goleador" | "asistente" | "baja" | "sancionado" | "regreso" | "racha";
  detail: string;
}

export interface BettingAngles {
  primaryBet: string;
  primaryRationale: string;
  secondaryBet: string;
  secondaryRationale: string;
  avoidBet: string;
  avoidRationale: string;
  valueRating: number;        // 1–5 stars
}

export interface Insight {
  // Core probabilities
  homeWin: number;
  draw: number;
  awayWin: number;

  // Deep analysis narrative (multi-paragraph)
  analysis: string;
  tacticalBreakdown: string;
  contextAnalysis: string;    // stakes, motivation, context

  // Structured data
  keyFactors: string[];
  teamStats: { home: TeamStats; away: TeamStats };
  headToHead: HeadToHead;
  marketData: MarketData;
  tactical: TacticalAnalysis;
  playerAlerts: PlayerAlert[];
  bettingAngles: BettingAngles;

  // Summary
  recommendation: string;
  confidence: Confidence;
  riskLevel: "Bajo" | "Medio" | "Alto";
  isPremium: boolean;

  // Score prediction
  predictedScore: string;     // e.g. "2-1"
  predictedGoals: number;     // decimal e.g. 2.4
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  dateISO: string;
  league: League;
  leagueFlag: string;
  status: MatchStatus;
  minute?: number;
  venue: string;
  referee?: string;
  insight: Insight;
}

// ══════════════════════════════════════════════════════════════════════════════
// MATCH DATA
// ══════════════════════════════════════════════════════════════════════════════
export const matches: Match[] = [

  // ── 1. EL CLÁSICO ────────────────────────────────────────────────────────
  {
    id: "1",
    homeTeam: "Real Madrid",
    awayTeam: "FC Barcelona",
    dateISO: "2025-05-10T19:00:00Z",
    league: "La Liga",
    leagueFlag: "🇪🇸",
    status: "scheduled",
    venue: "Estadio Santiago Bernabéu, Madrid",
    referee: "Alejandro Hernández Hernández",
    insight: {
      homeWin: 42,
      draw: 24,
      awayWin: 34,

      analysis: `El Clásico de la jornada 35 llega con una diferencia de 2 puntos en la tabla, convirtiendo este encuentro en una final anticipada. Real Madrid llega como local con el impulso de una racha de 8 partidos invictos y con Vinícius Jr. en su mejor momento de la temporada. El brasileño ha marcado en sus últimos 5 partidos consecutivos, algo que no conseguía desde su primera temporada en el club.

El gran interrogante para el Barça es cómo plantear el partido sin Pedri, su metronomo en el centro del campo. La baja del internacional español no es solo táctica sino también psicológica — los de Flick han perdido sus últimos 3 partidos sin él. Gavi intentará asumir mayor responsabilidad, pero su rendimiento defensivo frente a la presión alta del Madrid puede ser explotado.

Desde el punto de vista estadístico, los datos de los últimos 10 Clásicos en el Bernabéu favorecen al Madrid: 6V-2E-2D. Sin embargo, el xG acumulado en esos partidos es prácticamente idéntico (18.4 Real Madrid vs 17.9 Barcelona), lo que indica que los resultados han favorecido al local más de lo que el juego real ha dictado. En esta ocasión, el contexto de clasificación añade presión extrema a ambos equipos.`,

      tacticalBreakdown: `Real Madrid previsiblemente saldrá con su 4-3-3 asimétrico donde Vinícius actúa como extremo izquierdo con libertad de movimiento hacia el interior. La clave táctica es el duelo entre Tchouaméni como pivote defensivo y el tridente ofensivo barcelonista. Si el camerunés logra cortar la línea de pase hacia Lewandowski, el Barça perderá su referencia en área.

Barcelona intentará imponer su pressing en salida de balón, buscando robar en campo contrario. Sin Pedri como enlace, Frenkie de Jong deberá asumir más metros de campo, lo que le alejará de sus posiciones naturales de finalización. El punto débil del Barça es la transición defensiva cuando pierden la pelota en campo rival — y precisamente ahí es donde Bellingham y Valverde son letales.

El factor Carvajal en el lado derecho del Madrid será determinante: su capacidad de doblar a Raphinha limita el desborde barcelonista por banda y genera superioridad numérica en transición.`,

      contextAnalysis: `Partido de máxima trascendencia: 3 puntos de diferencia con 4 jornadas por disputar. Una victoria del Madrid prácticamente certifica el título; una del Barça reabre completamente la lucha. El historial reciente en esta situación específica (decisivo por el título) favorece ligeramente al Barcelona, que parece crecer cuando las circunstancias extremas le exigen al máximo.

El factor árbitro es relevante: Hernández Hernández ha pitado 4 Clásicos anteriores con balance de 2V Real Madrid, 1E, 1V Barça. Expulsó a 2 jugadores del Madrid en su último partido (aunque ambas fueron correctas). No se esperan gestos de extrema permisividad.`,

      keyFactors: [
        "Vinícius Jr.: 7 goles en 5 partidos — mejor racha goleadora de su carrera en LaLiga",
        "Pedri baja confirmada — el Barça ha perdido sus últimos 3 partidos sin él en el 11",
        "Real Madrid: 8 partidos invicto, xG de 2.4 por partido en ese período",
        "Barça xGA de 1.8/partido como visitante vs equipos del Top 6 esta temporada",
        "Bellingham lleva 4 goles en los últimos 4 Clásicos — especialista del partido",
        "Gavi amarillado — riesgo de pérdida por acumulación en partido de alta intensidad",
        "Real Madrid ganó el 75% de los Clásicos en que marca primero en el Bernabéu",
      ],

      teamStats: {
        home: {
          form: "VVVEV",
          goalsScored: 2.4,
          goalsConceded: 0.8,
          possession: 54,
          xG: 2.3,
          xGA: 0.9,
          shots: 16.2,
          shotsOnTarget: 6.1,
          pressureIndex: 72,
          cleanSheets: 14,
          corners: 6.8,
        },
        away: {
          form: "VDVVV",
          goalsScored: 2.1,
          goalsConceded: 1.1,
          possession: 62,
          xG: 2.0,
          xGA: 1.2,
          shots: 14.8,
          shotsOnTarget: 5.4,
          pressureIndex: 81,
          cleanSheets: 11,
          corners: 7.2,
        },
      },

      headToHead: {
        played: 10,
        homeWins: 6,
        draws: 2,
        awayWins: 2,
        avgGoals: 3.2,
        lastResults: ["2-1", "1-1", "3-2", "0-1", "2-0"],
        bttsRate: 65,
        over25Rate: 70,
      },

      marketData: {
        homeOdds: 2.30,
        drawOdds: 3.40,
        awayOdds: 2.90,
        over25Odds: 1.75,
        bttsOdds: 1.80,
        asianHandicap: "-0.25 Local",
        valuebet: "Ambos marcan @ 1.80 — historial H2H lo respalda (65% BTTS)",
      },

      tactical: {
        homeFormation: "4-3-3",
        awayFormation: "4-2-3-1",
        keyBattle: "Tchouaméni vs Lewandowski — control del área vs referencia ofensiva",
        pressureZone: "Mediocampo central — posesión vs pressing alto",
        setpieces: "Peligro ALTO para ambos — Madrid saca córners con peligro, Barça tiene altura con Iñigo Martínez",
        tempo: "Alto en los primeros 20 minutos, posiblemente más táctico tras el primer gol",
      },

      playerAlerts: [
        { name: "Vinícius Jr.", team: "home", type: "racha", detail: "7 goles en 5 partidos — en estado de gracia absoluto" },
        { name: "Jude Bellingham", team: "home", type: "goleador", detail: "4 goles en los últimos 4 Clásicos — jugador del partido habitual" },
        { name: "Pedri", team: "away", type: "baja", detail: "Baja confirmada por lesión muscular — ausencia determinante" },
        { name: "Gavi", team: "away", type: "sancionado", detail: "1 amarilla de la acumulación — riesgo de pérdida por 2ª tarjeta" },
        { name: "Robert Lewandowski", team: "away", type: "goleador", detail: "23 goles esta temporada — máximo goleador del Barça" },
        { name: "Raphinha", team: "away", type: "asistente", detail: "12 asistencias esta temporada — creador principal sin Pedri" },
      ],

      bettingAngles: {
        primaryBet: "1X (Victoria Real Madrid o Empate)",
        primaryRationale: "La ventaja de local del Madrid, la baja de Pedri y la racha de Vinícius hacen de esta la opción con mejor ratio riesgo/recompensa. Cuota ~1.42.",
        secondaryBet: "Ambos equipos marcan (BTTS Sí)",
        secondaryRationale: "65% de H2H termina con ambos marcando. Cuota ~1.80 ofrece valor real respaldado por datos históricos sólidos.",
        avoidBet: "Victoria Barça en 1X2 directa",
        avoidRationale: "La baja de Pedri y el contexto de local hacen que la cuota de 2.90 no represente valor real frente al riesgo asumido.",
        valueRating: 4,
      },

      recommendation: "1X + Ambos equipos marcan",
      confidence: "Alta",
      riskLevel: "Medio",
      isPremium: false,
      predictedScore: "2-1",
      predictedGoals: 3.1,
    },
  },

  // ── 2. ATLÉTICO vs SEVILLA ────────────────────────────────────────────────
  {
    id: "2",
    homeTeam: "Atlético de Madrid",
    awayTeam: "Sevilla FC",
    dateISO: "2025-05-10T16:30:00Z",
    league: "La Liga",
    leagueFlag: "🇪🇸",
    status: "scheduled",
    venue: "Estadio Cívitas Metropolitano, Madrid",
    referee: "César Soto Grado",
    insight: {
      homeWin: 55,
      draw: 22,
      awayWin: 23,

      analysis: `Atlético de Madrid recibe a un Sevilla en caída libre en un partido donde los rojiblancos no pueden permitirse ningún tropiezo si quieren mantenerse en la lucha por el título. El Metropolitano se convierte en un fortín donde el equipo de Simeone ha ganado 11 de sus últimos 13 encuentros ligueros, con solo 8 goles encajados en todo ese período.

Sevilla presenta la tercera peor defensa visitante del tramo final de temporada: 2.3 goles encajados por partido fuera de casa en los últimos 8 desplazamientos. Su problema principal es estructural: al presionar alto pierden la línea defensiva y el espacio a espaldas de los laterales es una autopista que el Atlético explota con Morata y las incorporaciones de Llorente.

La baja de Morata en las últimas semanas fue el gran lastre del Atlético, pero el delantero lleva 10 días entrenando sin restricciones y está confirmado para este partido. Con él en el 11, el Atlético suma de media 0.7 goles más por partido — una diferencia estadística extraordinaria para un único jugador.`,

      tacticalBreakdown: `Simeone previsiblemente repetirá el 4-4-2 en bloque medio que tan bien le ha funcionado en casa. El objetivo no es dominar el partido sino controlar el espacio y atacar con velocidad. Los dos pivotes (Koke y De Paul) tienen la misión de cerrar el pasillo central y forzar a Sevilla hacia las bandas.

Sevilla intentará el juego posicional que les resulta cómodo con Rakitić como director de juego, pero el Metropolitano en una cita importante tiende a acelerar los tiempos de todos los partidos, lo cual juega en contra de los de García Pimienta. Los 10-15 primeros minutos serán clave: si el Atlético marca primero, el partido está prácticamente cerrado (el equipo de Simeone gana el 91% de los partidos en casa cuando se adelanta).`,

      contextAnalysis: `Atlético llega 2 puntos por detrás del líder con 4 jornadas restantes — cualquier tropiezo significa despedirse del título. Esta presión, lejos de perjudicarles, históricamente motiva al equipo de Simeone: en las últimas 6 temporadas, el Atlético suma 14V 1E 1D en partidos en casa cuando está en lucha directa por el título en las últimas 5 jornadas.

Sevilla, por su parte, ya está matemáticamente seguro en la permanencia y tiene la vista puesta en el mercado de verano. La motivación es claramente menor, aunque el orgullo y el deseo de aguarle la fiesta al vecino siempre actúa como factor.`,

      keyFactors: [
        "Morata regresa al 11 titular — el Atlético marca 0.7 goles más con él en campo",
        "Sevilla: 2.3 goles encajados/partido como visitante en los últimos 8 partidos",
        "Metropolitano: 91% de victorias cuando el Atlético se adelanta en el marcador",
        "Koke cumple 400 partidos con el Atlético — factor emocional motivador",
        "Sevilla sin ganar fuera de casa en los últimos 7 desplazamientos ligueros",
        "Simeone: 82% de victorias en casa vs equipos de la mitad baja con presión de título",
        "Rakitić: único jugador de Sevilla capaz de alterar el plan defensivo del Atlético",
      ],

      teamStats: {
        home: {
          form: "VVVVE",
          goalsScored: 1.9,
          goalsConceded: 0.7,
          possession: 49,
          xG: 1.8,
          xGA: 0.8,
          shots: 13.4,
          shotsOnTarget: 5.2,
          pressureIndex: 68,
          cleanSheets: 16,
          corners: 5.6,
        },
        away: {
          form: "DVDDE",
          goalsScored: 1.1,
          goalsConceded: 2.3,
          possession: 51,
          xG: 1.3,
          xGA: 2.1,
          shots: 11.2,
          shotsOnTarget: 3.8,
          pressureIndex: 59,
          cleanSheets: 3,
          corners: 5.1,
        },
      },

      headToHead: {
        played: 10,
        homeWins: 6,
        draws: 3,
        awayWins: 1,
        avgGoals: 2.1,
        lastResults: ["1-0", "2-1", "0-0", "1-0", "3-0"],
        bttsRate: 35,
        over25Rate: 30,
      },

      marketData: {
        homeOdds: 1.62,
        drawOdds: 3.80,
        awayOdds: 5.20,
        over25Odds: 2.20,
        bttsOdds: 2.60,
        asianHandicap: "-1 Local",
        valuebet: "Victoria Atlético -1 AH @ 2.10 — respaldada por stats defensivas del Sevilla visitante",
      },

      tactical: {
        homeFormation: "4-4-2",
        awayFormation: "4-3-3",
        keyBattle: "De Paul/Koke vs Rakitić — dominio del mediocampo central",
        pressureZone: "Bloque medio-bajo del Atlético vs posesión de Sevilla",
        setpieces: "Peligro ALTO para Atlético — Giménez y Oblak bajan a poner en córner, Sevilla flojo en set pieces defensivos",
        tempo: "Bajo a medio — Atlético controlará el ritmo sin Sevilla para imponer el suyo",
      },

      playerAlerts: [
        { name: "Álvaro Morata", team: "home", type: "regreso", detail: "Regresa al 11 tras lesión — diferencial estadístico para el Atlético" },
        { name: "Marcos Llorente", team: "home", type: "asistente", detail: "6 asistencias en los últimos 8 partidos en casa" },
        { name: "Ivan Rakitić", team: "away", type: "goleador", detail: "3 goles en LaLiga esta temporada — único creador de peligro de Sevilla" },
        { name: "Sergio Ramos", team: "away", type: "baja", detail: "Duda hasta última hora — su ausencia debilita salida de balón visitante" },
      ],

      bettingAngles: {
        primaryBet: "Victoria Atlético de Madrid (1)",
        primaryRationale: "Cuota 1.62 justificada: Morata de vuelta, Sevilla en ruina visitante, Atlético con motivación máxima por título.",
        secondaryBet: "Atlético -1 Hándicap Asiático",
        secondaryRationale: "Con victoria probable por más de 1 gol dado el estado defensivo de Sevilla fuera. Cuota ~2.10.",
        avoidBet: "Más de 2.5 goles",
        avoidRationale: "Solo el 30% de H2H supera los 2.5 goles. El estilo defensivo de Simeone hace poco probable un intercambio de golpes abierto.",
        valueRating: 5,
      },

      recommendation: "Victoria Local (1) + Hándicap Asiático -1",
      confidence: "Alta",
      riskLevel: "Bajo",
      isPremium: true,
      predictedScore: "2-0",
      predictedGoals: 1.8,
    },
  },

  // ── 3. MAN CITY vs ARSENAL ────────────────────────────────────────────────
  {
    id: "3",
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    dateISO: "2025-05-11T15:30:00Z",
    league: "Premier League",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    status: "scheduled",
    venue: "Etihad Stadium, Manchester",
    referee: "Michael Oliver",
    insight: {
      homeWin: 47,
      draw: 26,
      awayWin: 27,

      analysis: `El partido más esperado de la Premier League en las últimas semanas: dos estilos opuestos, dos filosofías enfrentadas y todo el título en juego. Manchester City llega al Etihad habiendo ganado 7 de sus últimos 8 partidos en casa con una versión de Haaland que recuerda a sus mejores temporadas — el noruego lleva 4 goles en sus últimos 3 partidos después de un período de sequía que preocupó a los analistas.

Arsenal llega como el equipo más en forma de la Premier en las últimas 6 semanas: 5 victorias consecutivas, el mejor xG de la liga en ese período (2.6 por partido) y con Saka completamente recuperado. El problema del Arsenal es específicamente el Etihad: 0 victorias en los últimos 6 desplazamientos a este estadio, con un xG promedio de solo 0.8 en esos partidos — números que revelan la parálisis táctica que este escenario provoca en el equipo de Arteta.

La clave estadística más relevante: el 73% de los partidos entre estos dos equipos desde 2018 ha terminado con ambos equipos marcando (BTTS). Los sistemas ofensivos de ambos generan tan alta cantidad y calidad de ocasiones que es extremadamente difícil para cualquiera de los dos mantener la portería a cero.`,

      tacticalBreakdown: `City probablemente plantee el 3-2-4-1 que tan bien le funcionó contra el Liverpool. Rodri como pivote único es el eje de todo: su capacidad de filtrar pases entre líneas y su trabajo defensivo son irreemplazables. Si Rodri está en su mejor versión, Arsenal pierde el 70% de los duelos en el mediocampo.

Arsenal responderá con un 4-3-3 de presión alta, intentando robar el balón en campo rival antes de que City organice su juego. El problema es que este pressing gasta mucho en los primeros 60 minutos, y City tiene la profundidad de plantilla para castigar el cansancio en el tramo final.

La batalla táctica más interesante: Cancelo/Walker vs Saka. El extremo inglés ha sido el mejor jugador de Arsenal esta temporada, pero Walker en su mejor nivel es capaz de neutralizarle completamente. Si Walker gana ese duelo individual, Arsenal pierde su principal vía de ataque.`,

      contextAnalysis: `A 4 jornadas del final, City aventaja en 1 punto a Arsenal. Para el Gunners, ganar este partido significaría colocarse primero con 3 partidos por jugar — una posición desde la que nunca han perdido el título en la era Premier. Para City, ganar sería prácticamente resolver el campeonato con 9 puntos restantes para los rivales.

El factor mental es crucial: Arsenal lleva 20 años sin ganar la Premier. La presión acumulada históricamente les ha pesado en los tramos finales. Arteta ha trabajado específicamente en esto, pero el Etihad es donde se ha materializado la mayoría de sus fracasos recientes.`,

      keyFactors: [
        "Haaland: regresa en forma — 4 goles en 3 partidos tras período de sequía",
        "Arsenal: 0 victorias en últimas 6 visitas al Etihad — 'maldición' estadística real",
        "73% de partidos City-Arsenal desde 2018 terminó BTTS (ambos marcan)",
        "Rodri: 89% de duelos ganados en casa esta temporada — controlador total",
        "Saka 100% recuperado — vuelve a ser el mejor jugador de Arsenal",
        "City gana el 83% de sus partidos en casa cuando Haaland marca en el primero",
        "Arsenal acumula el mejor xG de la liga en las últimas 6 jornadas (2.6/partido)",
      ],

      teamStats: {
        home: {
          form: "VVDVV",
          goalsScored: 2.7,
          goalsConceded: 0.9,
          possession: 63,
          xG: 2.5,
          xGA: 0.8,
          shots: 18.4,
          shotsOnTarget: 7.2,
          pressureIndex: 76,
          cleanSheets: 13,
          corners: 8.1,
        },
        away: {
          form: "VVVVV",
          goalsScored: 2.1,
          goalsConceded: 0.8,
          possession: 58,
          xG: 2.6,
          xGA: 0.9,
          shots: 15.6,
          shotsOnTarget: 6.0,
          pressureIndex: 79,
          cleanSheets: 12,
          corners: 6.4,
        },
      },

      headToHead: {
        played: 12,
        homeWins: 7,
        draws: 2,
        awayWins: 3,
        avgGoals: 3.4,
        lastResults: ["3-1", "1-0", "4-1", "1-1", "2-2"],
        bttsRate: 73,
        over25Rate: 75,
      },

      marketData: {
        homeOdds: 2.05,
        drawOdds: 3.60,
        awayOdds: 3.40,
        over25Odds: 1.65,
        bttsOdds: 1.70,
        asianHandicap: "-0.5 Local",
        valuebet: "BTTS + Más de 2.5 @ 1.95 combinado — H2H y forma actual lo respaldan con fuerza",
      },

      tactical: {
        homeFormation: "3-2-4-1",
        awayFormation: "4-3-3",
        keyBattle: "Rodri vs Ødegaard — control del mediocampo define el partido",
        pressureZone: "Transición rápida de ambos — el espacio a espaldas de la defensa será clave",
        setpieces: "Peligro ALTO bilateral — Haaland en el área y Gabriel/Saliba en córners del Arsenal",
        tempo: "Muy alto en los primeros 30 minutos, partido abierto probable",
      },

      playerAlerts: [
        { name: "Erling Haaland", team: "home", type: "racha", detail: "4 goles en 3 partidos — vuelve a su mejor nivel tras sequía" },
        { name: "Kevin De Bruyne", team: "home", type: "asistente", detail: "10 asistencias esta temporada — cerebro creativo del City" },
        { name: "Bukayo Saka", team: "away", type: "regreso", detail: "100% recuperado — clave en las últimas 5 victorias seguidas" },
        { name: "Martin Ødegaard", team: "away", type: "goleador", detail: "Capitán en racha: 3 goles en las últimas 4 jornadas" },
        { name: "Leandro Trossard", team: "away", type: "racha", detail: "5 partidos seguidos marcando o asistiendo — en estado de gracia" },
      ],

      bettingAngles: {
        primaryBet: "Ambos marcan + Más de 2.5 goles",
        primaryRationale: "73% H2H BTTS, ambos en máxima forma ofensiva, cuota ~1.95 en la combinación ofrece valor excepcional.",
        secondaryBet: "Victoria Manchester City (1)",
        secondaryRationale: "La ventaja de local + la maldición del Etihad de Arsenal + Haaland en forma hacen al City ligero favorito real.",
        avoidBet: "Victoria Arsenal en 1X2",
        avoidRationale: "Arsenal merecería ser favorito si el partido fuera en el Emirates — pero las estadísticas del Etihad son demasiado adversas para apostar a su victoria directa.",
        valueRating: 5,
      },

      recommendation: "BTTS + Más de 2.5 goles",
      confidence: "Alta",
      riskLevel: "Bajo",
      isPremium: true,
      predictedScore: "2-2",
      predictedGoals: 3.3,
    },
  },

  // ── 4. LIVERPOOL vs CHELSEA ───────────────────────────────────────────────
  {
    id: "4",
    homeTeam: "Liverpool",
    awayTeam: "Chelsea",
    dateISO: "2025-05-11T12:00:00Z",
    league: "Premier League",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    status: "scheduled",
    venue: "Anfield, Liverpool",
    referee: "Anthony Taylor",
    insight: {
      homeWin: 52,
      draw: 21,
      awayWin: 27,

      analysis: `Anfield como escenario de otra potencial goleada. Liverpool lleva 14 partidos invicto en casa (12V 2E) con una diferencia de goles de +29 que es la segunda mejor de toda la historia de la Premier en una temporada. Mo Salah, en lo que podría ser su última temporada en el club, vive una campaña para el recuerdo: 24 goles y 14 asistencias en liga, números que le colocan entre los mejores de la historia en una sola temporada.

Chelsea llega a Anfield en un momento de transición que se está alargando más de lo esperado. El nuevo entrenador ha introducido cambios tácticos que el equipo todavía no ha asimilado por completo: esto se traduce en una inconsistencia defensiva notable, especialmente en la primera línea de presión. En sus últimos 10 desplazamientos, Chelsea encajó en el 90% de ellos.

El dato más revelador de este partido: en los últimos 15 encuentros entre ambos en Anfield, Liverpool ha marcado en el 100% de los partidos y ha ganado 11 de ellos. La fortaleza del Liverpool en casa trasciende al rival — es más un problema del propio Chelsea para sobrevivir a la presión de Anfield que de Liverpool para crearla.`,

      tacticalBreakdown: `Liverpool usará su clásico 4-3-3 con presión extrema desde el inicio. Slot ha añadido una capa de organización posicional que Klopp nunca tuvo: el Liverpool ahora es igualmente peligroso con y sin balón. Las líneas compactas en defensa previenen el contraataque de Chelsea y la transición ofensiva se produce en menos de 6 segundos de media.

Chelsea intentará un 4-2-3-1 compacto que busque aprovechar las transiciones. El problema es que sus mediocampistas de contención (Caicedo y Enzo Fernández) pierden demasiados duelos contra los volantes de Liverpool. Cole Palmer, el mejor jugador de Chelsea, tendrá que asumir prácticamente toda la responsabilidad creativa desde una posición muy avanzada.

El aspecto más crítico para Chelsea: Anfield tiene un efecto psicológico demostrado estadísticamente. Los equipos visitantes reducen su pase hacia adelante en un 23% en los primeros 20 minutos comparado con su media habitual — la presión del ambiente les hace más conservadores.`,

      contextAnalysis: `Liverpool ya aseguró su plaza en Champions la temporada próxima y todavía tiene opciones matemáticas de acabar segundo. Chelsea pelea por un puesto europeo (actualmente 7°, a 3 puntos del 6°). Motivaciones diferentes pero Chelsea no puede permitirse perder puntos si quiere asegurar la Conference League mínimo.

El contexto emocional de Salah es relevante: si este es realmente su último año, Anfield le tratará como a un héroe. Esa energía colectiva entre jugador y afición tiene un efecto real en su rendimiento — en los últimos 3 posibles "últimos partidos" de grandes leyendas en Anfield, el Liverpool ganó los 3 con el jugador en cuestión marcando.`,

      keyFactors: [
        "Salah: 24 goles y 14 asistencias — uno de los mejores registros en una temporada en la historia Premier",
        "Liverpool: diferencia de goles +29 en casa — segunda mejor histórica de la Premier",
        "Chelsea encajó en el 90% de sus últimas 10 visitas como visitante",
        "Anfield: Liverpool marcó en el 100% de los últimos 15 partidos ante Chelsea en casa",
        "Cole Palmer: único jugador capaz de crear peligro para Chelsea — marcado objetivo",
        "Enzo Fernández: 42% en duelos ganados — demasiado bajo para sobrevivir a la presión de Liverpool",
        "Liverpool lleva 6 partidos seguidos marcando al menos 2 goles en casa",
      ],

      teamStats: {
        home: {
          form: "VVVVV",
          goalsScored: 2.8,
          goalsConceded: 0.6,
          possession: 57,
          xG: 2.7,
          xGA: 0.7,
          shots: 17.1,
          shotsOnTarget: 6.8,
          pressureIndex: 82,
          cleanSheets: 15,
          corners: 7.3,
        },
        away: {
          form: "DVDDV",
          goalsScored: 1.4,
          goalsConceded: 1.8,
          possession: 52,
          xG: 1.5,
          xGA: 1.9,
          shots: 12.3,
          shotsOnTarget: 4.1,
          pressureIndex: 61,
          cleanSheets: 4,
          corners: 5.5,
        },
      },

      headToHead: {
        played: 15,
        homeWins: 11,
        draws: 2,
        awayWins: 2,
        avgGoals: 2.9,
        lastResults: ["4-1", "2-0", "1-1", "3-0", "2-1"],
        bttsRate: 45,
        over25Rate: 62,
      },

      marketData: {
        homeOdds: 1.55,
        drawOdds: 4.20,
        awayOdds: 5.80,
        over25Odds: 1.75,
        bttsOdds: 2.20,
        asianHandicap: "-1 Local",
        valuebet: "Liverpool -1 Hándicap Asiático @ 1.90 — histórico de victorias amplias en Anfield",
      },

      tactical: {
        homeFormation: "4-3-3",
        awayFormation: "4-2-3-1",
        keyBattle: "Salah vs Cucurella — el duelo definitorio del partido en banda derecha",
        pressureZone: "Presión alta de Liverpool desde el inicio — Chelsea tendrá que soportar ola tras ola",
        setpieces: "Peligro ALTO para Liverpool — Van Dijk y Konaté dominan el juego aéreo",
        tempo: "Muy alto desde el inicio — Liverpool dictará el ritmo",
      },

      playerAlerts: [
        { name: "Mohamed Salah", team: "home", type: "racha", detail: "24 goles + 14 asistencias — temporada histórica posiblemente despidiéndose de Anfield" },
        { name: "Luis Díaz", team: "home", type: "goleador", detail: "Regresa tras 2 semanas de baja — fresco y motivado" },
        { name: "Cole Palmer", team: "away", type: "goleador", detail: "17 goles esta temporada — único diferencial real de Chelsea" },
        { name: "Reece James", team: "away", type: "baja", detail: "Baja confirmada por lesión — déficit defensivo en banda derecha" },
      ],

      bettingAngles: {
        primaryBet: "Victoria Liverpool (1)",
        primaryRationale: "Cuota 1.55 justificada por todos los datos: Anfield, Salah en forma, Chelsea sin James, historia H2H dominante.",
        secondaryBet: "Liverpool -1 AH (Hándicap Asiático)",
        secondaryRationale: "Liverpool gana por 2+ goles en el 67% de sus victorias en casa. Cuota ~1.90.",
        avoidBet: "Chelsea gana o empata (X2)",
        avoidRationale: "Solo 4 de los 15 H2H en Anfield no fue victoria de Liverpool. La cuota de ~1.35 para X2 no compensa el riesgo.",
        valueRating: 4,
      },

      recommendation: "Victoria Liverpool + Hándicap -1",
      confidence: "Alta",
      riskLevel: "Bajo",
      isPremium: true,
      predictedScore: "3-1",
      predictedGoals: 2.9,
    },
  },

  // ── 5. JUVENTUS vs INTER ──────────────────────────────────────────────────
  {
    id: "5",
    homeTeam: "Juventus",
    awayTeam: "Inter de Milán",
    dateISO: "2025-05-12T18:45:00Z",
    league: "Serie A",
    leagueFlag: "🇮🇹",
    status: "scheduled",
    venue: "Juventus Stadium (Allianz Stadium), Turín",
    referee: "Daniele Orsato",
    insight: {
      homeWin: 33,
      draw: 30,
      awayWin: 37,

      analysis: `El Derby d'Italia es el partido más analizado del calendario de la Serie A, y estadísticamente el más impredecible para los modelos cuantitativos. En los últimos 10 años, el equipo favorito por probabilidades solo ha ganado el 51% de estos enfrentamientos — prácticamente un lanzamiento de moneda.

Inter llega como claro favorito en forma: 6 victorias consecutivas en Serie A, el mejor ataque del campeonato (82 goles) y con Lautaro Martínez en una racha de 5 partidos marcando. Sin embargo, el Juventus Stadium tiene un efecto estadístico real sobre el Inter: los nerazzurri han ganado solo 2 de sus últimos 8 visitas aquí, con 4 empates y 2 derrotas. El ambiente del estadio, la presión local y el estilo de bloque bajo de Juventus crean una ecuación que el Inter no ha sabido resolver de forma consistente.

La ausencia confirmada de Duván Zapata para el Inter (lesión de rodilla que le tendrá fuera 3-4 semanas) reduce las opciones de juego directo que normalmente usan como alternativa cuando el rival cierra los espacios. Esto beneficia directamente a Juventus, que defenderá con 9 hombres si es necesario.`,

      tacticalBreakdown: `Juventus bajo Motta saldrá con un 4-2-3-1 muy compacto, con las dos líneas de 4 muy juntas para denegar el espacio entre líneas que Inter necesita para activar a Calhanoglu. La clave defensiva es Locatelli como centrocampista de contención — su posicionamiento debe cubrir los movimientos de Mkhitaryan y Barella.

Inter responderá con su 3-5-2 habitual, pero la salida de balón entre los tres centrales encontrará resistencia en el pressing de Vlahovic, que trabajará específicamente para presionar al central derecho del Inter (Darmian, que es más débil con el balón que Acerbi o De Vrij).

El dato táctico más relevante: en los últimos 6 Derby d'Italia con Inter como favorito, el equipo ganó el partido en los últimos 20 minutos en 3 ocasiones — Inter tiene el banco más profundo y la condición física superior al final del partido.`,

      contextAnalysis: `Inter ya es campeón matemático (o está a 1 punto de serlo) dependiendo de los resultados de la jornada anterior. Si Inter entra en este partido habiendo ya ganado el título, la motivación puede ser menor — aunque los jugadores del Inter han declarado públicamente que quieren ganar también este partido por orgullo.

Juventus necesita los 3 puntos para asegurar la 4ª plaza de Champions y no depender de otros resultados. Esta diferencia en motivación es relevante estadísticamente: en los últimos 8 Derby d'Italia donde uno de los equipos ya no tenía nada en juego, el equipo motivado ganó el 75% de las veces.`,

      keyFactors: [
        "Duván Zapata baja confirmada para Inter — pierde la referencia de juego directo",
        "Juventus Stadium: Inter solo ganó 2 de sus últimas 8 visitas aquí (4E, 2D)",
        "Inter: 6 victorias consecutivas — el equipo en mejor momento de la Serie A",
        "Lautaro Martínez: 5 partidos seguidos marcando — peligro máximo en área",
        "65% de los últimos Derby d'Italia terminó con Under 2.5 goles totales",
        "Juventus necesita ganar para asegurar la 4ª plaza de Champions sin depender de nadie",
        "Locatelli disponible tras sanción — clave para controlar a Barella",
      ],

      teamStats: {
        home: {
          form: "VDEVV",
          goalsScored: 1.6,
          goalsConceded: 1.0,
          possession: 53,
          xG: 1.7,
          xGA: 1.1,
          shots: 13.8,
          shotsOnTarget: 4.9,
          pressureIndex: 63,
          cleanSheets: 10,
          corners: 5.8,
        },
        away: {
          form: "VVVVV",
          goalsScored: 2.3,
          goalsConceded: 0.8,
          possession: 58,
          xG: 2.2,
          xGA: 0.9,
          shots: 16.1,
          shotsOnTarget: 6.3,
          pressureIndex: 74,
          cleanSheets: 13,
          corners: 6.9,
        },
      },

      headToHead: {
        played: 10,
        homeWins: 3,
        draws: 4,
        awayWins: 3,
        avgGoals: 2.0,
        lastResults: ["1-1", "0-1", "1-2", "0-0", "2-0"],
        bttsRate: 40,
        over25Rate: 30,
      },

      marketData: {
        homeOdds: 2.90,
        drawOdds: 3.30,
        awayOdds: 2.40,
        over25Odds: 2.50,
        bttsOdds: 2.80,
        asianHandicap: "+0.25 Local",
        valuebet: "Empate o Victoria Juventus (1X) @ 1.72 — respaldado por historial y ventaja de local",
      },

      tactical: {
        homeFormation: "4-2-3-1",
        awayFormation: "3-5-2",
        keyBattle: "Locatelli vs Barella — quien gane el mediocampo gana el partido",
        pressureZone: "Construcción desde atrás del Inter vs pressing posicional de Juventus",
        setpieces: "Peligro MEDIO — Juventus tiene altura con Gatti y Bremer, Inter también es competitivo en set pieces",
        tempo: "Bajo a medio — Juventus intentará ralentizar el juego para evitar la velocidad del Inter",
      },

      playerAlerts: [
        { name: "Lautaro Martínez", team: "away", type: "racha", detail: "5 partidos seguidos marcando — capitán y máximo peligro" },
        { name: "Duván Zapata", team: "away", type: "baja", detail: "Baja confirmada por lesión de rodilla — 3-4 semanas fuera" },
        { name: "Dušan Vlahović", team: "home", type: "goleador", detail: "Sin marcar en los últimos 4 partidos — bajo presión para rendir en el Derby" },
        { name: "Nicolò Barella", team: "away", type: "asistente", detail: "Motor del Inter — su control del mediocampo es determinante" },
        { name: "Federico Chiesa", team: "home", type: "regreso", detail: "Vuelve a la convocatoria — puede ser el factor sorpresa del partido" },
      ],

      bettingAngles: {
        primaryBet: "Menos de 2.5 goles (Under 2.5)",
        primaryRationale: "70% de los H2H terminó con menos de 2.5 goles. Juventus defensivo + baja de Zapata = partido cerrado casi seguro.",
        secondaryBet: "Empate o Victoria Juventus (1X)",
        secondaryRationale: "Cuota 1.72 para no perder con el local. Historial en Juventus Stadium respalda que Inter no gana fácilmente aquí.",
        avoidBet: "Victoria Inter directa (2)",
        avoidRationale: "La cuota de 2.40 no compensa el riesgo dado el historial adverso del Inter en Turín. Valor negativo.",
        valueRating: 4,
      },

      recommendation: "Under 2.5 goles + 1X (No pierde Juventus)",
      confidence: "Media",
      riskLevel: "Medio",
      isPremium: true,
      predictedScore: "1-1",
      predictedGoals: 1.9,
    },
  },

  // ── 6. BAYERN vs PSG ─────────────────────────────────────────────────────
  {
    id: "6",
    homeTeam: "Bayern de Múnich",
    awayTeam: "PSG",
    dateISO: "2025-05-13T19:00:00Z",
    league: "Champions League",
    leagueFlag: "🏆",
    status: "scheduled",
    venue: "Allianz Arena, Múnich",
    referee: "Slavko Vinčić (Eslovenia)",
    insight: {
      homeWin: 48,
      draw: 19,
      awayWin: 33,

      analysis: `Semifinal de la UEFA Champions League. El partido más importante del calendario europeo esta semana enfrenta a dos gigantes con perfiles radicalmente distintos: el Bayern de Kompany, un equipo construido sobre el trabajo colectivo, la presión intensa y la experiencia de ganar en Europa; y el PSG de Luis Enrique, una escuadra en transformación que ha conseguido sus mejores resultados europeos precisamente cuando nadie les daba como favoritos.

Bayern llega en la mejor versión de la temporada: 7 partidos invictos, el mejor xG de la Bundesliga en ese período (2.9) y con Harry Kane en una racha de 6 partidos marcando. El inglés ha transformado completamente al Bayern desde su llegada: no solo goles (28 esta temporada entre todas las competiciones) sino también la capacidad de retener el balón y asociarse con los extremos, algo que los delanteros centros del Bayern carecían históricamente.

PSG eliminó al Barcelona en cuartos de forma espectacular (4-2 global), pero la forma en que lo hizo reveló tanto fortalezas como debilidades: Ousmane Dembélé en un nivel extraordinario, Bradley Barcola imparable por banda izquierda... pero una línea defensiva que se expuso peligrosamente cuando el Barça presionó alto en el Parque de los Príncipes. Bayern tiene aún más capacidad de presión que el Barça, lo que podría ser determinante.`,

      tacticalBreakdown: `Bayern saldrá con su 4-2-3-1 de alta presión que han perfeccionado esta temporada. La clave táctica es el pressing de Kane sobre el portero y los centrales del PSG — fuerza errores en la construcción que el mediocampo del Bayern aprovecha para recuperar en campo rival. Müller, a sus 35 años, sigue siendo el mejor "cazador de espacios" del fútbol europeo: sus movimientos sin balón en los huecos de la defensa del PSG serán fundamentales.

PSG utilizará su variante de 4-3-3 con Vitinha como mediocampista ofensivo libre. El principal problema del PSG es que su pressing también es intenso, y cuando dos equipos que presionan alto se enfrentan, el partido se juega habitualmente en transiciones muy rápidas donde la calidad individual importa más que el sistema. En esa dimensión, Kane y Müller tienen más experiencia que cualquier jugador del PSG.

El punto débil específico de PSG: el lateral derecho Hakimi al atacar deja enormes espacios a espaldas para que Musiala aproveche en sentido contrario. Si Bayern encuentra esa diagonal reiteradamente, PSG tendrá que elegir entre perder la aportación ofensiva de Hakimi o asumir el riesgo defensivo.`,

      contextAnalysis: `Bayern ha ganado la Champions 6 veces; PSG nunca. Este contexto histórico tiene peso real: en las semifinales de Champions, el equipo con mayor historia en la competición ha ganado el 68% de los partidos según datos UEFA desde 1993.

Allianz Arena en noches europeas es uno de los estadios más intimidantes del fútbol mundial: 75.000 espectadores con una intensidad sonora que alcanza los 102 decibelios en los momentos cumbre. El PSG no ha ganado en Alemania ante un grande en los últimos 8 intentos en competición europea.

El árbitro esloveno Vinčić es conocido por su permisividad con el juego físico — esto beneficia al Bayern, que es el equipo más agresivo en duelos de este partido.`,

      keyFactors: [
        "Kane: 28 goles esta temporada — primer delantero del Bayern con esa cifra desde Lewandowski",
        "PSG no ganó en Alemania ante un grande en los últimos 8 partidos europeos",
        "Bayern gana el 89% de sus semifinales de CL en casa a lo largo de la historia",
        "Dembélé en forma extraordinaria — el mayor peligro individual del PSG",
        "Hakimi atacando deja espacios para Musiala — punto débil táctico identificado",
        "Allianz Arena: 102dB en momentos cumbre — factor psicológico real para visitantes",
        "PSG defensivamente vulnerable al pressing alto — demostrado ante el Barça en cuartos",
      ],

      teamStats: {
        home: {
          form: "VVVVV",
          goalsScored: 2.9,
          goalsConceded: 0.8,
          possession: 60,
          xG: 2.8,
          xGA: 0.9,
          shots: 19.2,
          shotsOnTarget: 7.6,
          pressureIndex: 85,
          cleanSheets: 12,
          corners: 8.8,
        },
        away: {
          form: "VDVVV",
          goalsScored: 2.1,
          goalsConceded: 1.3,
          possession: 56,
          xG: 2.0,
          xGA: 1.4,
          shots: 14.7,
          shotsOnTarget: 5.6,
          pressureIndex: 77,
          cleanSheets: 8,
          corners: 6.1,
        },
      },

      headToHead: {
        played: 8,
        homeWins: 5,
        draws: 1,
        awayWins: 2,
        avgGoals: 3.1,
        lastResults: ["3-0", "2-2", "3-1", "0-1", "2-3"],
        bttsRate: 62,
        over25Rate: 75,
      },

      marketData: {
        homeOdds: 1.88,
        drawOdds: 3.80,
        awayOdds: 3.90,
        over25Odds: 1.72,
        bttsOdds: 1.78,
        asianHandicap: "-0.5 Local",
        valuebet: "Bayern gana + BTTS @ 2.85 combinado — PSG siempre crea peligro pero Bayern los supera en casa",
      },

      tactical: {
        homeFormation: "4-2-3-1",
        awayFormation: "4-3-3",
        keyBattle: "Kane vs Marquinhos — el duelo entre el mejor 9 del mundo actual y el mejor central de la Ligue 1",
        pressureZone: "Presión alta bilateral — el partido se decidirá en las transiciones",
        setpieces: "Peligro MUY ALTO — Bayern es el mejor equipo de Europa en set pieces ofensivos. PSG vulnerables en este aspecto.",
        tempo: "Muy alto desde el minuto 1 — ambos equipos preferirán dominar el tempo y ninguno cederá",
      },

      playerAlerts: [
        { name: "Harry Kane", team: "home", type: "racha", detail: "6 partidos seguidos marcando — en la forma de su vida a los 31 años" },
        { name: "Jamal Musiala", team: "home", type: "asistente", detail: "El jugador más técnico del Bayern — clave en espacios reducidos" },
        { name: "Ousmane Dembélé", team: "away", type: "racha", detail: "Mejor temporada de su carrera — elimina rivales 1vs1 con facilidad" },
        { name: "Bradley Barcola", team: "away", type: "goleador", detail: "Revelación de la temporada — 18 goles en Ligue 1 con solo 22 años" },
        { name: "Vitinha", team: "away", type: "asistente", detail: "Mediocampista más dinámico del PSG — su rendimiento define al equipo" },
        { name: "Thomas Müller", team: "home", type: "goleador", detail: "Último Clásico europeo de su carrera — motivación máxima histórica" },
      ],

      bettingAngles: {
        primaryBet: "Victoria Bayern de Múnich (1)",
        primaryRationale: "Historia, localía, Kane en forma, PSG con debilidades defensivas ante pressing alto. Cuota 1.88 ofrece valor.",
        secondaryBet: "Más de 2.5 goles totales",
        secondaryRationale: "75% de H2H supera los 2.5 goles. Ambos tienen los mejores ataques de sus respectivas ligas. Cuota 1.72.",
        avoidBet: "Empate al descanso",
        avoidRationale: "Los partidos Bayern-PSG raramente van al descanso igualados — uno de los dos suele liderar antes del minuto 45.",
        valueRating: 4,
      },

      recommendation: "Victoria Bayern + Más de 2.5 goles",
      confidence: "Alta",
      riskLevel: "Medio",
      isPremium: true,
      predictedScore: "3-1",
      predictedGoals: 3.2,
    },
  },
];
