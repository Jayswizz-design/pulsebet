import { fallbackFixtures } from "./data.js";

const sportsDbApiKey = process.env.SPORTSDB_API_KEY || "123";
const sportsDbBaseUrl = `https://www.thesportsdb.com/api/v1/json/${sportsDbApiKey}`;

function buildFixtureOdds(homeTeam, awayTeam) {
  const seed = homeTeam.length + awayTeam.length;
  const home = (1.55 + (seed % 6) * 0.09).toFixed(2);
  const draw = (3.1 + (seed % 5) * 0.12).toFixed(2);
  const away = (2.05 + (seed % 7) * 0.11).toFixed(2);

  return {
    Home: Number(home),
    Draw: Number(draw),
    Away: Number(away)
  };
}

function normalizeLiveEvent(event) {
  const homeTeam = event.strHomeTeam || event.strHomeTeamBadge || "Home";
  const awayTeam = event.strAwayTeam || event.strAwayTeamBadge || "Away";
  const league = event.strLeague || event.strSport || "Live Match";
  const kickoff = [event.dateEvent, event.strTime].filter(Boolean).join(" ").trim() || "Live now";

  return {
    id: event.idEvent || `${homeTeam}-${awayTeam}`,
    league,
    sport: event.strSport || "Football",
    kickoff,
    match: `${homeTeam} vs ${awayTeam}`,
    market: "Match Winner",
    odds: buildFixtureOdds(homeTeam, awayTeam),
    trend: event.strStatus ? `Status: ${event.strStatus}` : "Live market moving",
    boost: "Live Odds",
    status: event.strStatus || "Live"
  };
}

async function fetchSportsDb(endpoint) {
  const response = await fetch(`${sportsDbBaseUrl}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`SportsDB request failed with ${response.status}`);
  }

  return response.json();
}

export async function getLiveFixtures() {
  try {
    const [soccerLive, basketballLive] = await Promise.all([
      fetchSportsDb("eventslivenow.php?s=Soccer"),
      fetchSportsDb("eventslivenow.php?s=Basketball")
    ]);

    const liveEvents = [...(soccerLive.events || []), ...(basketballLive.events || [])]
      .slice(0, 8)
      .map(normalizeLiveEvent);

    if (liveEvents.length > 0) {
      return { source: "TheSportsDB", fixtures: liveEvents, live: true };
    }
  } catch (error) {
    console.error("Live sports fetch failed, falling back to local fixtures", error.message);
  }

  return { source: "Fallback", fixtures: fallbackFixtures, live: false };
}
