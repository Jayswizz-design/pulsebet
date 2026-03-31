const sportsDbApiKey = process.env.SPORTSDB_API_KEY || "123";
const sportsDbBaseUrl = `https://www.thesportsdb.com/api/v1/json/${sportsDbApiKey}`;
const sportmonksToken = process.env.SPORTMONKS_API_TOKEN;
const sportmonksBaseUrl = "https://api.sportmonks.com/v3/football";
const scheduledSports = ["Soccer", "Basketball"];
const scheduledDayOffsets = [0, 1, 2, 3, 4, 5, 6];

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
    return "Live now";
  }

  const relativeDay = formatRelativeDate(dateEvent);
  const normalizedTime = time ? time.slice(0, 5) : null;

  return [relativeDay, normalizedTime].filter(Boolean).join(", ");
}

function normalizeScheduledEvent(event, statusLabel) {
  const homeTeam = event.strHomeTeam || "Home";
  const awayTeam = event.strAwayTeam || "Away";
  const sport = event.strSport || "Football";
  const league = event.strLeague || sport || "Match";
  const market = sport === "Basketball" ? "Spread" : "Match Winner";

  return {
    id: event.idEvent || `${homeTeam}-${awayTeam}-${event.dateEvent || statusLabel}`,
    league,
    sport,
    kickoff: formatKickoff(event.dateEvent, event.strTime),
    sortDate: [event.dateEvent || "9999-12-31", event.strTime || "23:59:59"].join("T"),
    match: `${homeTeam} vs ${awayTeam}`,
    homeTeam,
    awayTeam,
    liveScore: null,
    market,
    odds: buildFixtureOdds(homeTeam, awayTeam, market),
    trend: event.strStatus ? `Status: ${event.strStatus}` : `${statusLabel} market moving`,
    boost: statusLabel === "Live" ? "Live Odds" : "Scheduled Odds",
    status: event.strStatus || statusLabel
  };
}

function extractCurrentScore(scores = []) {
  const currentScores = scores.filter((score) => score.description === "CURRENT");
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

function normalizeSportmonksFixture(fixture) {
  const participants = fixture.participants || [];
  const home = participants.find((participant) => participant.meta?.location === "home") || participants[0];
  const away = participants.find((participant) => participant.meta?.location === "away") || participants[1];
  const homeTeam = home?.name || fixture.name?.split(" vs ")[0] || "Home";
  const awayTeam = away?.name || fixture.name?.split(" vs ")[1] || "Away";
  const league = fixture.league?.name || "Football";
  const startingAt = fixture.starting_at || "";
  const [datePart, timePart] = startingAt.split(" ");
  const stateName = fixture.state?.name || fixture.state?.short_name || "Live";

  return {
    id: String(fixture.id),
    league,
    sport: "Football",
    kickoff: formatKickoff(datePart, timePart),
    sortDate: [datePart || "9999-12-31", timePart || "23:59:59"].join("T"),
    match: `${homeTeam} vs ${awayTeam}`,
    homeTeam,
    awayTeam,
    liveScore: extractCurrentScore(fixture.scores),
    market: "Match Winner",
    odds: buildFixtureOdds(homeTeam, awayTeam, "Match Winner"),
    trend: fixture.result_info || `Status: ${stateName}`,
    boost: "Live Odds",
    status: stateName
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

async function fetchSportmonksInplay() {
  if (!sportmonksToken) {
    return [];
  }

  const url = new URL(`${sportmonksBaseUrl}/livescores/inplay`);
  url.searchParams.set("api_token", sportmonksToken);
  url.searchParams.set("include", "participants;league;state;scores");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sportmonks request failed with ${response.status}`);
  }

  const payload = await response.json();
  const fixtures = Array.isArray(payload.data) ? payload.data : payload.data ? [payload.data] : [];
  return fixtures.map(normalizeSportmonksFixture);
}

async function fetchScheduledEvents() {
  const queries = [];

  for (const offset of scheduledDayOffsets) {
    const date = getIsoDate(offset);
    for (const sport of scheduledSports) {
      queries.push(fetchSportsDb(`eventsday.php?d=${date}&s=${sport}`));
    }
  }

  const responses = await Promise.all(queries);
  const events = responses.flatMap((payload) => payload.events || []);

  return events
    .filter((event) => event.strHomeTeam && event.strAwayTeam)
    .map((event) => normalizeScheduledEvent(event, "Scheduled"));
}

function sortFixtures(fixtures) {
  return fixtures.sort((left, right) => {
    if (left.boost === "Live Odds" && right.boost !== "Live Odds") {
      return -1;
    }

    if (left.boost !== "Live Odds" && right.boost === "Live Odds") {
      return 1;
    }

    return left.sortDate.localeCompare(right.sortDate);
  });
}

function stripSortDate(fixtures) {
  return fixtures.map(({ sortDate, ...fixture }) => fixture);
}

export async function getLiveFixtures() {
  try {
    const [footballInplay, scheduledEvents] = await Promise.all([
      fetchSportmonksInplay(),
      fetchScheduledEvents()
    ]);

    const mergedFixtures = [...footballInplay];
    for (const fixture of scheduledEvents) {
      if (!mergedFixtures.some((entry) => entry.id === fixture.id)) {
        mergedFixtures.push(fixture);
      }
    }

    const fixtures = stripSortDate(sortFixtures(mergedFixtures)).slice(0, 20);

    if (fixtures.length > 0) {
      return {
        source: footballInplay.length > 0 ? "Sportmonks In-Play + Schedule" : "Schedule",
        fixtures,
        live: footballInplay.length > 0
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
