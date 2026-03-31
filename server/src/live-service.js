const sportsDbApiKey = process.env.SPORTSDB_API_KEY || "123";
const sportsDbBaseUrl = `https://www.thesportsdb.com/api/v1/json/${sportsDbApiKey}`;
const sportmonksToken = process.env.SPORTMONKS_API_TOKEN;
const sportmonksBaseUrl = "https://api.sportmonks.com/v3/football";
const sportmonksRoundId = process.env.SPORTMONKS_ROUND_ID || "372147";
const sportmonksFixtureId = process.env.SPORTMONKS_FIXTURE_ID || "19427175";
const scheduledSports = ["Basketball"];
const scheduledDayOffsets = [0, 1, 2, 3, 4, 5, 6];

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

function normalizeScheduledEvent(event, statusLabel) {
  const homeTeam = event.strHomeTeam || "Home";
  const awayTeam = event.strAwayTeam || "Away";
  const sport = event.strSport || "Basketball";
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

function normalizeSportmonksRoundFixture(fixture, leagueName) {
  const participants = getFixtureParticipants(fixture);
  const home = participants.find((participant) => participant.meta?.location === "home") || participants[0];
  const away = participants.find((participant) => participant.meta?.location === "away") || participants[1];
  const homeTeam = home?.name || fixture.name?.split(" vs ")[0] || "Home";
  const awayTeam = away?.name || fixture.name?.split(" vs ")[1] || "Away";
  const [datePart, timePart] = (fixture.starting_at || "").split(" ");

  return {
    id: String(fixture.id),
    sourceId: String(fixture.id),
    league: leagueName || fixture.league?.name || "Football",
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
    trend: "Upcoming odds loaded from Sportmonks",
    boost: "Upcoming Odds",
    status: "Upcoming"
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
    .map((fixture) => normalizeSportmonksRoundFixture(fixture, leagueName));
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
    .filter((event) => isUpcomingDate(event.dateEvent, event.strTime))
    .map((event) => normalizeScheduledEvent(event, "Upcoming"));
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
    const [footballRoundFixtures, scheduledEvents] = await Promise.all([
      fetchSportmonksRoundFixtures(),
      fetchScheduledEvents()
    ]);

    const mergedFixtures = mergeFixtures(footballRoundFixtures, scheduledEvents);
    const fixtures = stripSortDate(sortFixtures(mergedFixtures)).slice(0, 20);

    if (fixtures.length > 0) {
      return {
        source: "Sportmonks Round Odds + Upcoming Schedule",
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
