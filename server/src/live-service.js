const sportsDbApiKey = process.env.SPORTSDB_API_KEY || "123";
const sportsDbBaseUrl = `https://www.thesportsdb.com/api/v1/json/${sportsDbApiKey}`;
const sportsDbExtraSoccerLeagueIds = (process.env.SPORTSDB_EXTRA_SOCCER_LEAGUES || "4328,4335,4332,4331,4334,4346,4337,4338,4344,4350,4339,4340,4480")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);
const sportmonksToken = process.env.SPORTMONKS_API_TOKEN;
const sportmonksBaseUrl = "https://api.sportmonks.com/v3/football";
const sportmonksRoundId = process.env.SPORTMONKS_ROUND_ID || "372147";
const sportmonksFixtureId = process.env.SPORTMONKS_FIXTURE_ID || "19427175";
const sportmonksTopLeagues = (process.env.SPORTMONKS_TOP_LEAGUES || "Premier League,La Liga,Serie A,Bundesliga,Ligue 1,UEFA Champions League")
  .split(",")
  .map((league) => league.trim().toLowerCase())
  .filter(Boolean);
const scheduledSports = ["Soccer", "Basketball", "Baseball", "Tennis", "Handball", "Ice Hockey", "eSports", "MMA"];
const scheduledDayOffsets = [0, 1, 2, 3, 4, 5, 6];
const sportradarApiKey = process.env.SPORTRADAR_API_KEY;
const sportradarTennisBaseUrl = process.env.SPORTRADAR_TENNIS_BASE_URL || "https://api.sportradar.com/tennis/production/v3";
const sportradarTennisLocale = process.env.SPORTRADAR_TENNIS_LOCALE || "en";
const sportradarTennisCategoryIds = (process.env.SPORTRADAR_TENNIS_CATEGORY_IDS || "3")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);
const randomTennisPlayers = [
  "Novak Djokovic",
  "Carlos Alcaraz",
  "Jannik Sinner",
  "Daniil Medvedev",
  "Alexander Zverev",
  "Stefanos Tsitsipas",
  "Casper Ruud",
  "Andrey Rublev",
  "Holger Rune",
  "Taylor Fritz",
  "Iga Swiatek",
  "Aryna Sabalenka",
  "Coco Gauff",
  "Elena Rybakina",
  "Jessica Pegula",
  "Ons Jabeur"
];
const randomTennisLeagues = [
  "ATP Masters 1000",
  "ATP 500",
  "ATP 250",
  "WTA 1000",
  "WTA 500",
  "Grand Slam"
];
const randomEsportsTeams = [
  "Team Spirit",
  "Natus Vincere",
  "G2 Esports",
  "Fnatic",
  "FaZe Clan",
  "Cloud9",
  "Team Liquid",
  "T1",
  "Gen.G",
  "Evil Geniuses"
];
const randomEsportsLeagues = [
  "ESL Pro League",
  "LCS",
  "LEC",
  "VCT Champions",
  "The International"
];
const randomHandballTeams = [
  "THW Kiel",
  "FC Barcelona Handbol",
  "Paris Handball",
  "Veszprem KC",
  "SC Magdeburg",
  "Pick Szeged",
  "Aalborg Handbold",
  "Montpellier HB"
];
const randomHandballLeagues = [
  "EHF Champions League",
  "Bundesliga Handball",
  "Liga ASOBAL",
  "LNH Division 1"
];
const randomHockeyTeams = [
  "Toronto Maple Leafs",
  "Boston Bruins",
  "New York Rangers",
  "Colorado Avalanche",
  "Tampa Bay Lightning",
  "Edmonton Oilers",
  "Vegas Golden Knights",
  "Dallas Stars"
];
const randomHockeyLeagues = [
  "NHL",
  "AHL",
  "KHL",
  "IIHF Championship"
];
const randomBaseballTeams = [
  "New York Yankees",
  "Los Angeles Dodgers",
  "Atlanta Braves",
  "Houston Astros",
  "Philadelphia Phillies",
  "Chicago Cubs",
  "Boston Red Sox",
  "San Diego Padres"
];
const randomBaseballLeagues = [
  "MLB",
  "NPB",
  "KBO League",
  "Mexican League"
];
const randomMmaFighters = [
  "Israel Adesanya",
  "Alex Pereira",
  "Kamaru Usman",
  "Leon Edwards",
  "Dricus Du Plessis",
  "Sean O'Malley",
  "Islam Makhachev",
  "Charles Oliveira",
  "Alexander Volkanovski",
  "Max Holloway"
];
const randomMmaLeagues = [
  "UFC Fight Night",
  "UFC PPV Main Card",
  "Bellator MMA",
  "PFL Main Event"
];
const randomFootballLeaguePools = {
  "Premier League": [
    "Arsenal",
    "Chelsea",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Tottenham Hotspur",
    "Newcastle United",
    "Aston Villa"
  ],
  "La Liga": [
    "Real Madrid",
    "Barcelona",
    "Atletico Madrid",
    "Sevilla",
    "Real Sociedad",
    "Athletic Club"
  ],
  "Serie A": [
    "Inter Milan",
    "AC Milan",
    "Juventus",
    "Napoli",
    "Roma",
    "Lazio"
  ],
  "UEFA Champions League": [
    "Real Madrid",
    "Barcelona",
    "Bayern Munich",
    "Paris Saint-Germain",
    "Manchester City",
    "Arsenal",
    "Inter Milan",
    "Atletico Madrid"
  ]
};
const basketballApiKey = process.env.BASKETBALL_API_KEY;
const basketballApiHost = process.env.BASKETBALL_API_HOST || "v1.basketball.api-sports.io";
const basketballSeason = process.env.BASKETBALL_SEASON || String(new Date().getUTCFullYear());
const basketballLeagues = (process.env.BASKETBALL_LEAGUES || "12")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);
const randomBasketballTeams = [
  "Boston Celtics",
  "Los Angeles Lakers",
  "Golden State Warriors",
  "Milwaukee Bucks",
  "Denver Nuggets",
  "Miami Heat",
  "Phoenix Suns",
  "Dallas Mavericks"
];
const randomBasketballLeagues = [
  "NBA",
  "EuroLeague",
  "NBL",
  "Liga ACB"
];
const randomBasketballTeamLogos = {
  "Boston Celtics": "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
  "Los Angeles Lakers": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
  "Golden State Warriors": "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
  "Milwaukee Bucks": "https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg",
  "Denver Nuggets": "https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg",
  "Miami Heat": "https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg",
  "Phoenix Suns": "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
  "Dallas Mavericks": "https://upload.wikimedia.org/wikipedia/en/9/97/Dallas_Mavericks_logo.svg"
};

function toCollection(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

function buildFixtureOdds(homeTeam, awayTeam, market = "Match Winner") {
  const seed = homeTeam.length + awayTeam.length;

  if (market === "Spread") {
    const spread = ((seed % 6) + 2.5).toFixed(1);
    const homePrice = (1.78 + (seed % 8) * 0.04).toFixed(2);
    const awayPrice = (1.82 + ((seed + 3) % 8) * 0.04).toFixed(2);
    return {
      [`${homeTeam.slice(0, 3).toUpperCase()} -${spread}`]: Number(homePrice),
      [`${awayTeam.slice(0, 3).toUpperCase()} +${spread}`]: Number(awayPrice)
    };
  }

  const home = (1.55 + (seed % 6) * 0.09).toFixed(2);
  const draw = (3.1 + (seed % 5) * 0.12).toFixed(2);
  const away = (2.05 + (seed % 7) * 0.11).toFixed(2);

  return {
    Home: Number(home),
    Draw: Number(draw),
    Away: Number(away)
  };
}

function formatRelativeDate(dateEvent) {
  if (!dateEvent) {
    return "Live now";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(`${dateEvent}T00:00:00`);
  const dayDiff = Math.round((eventDate.getTime() - today.getTime()) / 86400000);

  if (dayDiff === 0) {
    return "Today";
  }

  if (dayDiff === 1) {
    return "Tomorrow";
  }

  if (dayDiff === 2) {
    return "In 2 days";
  }

  return eventDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short"
  });
}

function formatKickoff(dateEvent, time) {
  if (!dateEvent) {
    return "TBD";
  }

  const relativeDay = formatRelativeDate(dateEvent);
  const normalizedTime = time ? time.slice(0, 5) : null;

  return [relativeDay, normalizedTime].filter(Boolean).join(", ");
}

function parseEventDateTime(datePart, timePart) {
  if (!datePart) {
    return null;
  }

  const normalizedTime = (timePart || "00:00:00").slice(0, 8);
  const isoCandidate = `${datePart}T${normalizedTime}`;
  const parsed = new Date(isoCandidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isUpcomingDate(datePart, timePart) {
  const eventDate = parseEventDateTime(datePart, timePart);
  if (!eventDate) {
    return false;
  }

  return eventDate.getTime() > Date.now();
}

function isTopLeague(leagueName) {
  const normalizedLeague = String(leagueName || "").trim().toLowerCase();
  return sportmonksTopLeagues.some((league) => normalizedLeague === league || normalizedLeague.includes(league) || league.includes(normalizedLeague));
}

function normalizeScheduledEvent(event, statusLabel) {
  const homeTeam = event.strHomeTeam || "Home";
  const awayTeam = event.strAwayTeam || "Away";
  const rawSport = event.strSport || "Basketball";
  const normalizedSportMap = {
    soccer: "Football",
    baseball: "Baseball",
    "ice hockey": "Ice Hockey",
    esports: "eSports",
    "e-sports": "eSports"
  };
  const sport = normalizedSportMap[rawSport.toLowerCase()] || rawSport;
  const market = sport === "Basketball" ? "Spread" : "Match Winner";

  const homeScore = Number(event?.intHomeScore);
  const awayScore = Number(event?.intAwayScore);
  const hasLiveScore = Number.isFinite(homeScore) && Number.isFinite(awayScore);
  const derivedStatus = String(event?.strStatus || statusLabel || "Upcoming");

  return {
    id: event.idEvent || `${homeTeam}-${awayTeam}-${event.dateEvent || statusLabel}`,
    sourceId: String(event.idEvent || `${homeTeam}-${awayTeam}`),
    league: event.strLeague || sport || "Match",
    sport,
    kickoff: formatKickoff(event.dateEvent, event.strTime),
    sortDate: [event.dateEvent || "9999-12-31", event.strTime || "23:59:59"].join("T"),
    match: `${homeTeam} vs ${awayTeam}`,
    homeTeam,
    awayTeam,
    homeLogo: null,
    awayLogo: null,
    liveScore: hasLiveScore ? { home: homeScore, away: awayScore } : null,
    market,
    odds: buildFixtureOdds(homeTeam, awayTeam, market),
    extraMarkets: [],
    trend: event.strStatus ? `Status: ${event.strStatus}` : `${statusLabel} market moving`,
    boost: "Upcoming Odds",
    status: derivedStatus
  };
}

function extractOdds(odds, homeTeam, awayTeam) {
  const oddsList = toCollection(odds);
  if (oddsList.length === 0) {
    return buildFixtureOdds(homeTeam, awayTeam, "Match Winner");
  }

  const selections = {};

  for (const odd of oddsList) {
    const label = odd.label || odd.name || odd.value_name;
    const value = odd.value ?? odd.dp3 ?? odd.odds;
    if (!label || value == null) {
      continue;
    }

    let mappedLabel = label;
    if (label === "1") {
      mappedLabel = "Home";
    } else if (label === "X") {
      mappedLabel = "Draw";
    } else if (label === "2") {
      mappedLabel = "Away";
    }

    selections[mappedLabel] = Number(value);
  }

  return Object.keys(selections).length > 0
    ? selections
    : buildFixtureOdds(homeTeam, awayTeam, "Match Winner");
}

function getFixtureParticipants(fixture) {
  return toCollection(fixture.participants);
}

function getParticipantLogo(participant) {
  return participant?.image_path || participant?.image || participant?.logo_path || null;
}

function extractCurrentScore(scores) {
  const currentScores = toCollection(scores).filter((score) => score.description === "CURRENT");
  if (currentScores.length === 0) {
    return null;
  }

  const home = currentScores.find((score) => score.score?.participant === "home");
  const away = currentScores.find((score) => score.score?.participant === "away");

  return {
    home: home?.score?.goals ?? 0,
    away: away?.score?.goals ?? 0
  };
}

function normalizeSportmonksFixture(fixture, options = {}) {
  const participants = getFixtureParticipants(fixture);
  const home = participants.find((participant) => participant.meta?.location === "home") || participants[0];
  const away = participants.find((participant) => participant.meta?.location === "away") || participants[1];
  const homeTeam = home?.name || fixture.name?.split(" vs ")[0] || "Home";
  const awayTeam = away?.name || fixture.name?.split(" vs ")[1] || "Away";
  const [datePart, timePart] = (fixture.starting_at || "").split(" ");
  const leagueName = options.leagueName || fixture.league?.name || "Football";

  return {
    id: String(fixture.id),
    sourceId: String(fixture.id),
    league: leagueName,
    sport: "Football",
    kickoff: formatKickoff(datePart, timePart),
    sortDate: [datePart || "9999-12-31", timePart || "23:59:59"].join("T"),
    match: `${homeTeam} vs ${awayTeam}`,
    homeTeam,
    awayTeam,
    homeLogo: getParticipantLogo(home),
    awayLogo: getParticipantLogo(away),
    liveScore: null,
    market: "Match Winner",
    odds: extractOdds(fixture.odds, homeTeam, awayTeam),
    extraMarkets: extractExtraMarkets(fixture.odds),
    trend: options.trend || `${leagueName} market loaded from Sportmonks`,
    boost: options.boost || "Upcoming Odds",
    status: options.status || fixture.state?.name || fixture.state?.short_name || "Upcoming"
  };
}

function pushUniqueMarket(collection, label, price) {
  const normalizedLabel = String(label || "").trim();
  const parsedPrice = Number(price);
  if (!normalizedLabel || !Number.isFinite(parsedPrice) || parsedPrice <= 1) {
    return;
  }
  if (collection.some((entry) => entry.label === normalizedLabel)) {
    return;
  }
  collection.push({ label: normalizedLabel, price: Number(parsedPrice.toFixed(2)) });
}

function extractExtraMarkets(odds) {
  const oddsList = toCollection(odds);
  const markets = [];

  for (const odd of oddsList) {
    const baseLabel = String(odd?.label || odd?.name || odd?.value_name || "").trim();
    const marketName = String(odd?.market?.name || odd?.market_name || "").toLowerCase();
    const rawPrice = odd?.value ?? odd?.dp3 ?? odd?.odd ?? odd?.odds;
    const labelLower = baseLabel.toLowerCase();

    if (!baseLabel || rawPrice == null) {
      continue;
    }

    if (marketName.includes("double chance")) {
      pushUniqueMarket(markets, `Double Chance ${baseLabel.toUpperCase()}`, rawPrice);
      continue;
    }

    if (marketName.includes("over") || marketName.includes("under") || labelLower.startsWith("over") || labelLower.startsWith("under")) {
      pushUniqueMarket(markets, baseLabel, rawPrice);
      continue;
    }

    if (marketName.includes("both teams to score") || labelLower === "yes" || labelLower === "no") {
      const mapped = labelLower === "yes" ? "BTTS Yes" : labelLower === "no" ? "BTTS No" : baseLabel;
      pushUniqueMarket(markets, mapped, rawPrice);
    }
  }

  return markets.slice(0, 8);
}

function normalizeLineup(lineups, side) {
  return toCollection(lineups)
    .filter((entry) => entry.team?.meta?.location === side || entry.participant?.meta?.location === side)
    .map((entry) => ({
      player: entry.player?.display_name || entry.player?.name || "Unnamed player",
      position: entry.details?.position || entry.type?.name || entry.details?.type?.name || "Role",
      image: entry.player?.image_path || entry.player?.image || entry.player?.photo || null
    }))
    .slice(0, 11);
}

function normalizeCoaches(coaches) {
  return toCollection(coaches).map((coach) => ({
    name: coach.name || coach.fullname || "Coach",
    nationality: coach.nationality || coach.country?.name || null,
    team: coach.team?.name || coach.participant?.name || null
  }));
}

function normalizeMetadata(metadata) {
  return toCollection(metadata)
    .map((item) => item.type?.name || item.type?.code || item.value || item.description)
    .filter(Boolean)
    .slice(0, 6);
}

function normalizeFixtureDetails(fixture) {
  const participants = getFixtureParticipants(fixture);
  const home = participants.find((participant) => participant.meta?.location === "home") || participants[0];
  const away = participants.find((participant) => participant.meta?.location === "away") || participants[1];
  const homeTeam = home?.name || fixture.name?.split(" vs ")[0] || "Home";
  const awayTeam = away?.name || fixture.name?.split(" vs ")[1] || "Away";
  const [datePart, timePart] = (fixture.starting_at || "").split(" ");
  const score = extractCurrentScore(fixture.scores);

  return {
    id: String(fixture.id),
    league: fixture.league?.name || "Football",
    country: fixture.league?.country?.name || null,
    venue: fixture.venue?.name || "Venue TBC",
    city: fixture.venue?.city_name || null,
    kickoff: formatKickoff(datePart, timePart),
    state: fixture.state?.name || fixture.state?.short_name || "Scheduled",
    referee: fixture.referee?.name || null,
    attendance: fixture.attendance || null,
    homeTeam,
    awayTeam,
    homeLogo: getParticipantLogo(home),
    awayLogo: getParticipantLogo(away),
    score,
    homeLineup: normalizeLineup(fixture.lineups, "home"),
    awayLineup: normalizeLineup(fixture.lineups, "away"),
    coaches: normalizeCoaches(fixture.coaches),
    metadata: normalizeMetadata(fixture.metadata)
  };
}

function getIsoDate(offsetDays = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

async function fetchSportsDb(endpoint) {
  const response = await fetch(`${sportsDbBaseUrl}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`SportsDB request failed with ${response.status}`);
  }

  return response.json();
}

function buildTwoWayOdds(homeTeam, awayTeam) {
  const seed = homeTeam.length + awayTeam.length;
  const home = (1.45 + (seed % 7) * 0.08).toFixed(2);
  const away = (1.55 + (seed % 6) * 0.09).toFixed(2);

  return {
    Home: Number(home),
    Away: Number(away)
  };
}

function toDateTimeParts(value) {
  if (!value) {
    return { datePart: null, timePart: null, sortDate: "9999-12-31T23:59:59" };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { datePart: null, timePart: null, sortDate: "9999-12-31T23:59:59" };
  }

  const datePart = date.toISOString().slice(0, 10);
  const timePart = date.toISOString().slice(11, 19);
  return {
    datePart,
    timePart,
    sortDate: `${datePart}T${timePart}`
  };
}

function normalizeSportradarTennisSummary(summary, competitionMap) {
  const event = summary?.sport_event || summary;
  const competitors = toCollection(event?.competitors || summary?.competitors);

  const home = competitors.find((competitor) => competitor.qualifier === "home") || competitors[0];
  const away = competitors.find((competitor) => competitor.qualifier === "away") || competitors[1];

  if (!home?.name || !away?.name) {
    return null;
  }

  const { datePart, timePart, sortDate } = toDateTimeParts(event?.start_time || summary?.scheduled);
  const competitionId = event?.sport_event_context?.competition?.id;
  const competitionName = event?.sport_event_context?.competition?.name || competitionMap.get(competitionId) || "Tennis";
  const status = summary?.sport_event_status?.status || summary?.sport_event_status?.match_status || "Scheduled";

  return {
    id: String(event?.id || summary?.id || `${home.name}-${away.name}-${sortDate}`),
    sourceId: String(event?.id || summary?.id || `${home.name}-${away.name}`),
    league: competitionName,
    sport: "Tennis",
    kickoff: formatKickoff(datePart, timePart),
    sortDate,
    match: `${home.name} vs ${away.name}`,
    homeTeam: home.name,
    awayTeam: away.name,
    homeLogo: null,
    awayLogo: null,
    liveScore: null,
    market: "Match Winner",
    odds: buildTwoWayOdds(home.name, away.name),
    trend: `Status: ${status}`,
    boost: "Sportradar Tennis",
    status: status === "not_started" ? "Upcoming" : String(status).replace(/_/g, " ")
  };
}

async function fetchSportradarJson(endpoint) {
  const url = `${sportradarTennisBaseUrl}/${sportradarTennisLocale}/${endpoint}.json`;
  const response = await fetch(url, {
    headers: {
      "x-api-key": sportradarApiKey
    }
  });

  if (!response.ok) {
    throw new Error(`Sportradar request failed with ${response.status}`);
  }

  return response.json();
}

async function fetchSportradarCompetitionMap() {
  if (!sportradarApiKey) {
    return new Map();
  }

  const map = new Map();
  const requests = sportradarTennisCategoryIds.map(async (categoryId) => {
    try {
      const payload = await fetchSportradarJson(`categories/${categoryId}/competitions`);
      for (const competition of toCollection(payload?.competitions)) {
        if (competition?.id && competition?.name) {
          map.set(competition.id, competition.name);
        }
      }
    } catch (_error) {
      // Ignore per-category failures to keep feed resilient.
    }
  });

  await Promise.all(requests);
  return map;
}

async function fetchSportradarTennisFixtures() {
  if (!sportradarApiKey) {
    return [];
  }

  try {
    const competitionMap = await fetchSportradarCompetitionMap();

    const requests = scheduledDayOffsets.map(async (offset) => {
      const date = getIsoDate(offset);
      const payload = await fetchSportradarJson(`schedules/${date}/summaries`);
      const summaries = toCollection(payload?.summaries || payload?.sport_events || payload?.events);

      return summaries
        .map((summary) => normalizeSportradarTennisSummary(summary, competitionMap))
        .filter(Boolean)
        .filter((fixture) => {
          const [datePart, timePart] = fixture.sortDate.split("T");
          return isUpcomingDate(datePart, timePart);
        });
    });

    const fixtures = (await Promise.all(requests)).flat();
    return fixtures;
  } catch (error) {
    console.error("Sportradar tennis feed failed", error.message);
    return [];
  }
}

async function fetchSportmonksTopLeagueFixtures() {
  if (!sportmonksToken) {
    return [];
  }

  const requests = scheduledDayOffsets.map(async (offset) => {
    const date = getIsoDate(offset);
    const url = new URL(`${sportmonksBaseUrl}/fixtures/date/${date}`);
    url.searchParams.set("api_token", sportmonksToken);
    url.searchParams.set("include", "participants;league;state;odds.market;odds.bookmaker");
    url.searchParams.set("filters", "markets:1;bookmakers:2");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Sportmonks date request failed with ${response.status}`);
    }

    const payload = await response.json();
    return toCollection(payload.data)
      .filter((fixture) => {
        const [datePart, timePart] = (fixture.starting_at || "").split(" ");
        return isUpcomingDate(datePart, timePart) && isTopLeague(fixture.league?.name);
      })
      .map((fixture) => normalizeSportmonksFixture(fixture, {
        trend: `${fixture.league?.name || "Top league"} upcoming market loaded from Sportmonks`,
        boost: "Top League Odds",
        status: "Upcoming"
      }));
  });

  const responses = await Promise.all(requests);
  return responses.flat();
}

async function fetchSportmonksRoundFixtures() {
  if (!sportmonksToken) {
    return [];
  }

  const url = new URL(`${sportmonksBaseUrl}/rounds/${sportmonksRoundId}`);
  url.searchParams.set("api_token", sportmonksToken);
  url.searchParams.set("include", "fixtures.odds.market;fixtures.odds.bookmaker;fixtures.participants;league.country");
  url.searchParams.set("filters", "markets:1;bookmakers:2");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sportmonks round request failed with ${response.status}`);
  }

  const payload = await response.json();
  const round = payload.data || {};
  const leagueName = round.league?.name;
  const fixtures = toCollection(round.fixtures);

  return fixtures
    .filter((fixture) => {
      const [datePart, timePart] = (fixture.starting_at || "").split(" ");
      return isUpcomingDate(datePart, timePart);
    })
    .map((fixture) => normalizeSportmonksFixture(fixture, {
      leagueName,
      trend: "Upcoming odds loaded from Sportmonks round market",
      boost: "Round Odds",
      status: "Upcoming"
    }));
}

async function fetchScheduledEvents() {
  const queries = [];

  for (const offset of scheduledDayOffsets) {
    const date = getIsoDate(offset);
    for (const sport of scheduledSports) {
      queries.push(fetchSportsDb(`eventsday.php?d=${date}&s=${sport}`));
    }
  }

  const settledResponses = await Promise.allSettled(queries);
  const responses = settledResponses
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const events = responses.flatMap((payload) => payload.events || []);

  return events
    .filter((event) => event.strHomeTeam && event.strAwayTeam)
    .filter((event) => isUpcomingDate(event.dateEvent, event.strTime))
    .map((event) => normalizeScheduledEvent(event, "Upcoming"));
}

async function fetchSportsDbLiveEvents() {
  const liveSports = ["Soccer", "Basketball", "Baseball", "Tennis", "Ice Hockey"];
  const requests = liveSports.map((sport) => fetchSportsDb(`livescore.php?s=${encodeURIComponent(sport)}`));
  const settledResponses = await Promise.allSettled(requests);
  const responses = settledResponses
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const events = responses.flatMap((payload) => payload.events || []);
  return events
    .filter((event) => event.strHomeTeam && event.strAwayTeam)
    .map((event) => normalizeScheduledEvent(event, "Live"));
}

async function fetchSportsDbExtraLeagueEvents() {
  const requests = sportsDbExtraSoccerLeagueIds.map((leagueId) =>
    fetchSportsDb(`eventsnextleague.php?id=${leagueId}`)
  );

  const settledResponses = await Promise.allSettled(requests);
  const responses = settledResponses
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const events = responses.flatMap((payload) => payload.events || []);

  return events
    .filter((event) => event.strHomeTeam && event.strAwayTeam)
    .filter((event) => isUpcomingDate(event.dateEvent, event.strTime))
    .map((event) => normalizeScheduledEvent(event, "Upcoming"));
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomTennisFixtures(count = 8) {
  const usedMatches = new Set();
  const fixtures = [];

  for (let index = 0; index < count; index += 1) {
    let homeTeam = pickRandom(randomTennisPlayers);
    let awayTeam = pickRandom(randomTennisPlayers);

    while (homeTeam === awayTeam) {
      awayTeam = pickRandom(randomTennisPlayers);
    }

    const pairKey = [homeTeam, awayTeam].sort().join("::");
    if (usedMatches.has(pairKey)) {
      continue;
    }
    usedMatches.add(pairKey);

    const offset = index % 7;
    const datePart = getIsoDate(offset);
    const hour = String(10 + (index % 10)).padStart(2, "0");
    const minute = index % 2 === 0 ? "00" : "30";
    const timePart = `${hour}:${minute}:00`;

    fixtures.push({
      id: `rnd-tennis-${datePart}-${index}`,
      sourceId: `rnd-tennis-${datePart}-${index}`,
      league: pickRandom(randomTennisLeagues),
      sport: "Tennis",
      kickoff: formatKickoff(datePart, timePart),
      sortDate: `${datePart}T${timePart}`,
      match: `${homeTeam} vs ${awayTeam}`,
      homeTeam,
      awayTeam,
      homeLogo: null,
      awayLogo: null,
      liveScore: null,
      market: "Match Winner",
      odds: buildTwoWayOdds(homeTeam, awayTeam),
      trend: "Random tennis market stream",
      boost: "Upcoming Odds",
      status: "Upcoming"
    });
  }

  return fixtures;
}

function generateRandomFootballFixtures(count = 8) {
  const fixtures = [];
  const usedMatches = new Set();
  const leagues = Object.keys(randomFootballLeaguePools);

  for (let index = 0; index < count; index += 1) {
    const league = leagues[index % leagues.length];
    const teams = randomFootballLeaguePools[league] || [];
    if (teams.length < 2) {
      continue;
    }

    let homeTeam = pickRandom(teams);
    let awayTeam = pickRandom(teams);
    while (homeTeam === awayTeam) {
      awayTeam = pickRandom(teams);
    }

    const pairKey = `${league}::${[homeTeam, awayTeam].sort().join("::")}`;
    if (usedMatches.has(pairKey)) {
      continue;
    }
    usedMatches.add(pairKey);

    const offset = index % 7;
    const datePart = getIsoDate(offset);
    const hour = String(16 + (index % 6)).padStart(2, "0");
    const minute = index % 2 === 0 ? "00" : "30";
    const timePart = `${hour}:${minute}:00`;

    fixtures.push({
      id: `rnd-football-${league.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${datePart}-${index}`,
      sourceId: `rnd-football-${league.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${datePart}-${index}`,
      league,
      sport: "Football",
      kickoff: formatKickoff(datePart, timePart),
      sortDate: `${datePart}T${timePart}`,
      match: `${homeTeam} vs ${awayTeam}`,
      homeTeam,
      awayTeam,
      homeLogo: null,
      awayLogo: null,
      liveScore: null,
      market: "Match Winner",
      odds: buildFixtureOdds(homeTeam, awayTeam, "Match Winner"),
      trend: `${league} random market stream`,
      boost: league === "UEFA Champions League" ? "UCL Odds" : "Upcoming Odds",
      status: "Upcoming"
    });
  }

  return fixtures;
}

function generateRandomTeamFixtures({ sport, teams, leagues, boost, count = 6 }) {
  const usedMatches = new Set();
  const fixtures = [];

  for (let index = 0; index < count; index += 1) {
    let homeTeam = pickRandom(teams);
    let awayTeam = pickRandom(teams);

    while (homeTeam === awayTeam) {
      awayTeam = pickRandom(teams);
    }

    const pairKey = [homeTeam, awayTeam].sort().join("::");
    if (usedMatches.has(pairKey)) {
      continue;
    }
    usedMatches.add(pairKey);

    const offset = index % 7;
    const datePart = getIsoDate(offset);
    const hour = String(11 + (index % 9)).padStart(2, "0");
    const minute = index % 2 === 0 ? "15" : "45";
    const timePart = `${hour}:${minute}:00`;
    const market = sport === "Basketball" ? "Spread" : "Match Winner";

    fixtures.push({
      id: `rnd-${sport.toLowerCase().replace(/\s+/g, "-")}-${datePart}-${index}`,
      sourceId: `rnd-${sport.toLowerCase().replace(/\s+/g, "-")}-${datePart}-${index}`,
      league: pickRandom(leagues),
      sport,
      kickoff: formatKickoff(datePart, timePart),
      sortDate: `${datePart}T${timePart}`,
      match: `${homeTeam} vs ${awayTeam}`,
      homeTeam,
      awayTeam,
      homeLogo: sport === "Basketball" ? randomBasketballTeamLogos[homeTeam] || null : null,
      awayLogo: sport === "Basketball" ? randomBasketballTeamLogos[awayTeam] || null : null,
      liveScore: null,
      market,
      odds: buildFixtureOdds(homeTeam, awayTeam, market),
      trend: `Random ${sport} market stream`,
      boost,
      status: "Upcoming"
    });
  }

  return fixtures;
}

function countFixturesBySport(fixtures, sport) {
  return fixtures.filter((fixture) => fixture.sport === sport).length;
}

function generateRandomMmaFixtures(count = 6) {
  const usedMatches = new Set();
  const fixtures = [];

  for (let index = 0; index < count; index += 1) {
    let homeTeam = pickRandom(randomMmaFighters);
    let awayTeam = pickRandom(randomMmaFighters);

    while (homeTeam === awayTeam) {
      awayTeam = pickRandom(randomMmaFighters);
    }

    const pairKey = [homeTeam, awayTeam].sort().join("::");
    if (usedMatches.has(pairKey)) {
      continue;
    }
    usedMatches.add(pairKey);

    const offset = index % 7;
    const datePart = getIsoDate(offset);
    const hour = String(19 + (index % 3)).padStart(2, "0");
    const minute = index % 2 === 0 ? "00" : "30";
    const timePart = `${hour}:${minute}:00`;

    fixtures.push({
      id: `rnd-mma-${datePart}-${index}`,
      sourceId: `rnd-mma-${datePart}-${index}`,
      league: pickRandom(randomMmaLeagues),
      sport: "MMA",
      kickoff: formatKickoff(datePart, timePart),
      sortDate: `${datePart}T${timePart}`,
      match: `${homeTeam} vs ${awayTeam}`,
      homeTeam,
      awayTeam,
      homeLogo: null,
      awayLogo: null,
      liveScore: null,
      market: "Match Winner",
      odds: buildTwoWayOdds(homeTeam, awayTeam),
      trend: "Random MMA market stream",
      boost: "Upcoming Odds",
      status: "Upcoming"
    });
  }

  return fixtures;
}

function mergeFixtures(primaryFixtures, additionalFixtures) {
  const merged = [...primaryFixtures];

  for (const fixture of additionalFixtures) {
    const existing = merged.find((entry) => entry.sourceId === fixture.sourceId || entry.id === fixture.id);
    if (!existing) {
      merged.push(fixture);
      continue;
    }

    if (fixture.odds && Object.keys(fixture.odds).length > 0) {
      existing.odds = fixture.odds;
    }
  }

  return merged;
}

function sortFixtures(fixtures) {
  return fixtures.sort((left, right) => left.sortDate.localeCompare(right.sortDate));
}

function stripSortDate(fixtures) {
  return fixtures.map(({ sortDate, ...fixture }) => {
    const hasValidSortDate = typeof sortDate === "string" && !sortDate.startsWith("9999-12-31");
    return {
      ...fixture,
      startsAt: hasValidSortDate ? new Date(sortDate).toISOString() : null
    };
  });
}

async function fetchBasketballApi(pathname, searchParams = {}) {
  const url = new URL(`https://${basketballApiHost}${pathname}`);
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value != null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      "x-rapidapi-key": basketballApiKey,
      "x-rapidapi-host": basketballApiHost
    }
  });

  if (!response.ok) {
    throw new Error(`Basketball API request failed with ${response.status}`);
  }

  return response.json();
}

function normalizeBasketballGame(game, oddsByGame = new Map()) {
  const homeTeam = game?.teams?.home?.name || "Home";
  const awayTeam = game?.teams?.away?.name || "Away";
  const statusLong = game?.status?.long || game?.status?.short || "Scheduled";
  const [datePart, timePart] = toDateTimeParts(game?.date).sortDate.split("T");
  const gameId = String(game?.id || `${homeTeam}-${awayTeam}-${datePart}`);
  const linkedOdds = oddsByGame.get(gameId);

  return {
    id: `basketball-${gameId}`,
    sourceId: `basketball-${gameId}`,
    league: game?.league?.name || "Basketball",
    sport: "Basketball",
    kickoff: formatKickoff(datePart, timePart),
    sortDate: `${datePart || "9999-12-31"}T${timePart || "23:59:59"}`,
    match: `${homeTeam} vs ${awayTeam}`,
    homeTeam,
    awayTeam,
    homeLogo: game?.teams?.home?.logo || null,
    awayLogo: game?.teams?.away?.logo || null,
    liveScore: game?.scores?.home?.total != null && game?.scores?.away?.total != null
      ? { home: Number(game.scores.home.total), away: Number(game.scores.away.total) }
      : null,
    market: "Moneyline",
    odds: linkedOdds || buildTwoWayOdds(homeTeam, awayTeam),
    extraMarkets: Array.isArray(linkedOdds?.extraMarkets) ? linkedOdds.extraMarkets : [],
    trend: `Status: ${statusLong}`,
    boost: linkedOdds ? "Basketball Odds" : "Basketball Schedule",
    status: statusLong
  };
}

function normalizeOddLabel(value) {
  const label = String(value || "").trim().toLowerCase();
  if (!label) {
    return "";
  }

  if (["home", "1", "h"].includes(label)) {
    return "Home";
  }
  if (["away", "2", "a"].includes(label)) {
    return "Away";
  }
  return "";
}

function extractBasketballMoneylineOdds(item) {
  const bookmakers = toCollection(item?.bookmakers);
  const extraMarkets = [];
  for (const bookmaker of bookmakers) {
    const bets = toCollection(bookmaker?.bets);
    for (const bet of bets) {
      const betName = String(bet?.name || bet?.label || "").toLowerCase();
      const looksLikeMoneyline = betName.includes("winner")
        || betName.includes("moneyline")
        || betName.includes("match result");

      const values = toCollection(bet?.values);
      if (betName.includes("over") || betName.includes("under") || betName.includes("total")) {
        for (const selection of values) {
          const price = Number(selection?.odd);
          const label = String(selection?.value || "").trim();
          if (label && Number.isFinite(price) && price > 1) {
            pushUniqueMarket(extraMarkets, label, price);
          }
        }
      }

      if (!looksLikeMoneyline) {
        continue;
      }

      let homeOdd = null;
      let awayOdd = null;
      for (const selection of values) {
        const side = normalizeOddLabel(selection?.value);
        const odd = Number(selection?.odd);
        if (!Number.isFinite(odd) || odd <= 1) {
          continue;
        }
        if (side === "Home") {
          homeOdd = odd;
        } else if (side === "Away") {
          awayOdd = odd;
        }
      }

      if (homeOdd && awayOdd) {
        return { Home: homeOdd, Away: awayOdd, extraMarkets: extraMarkets.slice(0, 8) };
      }
    }
  }

  return extraMarkets.length ? { Home: null, Away: null, extraMarkets: extraMarkets.slice(0, 8) } : null;
}

async function fetchBasketballFixtures() {
  if (!basketballApiKey) {
    return [];
  }

  try {
    const dayRequests = [];
    const oddsRequests = [];

    for (const offset of scheduledDayOffsets) {
      const date = getIsoDate(offset);

      for (const league of basketballLeagues) {
        dayRequests.push(
          fetchBasketballApi("/games", { date, season: basketballSeason, league })
        );
        oddsRequests.push(
          fetchBasketballApi("/odds", { date, season: basketballSeason, league })
        );
      }
    }

    const [gamesSettled, oddsSettled] = await Promise.all([
      Promise.allSettled(dayRequests),
      Promise.allSettled(oddsRequests)
    ]);

    const games = gamesSettled
      .filter((entry) => entry.status === "fulfilled")
      .flatMap((entry) => toCollection(entry.value?.response));
    const oddsItems = oddsSettled
      .filter((entry) => entry.status === "fulfilled")
      .flatMap((entry) => toCollection(entry.value?.response));

    const oddsByGame = new Map();
    for (const item of oddsItems) {
      const gameId = String(item?.game?.id || item?.id || "");
      const extractedOdds = extractBasketballMoneylineOdds(item);
      if (!gameId || !extractedOdds) {
        continue;
      }

      if (Number.isFinite(extractedOdds.Home) && Number.isFinite(extractedOdds.Away)) {
        oddsByGame.set(gameId, extractedOdds);
      } else if (Array.isArray(extractedOdds.extraMarkets) && extractedOdds.extraMarkets.length > 0) {
        const existing = oddsByGame.get(gameId) || {};
        oddsByGame.set(gameId, {
          ...existing,
          extraMarkets: extractedOdds.extraMarkets
        });
      }
    }

    return games
      .map((game) => normalizeBasketballGame(game, oddsByGame))
      .filter((fixture) => {
        const [datePart, timePart] = fixture.sortDate.split("T");
        return isUpcomingDate(datePart, timePart) || Boolean(fixture.liveScore);
      });
  } catch (error) {
    console.error("Basketball API feed failed", error.message);
    return [];
  }
}

export async function getLiveFixtures() {
  try {
    const [topLeagueFixtures, footballRoundFixtures, sportradarTennisFixtures, basketballFixtures, liveEvents, scheduledEvents, extraLeagueEvents] = await Promise.all([
      fetchSportmonksTopLeagueFixtures(),
      fetchSportmonksRoundFixtures(),
      fetchSportradarTennisFixtures(),
      fetchBasketballFixtures(),
      fetchSportsDbLiveEvents(),
      fetchScheduledEvents(),
      fetchSportsDbExtraLeagueEvents()
    ]);

    let mergedFixtures = mergeFixtures(topLeagueFixtures, footballRoundFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, sportradarTennisFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, basketballFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, liveEvents);
    mergedFixtures = mergeFixtures(mergedFixtures, scheduledEvents);
    mergedFixtures = mergeFixtures(mergedFixtures, extraLeagueEvents);

    const footballFixturesCount = countFixturesBySport(mergedFixtures, "Football");
    const tennisFixturesCount = countFixturesBySport(mergedFixtures, "Tennis");
    const esportsFixturesCount = countFixturesBySport(mergedFixtures, "eSports");
    const handballFixturesCount = countFixturesBySport(mergedFixtures, "Handball");
    const hockeyFixturesCount = countFixturesBySport(mergedFixtures, "Ice Hockey");
    const baseballFixturesCount = countFixturesBySport(mergedFixtures, "Baseball");
    const mmaFixturesCount = countFixturesBySport(mergedFixtures, "MMA");
    const basketballFixturesCount = countFixturesBySport(mergedFixtures, "Basketball");

    const randomFootballFixtures = footballFixturesCount < 8 ? generateRandomFootballFixtures(8 - footballFixturesCount) : [];
    const randomTennisFixtures = tennisFixturesCount < 6 ? generateRandomTennisFixtures(6 - tennisFixturesCount) : [];
    const randomEsportsFixtures = esportsFixturesCount < 6 ? generateRandomTeamFixtures({
      sport: "eSports",
      teams: randomEsportsTeams,
      leagues: randomEsportsLeagues,
      boost: "Upcoming Odds",
      count: 6 - esportsFixturesCount
    }) : [];
    const randomHandballFixtures = handballFixturesCount < 6 ? generateRandomTeamFixtures({
      sport: "Handball",
      teams: randomHandballTeams,
      leagues: randomHandballLeagues,
      boost: "Upcoming Odds",
      count: 6 - handballFixturesCount
    }) : [];
    const randomHockeyFixtures = hockeyFixturesCount < 6 ? generateRandomTeamFixtures({
      sport: "Ice Hockey",
      teams: randomHockeyTeams,
      leagues: randomHockeyLeagues,
      boost: "Upcoming Odds",
      count: 6 - hockeyFixturesCount
    }) : [];
    const randomBaseballFixtures = baseballFixturesCount < 6 ? generateRandomTeamFixtures({
      sport: "Baseball",
      teams: randomBaseballTeams,
      leagues: randomBaseballLeagues,
      boost: "Upcoming Odds",
      count: 6 - baseballFixturesCount
    }) : [];
    const randomBasketballFixtures = basketballFixturesCount < 7 ? generateRandomTeamFixtures({
      sport: "Basketball",
      teams: randomBasketballTeams,
      leagues: randomBasketballLeagues,
      boost: "Upcoming Odds",
      count: 7 - basketballFixturesCount
    }) : [];
    const randomMmaFixtures = mmaFixturesCount < 6 ? generateRandomMmaFixtures(6 - mmaFixturesCount) : [];

    mergedFixtures = mergeFixtures(mergedFixtures, randomFootballFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomTennisFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomEsportsFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomHandballFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomHockeyFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomBaseballFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomBasketballFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomMmaFixtures);

    const fixtures = stripSortDate(sortFixtures(mergedFixtures)).slice(0, 84);

    if (fixtures.length > 0) {
      return {
        source: "Live Multi-Sport Feed",
        fixtures,
        live: false
      };
    }
  } catch (error) {
    console.error("Live feed failed", error.message);
  }

  return {
    source: "Feed unavailable",
    fixtures: [],
    live: false
  };
}

export async function getFeaturedFixtureDetails() {
  if (!sportmonksToken) {
    return {
      available: false,
      message: "SPORTMONKS_API_TOKEN is not configured.",
      fixture: null
    };
  }

  try {
    const url = new URL(`${sportmonksBaseUrl}/fixtures/${sportmonksFixtureId}`);
    url.searchParams.set("api_token", sportmonksToken);
    url.searchParams.set(
      "include",
      "participants;league;venue;state;scores;lineups.player;lineups.type;lineups.details.type;metadata.type;coaches"
    );

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Sportmonks fixture request failed with ${response.status}`);
    }

    const payload = await response.json();
    const fixture = payload.data;

    if (!fixture) {
      return {
        available: false,
        message: "Fixture details unavailable.",
        fixture: null
      };
    }

    return {
      available: true,
      message: null,
      fixture: normalizeFixtureDetails(fixture)
    };
  } catch (error) {
    console.error("Fixture detail feed failed", error.message);
    return {
      available: false,
      message: "Fixture details unavailable.",
      fixture: null
    };
  }
}
