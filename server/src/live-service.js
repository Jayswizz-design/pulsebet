const sportsDbApiKey = process.env.SPORTSDB_API_KEY || "123";
const sportsDbBaseUrl = `https://www.thesportsdb.com/api/v1/json/${sportsDbApiKey}`;
const scheduledSports = ["Soccer", "Basketball"];

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

function normalizeEvent(event, statusLabel) {
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
    match: `${homeTeam} vs ${awayTeam}`,
    market,
    odds: buildFixtureOdds(homeTeam, awayTeam, market),
    trend: event.strStatus ? `Status: ${event.strStatus}` : `${statusLabel} market moving`,
    boost: statusLabel === "Live" ? "Live Odds" : "Scheduled Odds",
    status: event.strStatus || statusLabel
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

async function fetchScheduledEvents() {
  const dayOffsets = [0, 1, 2];
  const queries = [];

  for (const offset of dayOffsets) {
    const date = getIsoDate(offset);
    for (const sport of scheduledSports) {
      queries.push(fetchSportsDb(`eventsday.php?d=${date}&s=${sport}`));
    }
  }

  const responses = await Promise.all(queries);
  const events = responses.flatMap((payload) => payload.events || []);

  return events
    .filter((event) => event.strHomeTeam && event.strAwayTeam)
    .slice(0, 12)
    .map((event) => normalizeEvent(event, "Scheduled"));
}

export async function getLiveFixtures() {
  try {
    const [soccerLive, basketballLive, scheduledEvents] = await Promise.all([
      fetchSportsDb("eventslivenow.php?s=Soccer"),
      fetchSportsDb("eventslivenow.php?s=Basketball"),
      fetchScheduledEvents()
    ]);

    const liveEvents = [...(soccerLive.events || []), ...(basketballLive.events || [])]
      .filter((event) => event.strHomeTeam && event.strAwayTeam)
      .slice(0, 8)
      .map((event) => normalizeEvent(event, "Live"));

    const mergedFixtures = [...liveEvents];
    for (const fixture of scheduledEvents) {
      if (!mergedFixtures.some((entry) => entry.id === fixture.id)) {
        mergedFixtures.push(fixture);
      }
    }

    if (mergedFixtures.length > 0) {
      return {
        source: liveEvents.length > 0 ? "TheSportsDB Live + Schedule" : "TheSportsDB Schedule",
        fixtures: mergedFixtures,
        live: liveEvents.length > 0
      };
    }
  } catch (error) {
    console.error("SportsDB feed failed", error.message);
  }

  return {
    source: "Feed unavailable",
    fixtures: [],
    live: false
  };
}
