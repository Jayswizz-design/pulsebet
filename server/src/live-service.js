const sportsDbApiKey = process.env.SPORTSDB_API_KEY || "123";
const sportsDbBaseUrl = `https://www.thesportsdb.com/api/v1/json/${sportsDbApiKey}`;
const sportmonksToken = process.env.SPORTMONKS_API_TOKEN;
const sportmonksBaseUrl = "https://api.sportmonks.com/v3/football";
const sportmonksRoundId = process.env.SPORTMONKS_ROUND_ID || "372147";
const sportmonksFixtureId = process.env.SPORTMONKS_FIXTURE_ID || "19427175";
const sportmonksTopLeagues = (process.env.SPORTMONKS_TOP_LEAGUES || "Premier League,La Liga,Serie A,Bundesliga,Ligue 1,UEFA Champions League")
  .split(",")
  .map((league) => league.trim().toLowerCase())
  .filter(Boolean);
const scheduledSports = ["Soccer", "Basketball", "Tennis", "Handball", "Ice Hockey", "eSports", "MMA"];
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
const randomFootballTeams = [
  "Arsenal",
  "Chelsea",
  "Liverpool",
  "Manchester City",
  "Real Madrid",
  "Barcelona",
  "Bayern Munich",
  "Inter Milan",
  "PSG",
  "Atletico Madrid"
];
const randomFootballLeagues = [
  "Premier League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "Ligue 1"
];

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
    return {
      [`${homeTeam.slice(0, 3).toUpperCase()} -3.5`]: 1.91,
      [`${awayTeam.slice(0, 3).toUpperCase()} +3.5`]: 1.91
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
    "ice hockey": "Ice Hockey",
    esports: "eSports",
    "e-sports": "eSports"
  };
  const sport = normalizedSportMap[rawSport.toLowerCase()] || rawSport;
  const market = sport === "Basketball" ? "Spread" : "Match Winner";

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
    liveScore: null,
    market,
    odds: buildFixtureOdds(homeTeam, awayTeam, market),
    trend: event.strStatus ? `Status: ${event.strStatus}` : `${statusLabel} market moving`,
    boost: "Upcoming Odds",
    status: "Upcoming"
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
    trend: options.trend || `${leagueName} market loaded from Sportmonks`,
    boost: options.boost || "Upcoming Odds",
    status: options.status || fixture.state?.name || fixture.state?.short_name || "Upcoming"
  };
}

function normalizeLineup(lineups, side) {
  return toCollection(lineups)
    .filter((entry) => entry.team?.meta?.location === side || entry.participant?.meta?.location === side)
    .map((entry) => ({
      player: entry.player?.display_name || entry.player?.name || "Unnamed player",
      position: entry.details?.position || entry.type?.name || entry.details?.type?.name || "Role"
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
      homeLogo: null,
      awayLogo: null,
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
  return fixtures.map(({ sortDate, ...fixture }) => fixture);
}

export async function getLiveFixtures() {
  try {
    const [topLeagueFixtures, footballRoundFixtures, sportradarTennisFixtures, scheduledEvents] = await Promise.all([
      fetchSportmonksTopLeagueFixtures(),
      fetchSportmonksRoundFixtures(),
      fetchSportradarTennisFixtures(),
      fetchScheduledEvents()
    ]);

    let mergedFixtures = mergeFixtures(topLeagueFixtures, footballRoundFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, sportradarTennisFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, scheduledEvents);

    const footballFixturesCount = countFixturesBySport(mergedFixtures, "Football");
    const tennisFixturesCount = countFixturesBySport(mergedFixtures, "Tennis");
    const esportsFixturesCount = countFixturesBySport(mergedFixtures, "eSports");
    const handballFixturesCount = countFixturesBySport(mergedFixtures, "Handball");
    const hockeyFixturesCount = countFixturesBySport(mergedFixtures, "Ice Hockey");
    const mmaFixturesCount = countFixturesBySport(mergedFixtures, "MMA");

    const randomFootballFixtures = footballFixturesCount < 8 ? generateRandomTeamFixtures({
      sport: "Football",
      teams: randomFootballTeams,
      leagues: randomFootballLeagues,
      boost: "Upcoming Odds",
      count: 8 - footballFixturesCount
    }) : [];
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
    const randomMmaFixtures = mmaFixturesCount < 6 ? generateRandomMmaFixtures(6 - mmaFixturesCount) : [];

    mergedFixtures = mergeFixtures(mergedFixtures, randomFootballFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomTennisFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomEsportsFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomHandballFixtures);
    mergedFixtures = mergeFixtures(mergedFixtures, randomHockeyFixtures);
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
