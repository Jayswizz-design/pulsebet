import { memo, useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  useLocation,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

const liveCacheKey = "pulsebet-live-cache-v1";
const configuredApiBase = import.meta.env.VITE_API_URL;

function resolveApiBase() {
  if (configuredApiBase) {
    return configuredApiBase;
  }

  if (typeof window === "undefined") {
    return "http://localhost:4000";
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:4000";
  }

  return "https://pulsebet-api.onrender.com";
}

const apiBase = resolveApiBase();
const navItems = [
  { to: "/", label: "Sportsbook" },
  { to: "/virtual", label: "Virtual Games" }
];
const promoAccentClass = {
  sunrise: "from-amber-300/30",
  field: "from-emerald-300/25",
  ember: "from-orange-400/25"
};

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0
});
const clubLogos = {
  Arsenal: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  Liverpool: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  Barcelona: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "Atletico Madrid": "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg",
  "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  Chelsea: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  "Manchester City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Manchester United": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "Tottenham Hotspur": "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  "Newcastle United": "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
  "Aston Villa": "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_FC_new_crest.svg",
  Juventus: "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg",
  "Inter Milan": "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg",
  "AC Milan": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
  Napoli: "https://upload.wikimedia.org/wikipedia/commons/0/00/SSC_Napoli_2024_%28deep_blue_n%29.svg",
  Roma: "https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg",
  Lazio: "https://upload.wikimedia.org/wikipedia/en/c/ce/S.S._Lazio_badge.svg",
  "Paris Saint-Germain": "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  "Bayern Munich": "https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg",
  Dortmund: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
  "RB Leipzig": "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg",
  Sevilla: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg",
  "Real Sociedad": "https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg",
  "Athletic Club": "https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg",
  "Ajax": "https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg",
  "Benfica": "https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg",
  "Porto": "https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg",
  "Sporting CP": "https://upload.wikimedia.org/wikipedia/en/3/3e/Sporting_Clube_de_Portugal.svg",
  Monaco: "https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg",
  "Toronto Maple Leafs": "https://upload.wikimedia.org/wikipedia/en/b/b6/Toronto_Maple_Leafs_2016_logo.svg",
  "Boston Bruins": "https://upload.wikimedia.org/wikipedia/en/1/12/Boston_Bruins.svg",
  "New York Rangers": "https://upload.wikimedia.org/wikipedia/en/a/ae/New_York_Rangers.svg",
  "Colorado Avalanche": "https://upload.wikimedia.org/wikipedia/en/4/45/Colorado_Avalanche_logo.svg",
  "Tampa Bay Lightning": "https://upload.wikimedia.org/wikipedia/en/2/2f/Tampa_Bay_Lightning_2011.svg",
  "Edmonton Oilers": "https://upload.wikimedia.org/wikipedia/en/4/4d/Logo_Edmonton_Oilers.svg",
  "Vegas Golden Knights": "https://upload.wikimedia.org/wikipedia/en/a/ac/Vegas_Golden_Knights_logo.svg",
  "Dallas Stars": "https://upload.wikimedia.org/wikipedia/en/c/ce/Dallas_Stars_logo_%282013%29.svg",
  "Real Madrid Baloncesto": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  "FC Barcelona Handbol": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "THW Kiel": "https://upload.wikimedia.org/wikipedia/en/2/2d/THW_Kiel_logo.svg",
  "SC Magdeburg": "https://upload.wikimedia.org/wikipedia/en/4/47/SC_Magdeburg_logo.svg",
  "Montpellier HB": "https://upload.wikimedia.org/wikipedia/en/e/e1/Montpellier_Handball_logo.svg",
  "Team Spirit": "https://upload.wikimedia.org/wikipedia/en/0/01/Team_Spirit_logo.svg",
  "Natus Vincere": "https://upload.wikimedia.org/wikipedia/en/4/46/Natus_Vincere_logo.png",
  "G2 Esports": "https://upload.wikimedia.org/wikipedia/en/1/12/G2_Esports_logo.svg",
  Fnatic: "https://upload.wikimedia.org/wikipedia/en/4/43/Fnatic_logo.svg",
  "FaZe Clan": "https://upload.wikimedia.org/wikipedia/en/4/43/FaZe_Clan_logo.svg",
  Cloud9: "https://upload.wikimedia.org/wikipedia/en/f/f9/Cloud9_logo.svg",
  "Team Liquid": "https://upload.wikimedia.org/wikipedia/en/f/f7/Team_Liquid_logo.svg",
  "Evil Geniuses": "https://upload.wikimedia.org/wikipedia/en/4/4d/Evil_Geniuses_logo.svg",
  "Gen.G": "https://upload.wikimedia.org/wikipedia/en/7/76/Gen.G_Esports_logo.svg",
  T1: "https://upload.wikimedia.org/wikipedia/en/7/77/T1_logo.svg"
};

const clubAliases = {
  "arsenal fc": "Arsenal",
  "liverpool fc": "Liverpool",
  "fc barcelona": "Barcelona",
  "barca": "Barcelona",
  "atletico madrid": "Atletico Madrid",
  "athletico madrid": "Atletico Madrid",
  "atletico de madrid": "Atletico Madrid",
  "atletico madrid cf": "Atletico Madrid",
  "club atletico de madrid": "Atletico Madrid",
  "club atletico madrid": "Atletico Madrid",
  "atletico": "Atletico Madrid",
  "atleti": "Atletico Madrid",
  "athletico de madrid": "Atletico Madrid",
  "atletico madrid women": "Atletico Madrid",
  "real madrid cf": "Real Madrid",
  "man city": "Manchester City",
  "manchester city fc": "Manchester City",
  "man utd": "Manchester United",
  "manchester united fc": "Manchester United",
  "spurs": "Tottenham Hotspur",
  "tottenham": "Tottenham Hotspur",
  "newcastle": "Newcastle United",
  "aston villa fc": "Aston Villa",
  "as roma": "Roma",
  "ss lazio": "Lazio",
  "sevilla fc": "Sevilla",
  "real sociedad de futbol": "Real Sociedad",
  "athletic bilbao": "Athletic Club",
  "club athletic": "Athletic Club",
  "as monaco": "Monaco",
  "as monaco fc": "Monaco",
  psg: "Paris Saint-Germain",
  "paris sg": "Paris Saint-Germain",
  "real madrid basketball": "Real Madrid Baloncesto",
  "barcelona handbol": "FC Barcelona Handbol",
  "fc barcelona handbol": "FC Barcelona Handbol",
  "toronto maple leafs": "Toronto Maple Leafs",
  "boston bruins": "Boston Bruins",
  "new york rangers": "New York Rangers",
  "colorado avalanche": "Colorado Avalanche",
  "tampa bay lightning": "Tampa Bay Lightning",
  "edmonton oilers": "Edmonton Oilers",
  "vegas golden knights": "Vegas Golden Knights",
  "dallas stars": "Dallas Stars",
  "team spirit": "Team Spirit",
  "navi": "Natus Vincere",
  "natus vincere": "Natus Vincere",
  "g2": "G2 Esports",
  "g2 esports": "G2 Esports",
  "faze": "FaZe Clan",
  "faze clan": "FaZe Clan",
  "team liquid": "Team Liquid",
  "evil geniuses": "Evil Geniuses",
  "gen g": "Gen.G",
  "gen.g": "Gen.G",
  "inter": "Inter Milan",
  "internazionale": "Inter Milan",
  juve: "Juventus",
  "bayern": "Bayern Munich",
  "fc bayern": "Bayern Munich",
  "fc bayern munchen": "Bayern Munich",
  "fc bayern munich": "Bayern Munich",
  "bayern munich fc": "Bayern Munich",
  "bayern munchen fc": "Bayern Munich",
  "bayern munchen": "Bayern Munich",
  "bayern munich": "Bayern Munich",
  "bayern munchen ii": "Bayern Munich",
  "bayern munchen women": "Bayern Munich",
  "bayern munich women": "Bayern Munich",
  "borussia dortmund": "Dortmund",
  "rb leipzig": "RB Leipzig",
  "fc porto": "Porto",
  "sl benfica": "Benfica"
};
const clubMainLeagues = {
  Arsenal: "Premier League",
  Liverpool: "Premier League",
  Chelsea: "Premier League",
  "Manchester City": "Premier League",
  "Manchester United": "Premier League",
  "Tottenham Hotspur": "Premier League",
  "Newcastle United": "Premier League",
  Barcelona: "La Liga",
  "Atletico Madrid": "La Liga",
  "Real Madrid": "La Liga",
  Juventus: "Serie A",
  "Inter Milan": "Serie A",
  "AC Milan": "Serie A",
  Napoli: "Serie A",
  "Paris Saint-Germain": "Ligue 1",
  Monaco: "Ligue 1",
  "Bayern Munich": "Bundesliga",
  Dortmund: "Bundesliga",
  "RB Leipzig": "Bundesliga",
  Ajax: "Eredivisie",
  Benfica: "Primeira Liga",
  Porto: "Primeira Liga",
  "Sporting CP": "Primeira Liga",
  "Toronto Maple Leafs": "NHL",
  "Boston Bruins": "NHL",
  "New York Rangers": "NHL",
  "Colorado Avalanche": "NHL",
  "Tampa Bay Lightning": "NHL",
  "Edmonton Oilers": "NHL",
  "Vegas Golden Knights": "NHL",
  "Dallas Stars": "NHL",
  "Real Madrid Baloncesto": "EuroLeague",
  "FC Barcelona Handbol": "EHF Champions League",
  "THW Kiel": "EHF Champions League",
  "SC Magdeburg": "EHF Champions League",
  "Montpellier HB": "EHF Champions League",
  "Team Spirit": "ESL Pro League",
  "Natus Vincere": "ESL Pro League",
  "G2 Esports": "LEC",
  Fnatic: "LEC",
  "FaZe Clan": "VCT Champions",
  Cloud9: "LCS",
  "Team Liquid": "LCS",
  "Evil Geniuses": "LCS",
  "Gen.G": "LCK",
  T1: "LCK"
};

const participantHeadshots = {
  "Novak Djokovic": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Novak_Djokovic_2019.jpg",
  "Carlos Alcaraz": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Carlos_Alcaraz_%282023%29.jpg",
  "Jannik Sinner": "https://upload.wikimedia.org/wikipedia/commons/9/90/Jannik_Sinner_%282023%29.jpg",
  "Daniil Medvedev": "https://upload.wikimedia.org/wikipedia/commons/5/50/Daniil_Medvedev_%282023%29.jpg",
  "Alexander Zverev": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Alexander_Zverev_%282023%29.jpg",
  "Stefanos Tsitsipas": "https://upload.wikimedia.org/wikipedia/commons/5/55/Stefanos_Tsitsipas_%282023%29.jpg",
  "Casper Ruud": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Casper_Ruud_%282023%29.jpg",
  "Andrey Rublev": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Andrey_Rublev_%282023%29.jpg",
  "Holger Rune": "https://upload.wikimedia.org/wikipedia/commons/6/68/Holger_Rune_%282023%29.jpg",
  "Taylor Fritz": "https://upload.wikimedia.org/wikipedia/commons/5/54/Taylor_Fritz_%282023%29.jpg",
  "Iga Swiatek": "https://upload.wikimedia.org/wikipedia/commons/5/59/Iga_%C5%9Awi%C4%85tek_%282023%29.jpg",
  "Aryna Sabalenka": "https://upload.wikimedia.org/wikipedia/commons/8/82/Aryna_Sabalenka_%282023%29.jpg",
  "Coco Gauff": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Cori_Gauff_%282023%29.jpg",
  "Elena Rybakina": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Elena_Rybakina_%282023%29.jpg",
  "Jessica Pegula": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Jessica_Pegula_%282023%29.jpg",
  "Ons Jabeur": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Ons_Jabeur_%282023%29.jpg",
  "Israel Adesanya": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Israel_Adesanya_at_UFC_230.jpg",
  "Alex Pereira": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Alex_Pereira_UFC_281.jpg",
  "Kamaru Usman": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Kamaru_Usman_2018.jpg",
  "Leon Edwards": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Leon_Edwards_2024.png",
  "Dricus Du Plessis": "https://upload.wikimedia.org/wikipedia/commons/6/60/Dricus_du_Plessis_2024.png",
  "Sean O'Malley": "https://upload.wikimedia.org/wikipedia/commons/6/65/Sean_O%27Malley_2024.jpg",
  "Islam Makhachev": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Islam_Makhachev_2022.jpg",
  "Charles Oliveira": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Charles_Oliveira_2021.jpg",
  "Alexander Volkanovski": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Alexander_Volkanovski_2018.jpg",
  "Max Holloway": "https://upload.wikimedia.org/wikipedia/commons/6/61/Max_Holloway_2024.jpg"
};
const normalizedClubLogos = Object.entries(clubLogos).reduce((acc, [name, logo]) => {
  acc[normalizeClubKey(name)] = logo;
  return acc;
}, {});
const normalizedParticipantHeadshots = Object.entries(participantHeadshots).reduce((acc, [name, image]) => {
  acc[normalizeClubKey(name)] = image;
  return acc;
}, {});

function normalizeClubKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function resolveClubLogo(teamName) {
  const raw = String(teamName || "").trim();
  const normalized = normalizeClubKey(raw);
  const aliased = clubAliases[normalized];
  const directMatch = clubLogos[raw] || normalizedClubLogos[normalized];
  const aliasMatch = aliased ? (clubLogos[aliased] || normalizedClubLogos[normalizeClubKey(aliased)]) : "";
  return directMatch || aliasMatch || "";
}

function resolveClubMainLeague(teamName) {
  const raw = String(teamName || "").trim();
  const normalized = normalizeClubKey(raw);
  const aliased = clubAliases[normalized];
  const canonical = aliased || raw;
  return clubMainLeagues[canonical] || "";
}

function inferMainLeague(existingLeague, homeTeam, awayTeam, sport) {
  const current = String(existingLeague || "").trim();
  const homeLeague = resolveClubMainLeague(homeTeam);
  const awayLeague = resolveClubMainLeague(awayTeam);

  if (homeLeague && awayLeague && homeLeague === awayLeague) {
    return homeLeague;
  }

  if (!current || /match|top league|football|basketball|tennis|ice hockey|esports|mma/i.test(current)) {
    return homeLeague || awayLeague || current || String(sport || "Top League");
  }

  return current;
}

function resolveParticipantHeadshot(name) {
  const raw = String(name || "").trim();
  if (!raw) {
    return "";
  }

  const normalized = normalizeClubKey(raw);
  return participantHeadshots[raw] || normalizedParticipantHeadshots[normalized] || "";
}


function optimizeRemoteImage(url, width = 96, height = 96, fit = "contain") {
  const source = String(url || "").trim();
  if (!source || !/^https?:\/\//i.test(source)) {
    return source;
  }

  const normalizedSource = source.replace(/^https?:\/\//i, "");
  return `https://wsrv.nl/?url=${encodeURIComponent(normalizedSource)}&w=${width}&h=${height}&fit=${fit}&output=webp`;
}
function getSportIcon(sport) {
  const normalized = normalizeClubKey(sport);
  if (normalized.includes("basket")) {
    return "basketball";
  }
  if (normalized.includes("tennis")) {
    return "tennis";
  }
  if (normalized.includes("esport")) {
    return "esports";
  }
  return "football";
}

function formatNaira(value) {
  return nairaFormatter.format(Number(value) || 0);
}

function parseKickoffToTimestamp(kickoffLabel) {
  const value = String(kickoffLabel || "").trim();
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const now = new Date();
  const timeMatch = value.match(/(\d{1,2}):(\d{2})/);
  const hours = timeMatch ? Number(timeMatch[1]) : 23;
  const minutes = timeMatch ? Number(timeMatch[2]) : 59;

  const makeDate = (offsetDays) => {
    const date = new Date(now);
    date.setDate(now.getDate() + offsetDays);
    date.setHours(hours, minutes, 0, 0);
    return date.getTime();
  };

  const normalized = value.toLowerCase();
  if (normalized.includes("today")) {
    return makeDate(0);
  }
  if (normalized.includes("tomorrow")) {
    return makeDate(1);
  }
  const inDaysMatch = normalized.match(/in\s+(\d+)\s+days?/);
  if (inDaysMatch) {
    return makeDate(Number(inDaysMatch[1]));
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function resolveFixtureCountry(fixture) {
  const league = String(fixture?.league || "").toLowerCase();
  const sport = String(fixture?.sport || "").toLowerCase();

  if (league.includes("premier league") || league.includes("fa cup") || league.includes("efl")) {
    return "England";
  }
  if (league.includes("la liga") || league.includes("copa del rey")) {
    return "Spain";
  }
  if (league.includes("serie a") || league.includes("coppa italia")) {
    return "Italy";
  }
  if (league.includes("bundesliga")) {
    return "Germany";
  }
  if (league.includes("ligue 1")) {
    return "France";
  }
  if (league.includes("eredivisie")) {
    return "Netherlands";
  }
  if (league.includes("primeira")) {
    return "Portugal";
  }
  if (league.includes("champions league")) {
    return "Europe";
  }
  if (league.includes("nba") || league.includes("mlb")) {
    return "United States";
  }
  if (league.includes("nhl")) {
    return "North America";
  }
  if (sport === "football") {
    return "International";
  }

  return "Global";
}

function hashString(value) {
  let hash = 0;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildOddsComparison(fixture) {
  const prices = Object.values(fixture?.odds || {}).map((value) => Number(value)).filter((value) => Number.isFinite(value));
  if (!prices.length) {
    return null;
  }

  const base = prices[0];
  const seed = hashString(fixture?.id || fixture?.match);
  const bookmakerA = Number((base + ((seed % 7) - 3) * 0.03).toFixed(2));
  const bookmakerB = Number((base + (((seed + 5) % 7) - 3) * 0.03).toFixed(2));
  const bookmakerC = Number((base + (((seed + 11) % 7) - 3) * 0.03).toFixed(2));
  const values = [bookmakerA, bookmakerB, bookmakerC];

  return {
    best: Math.max(...values),
    average: Number((values.reduce((sum, item) => sum + item, 0) / values.length).toFixed(2)),
    worst: Math.min(...values)
  };
}

function buildFixtureStats(fixture) {
  const seed = hashString(`${fixture?.id || ""}-${fixture?.league || ""}`);
  return {
    homeForm: `${55 + (seed % 35)}%`,
    awayForm: `${45 + ((seed + 9) % 35)}%`,
    confidence: `${58 + ((seed + 17) % 32)}%`,
    marketDepth: `${120 + (seed % 420)} bets`
  };
}

function buildExtraMarkets(fixture) {
  const apiMarkets = Array.isArray(fixture?.extraMarkets) ? fixture.extraMarkets : [];
  if (apiMarkets.length > 0) {
    return apiMarkets
      .map((market) => ({
        label: String(market?.label || "").trim(),
        price: Number(market?.price)
      }))
      .filter((market) => market.label && Number.isFinite(market.price));
  }

  const seed = hashString(`${fixture?.id || ""}-${fixture?.match || ""}`);
  const over = Number((1.62 + (seed % 8) * 0.07).toFixed(2));
  const under = Number((1.74 + ((seed + 3) % 8) * 0.07).toFixed(2));
  const homeOrDraw = Number((1.24 + ((seed + 5) % 6) * 0.05).toFixed(2));
  const awayOrDraw = Number((1.3 + ((seed + 7) % 6) * 0.05).toFixed(2));

  return [
    { label: "Over 2.5", price: over },
    { label: "Under 2.5", price: under },
    { label: "Double Chance 1X", price: homeOrDraw },
    { label: "Double Chance X2", price: awayOrDraw }
  ];
}
const backupLivePayload = {
  source: "PulseBet backup feed",
  live: false,
  lastUpdated: null,
  fixtures: [
    {
      id: "backup-fixture-1",
      sport: "Football",
      league: "Premier League",
      match: "Arsenal vs Liverpool",
      homeTeam: "Arsenal",
      awayTeam: "Liverpool",
      kickoff: "Today, 18:30",
      status: "Scheduled",
      market: "1X2",
      odds: { Home: 2.3, Draw: 3.2, Away: 2.9 }
    },
    {
      id: "backup-fixture-2",
      sport: "Football",
      league: "La Liga",
      match: "Barcelona vs Atletico Madrid",
      homeTeam: "Barcelona",
      awayTeam: "Atletico Madrid",
      kickoff: "Tomorrow, 20:00",
      status: "Scheduled",
      market: "1X2",
      odds: { Home: 2.1, Draw: 3.25, Away: 3.5 }
    },
    {
      id: "backup-fixture-3",
      sport: "Basketball",
      league: "EuroLeague",
      match: "Real Madrid vs Monaco",
      homeTeam: "Real Madrid",
      awayTeam: "Monaco",
      kickoff: "In 2 days, 19:00",
      status: "Scheduled",
      market: "Moneyline",
      odds: { Home: 1.8, Away: 2.05 }
    }
  ]
};

function normalizeFixture(fixture, index) {
  const defaultOdds = { Home: 2.0, Draw: 3.0, Away: 3.0 };
  const odds = fixture?.odds && typeof fixture.odds === "object" && Object.keys(fixture.odds).length
    ? fixture.odds
    : defaultOdds;

  const homeTeam = String(fixture?.homeTeam || "Home Team");
  const awayTeam = String(fixture?.awayTeam || "Away Team");

  return {
    id: String(fixture?.id || `fixture-${index}`),
    sport: String(fixture?.sport || "Football"),
    league: inferMainLeague(fixture?.league, homeTeam, awayTeam, fixture?.sport),
    match: String(fixture?.match || `${homeTeam} vs ${awayTeam}`),
    homeTeam,
    awayTeam,
    homeLogo: fixture?.homeLogo || resolveClubLogo(homeTeam),
    awayLogo: fixture?.awayLogo || resolveClubLogo(awayTeam),
    kickoff: String(fixture?.kickoff || "Today, 20:00"),
    status: String(fixture?.status || "Scheduled"),
    market: String(fixture?.market || "1X2"),
    liveScore: fixture?.liveScore || null,
    odds
  };
}

function normalizeLivePayload(payload, fallbackSource = "Live feed") {
  const fixtures = Array.isArray(payload?.fixtures)
    ? payload.fixtures.map((fixture, index) => normalizeFixture(fixture, index))
    : [];

  return {
    source: String(payload?.source || fallbackSource),
    live: Boolean(payload?.live),
    lastUpdated: payload?.lastUpdated || new Date().toISOString(),
    fixtures
  };
}

function readCachedLivePayload() {
  try {
    const cached = localStorage.getItem(liveCacheKey);
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);
    if (!parsed || !Array.isArray(parsed.fixtures) || parsed.fixtures.length === 0) {
      return null;
    }

    return normalizeLivePayload(parsed, "Cached feed");
  } catch (_error) {
    return null;
  }
}
function App() {
  const [betSlip, setBetSlip] = useState(() => {
    try {
      const saved = localStorage.getItem("pulsebet-betslip");
      return saved ? JSON.parse(saved) : [];
    } catch (_error) {
      return [];
    }
  });
  const [sports, setSports] = useState([]);
  const [auth, setAuth] = useState({ user: null, token: null, loading: true });
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("pulsebet-theme") !== "light");

  useEffect(() => {
    fetch(`${apiBase}/api/sports`)
      .then((response) => response.json())
      .then(setSports)
      .catch((error) => console.error("Failed to load sports", error));

    const storedToken = localStorage.getItem("pulsebet-token");
    if (!storedToken) {
      setAuth({ user: null, token: null, loading: false });
      return;
    }

    fetch(`${apiBase}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Session expired");
        }

        return response.json();
      })
      .then((payload) => {
        setAuth({ user: payload.user, token: storedToken, loading: false });
        localStorage.setItem("pulsebet-user", JSON.stringify(payload.user));
      })
      .catch(() => {
        localStorage.removeItem("pulsebet-user");
        localStorage.removeItem("pulsebet-token");
        setAuth({ user: null, token: null, loading: false });
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("pulsebet-betslip", JSON.stringify(betSlip));
  }, [betSlip]);

  useEffect(() => {
    localStorage.setItem("pulsebet-theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("light", !isDarkMode);
  }, [isDarkMode]);

  function addToSlip(fixture, label, price) {
    setBetSlip((current) => {
      const id = `${fixture.id}-${label}`;
      if (current.some((pick) => pick.id === id)) {
        return current;
      }

      return current.concat({
        id,
        match: fixture.match,
        market: fixture.market,
        league: fixture.league,
        sport: fixture.sport,
        kickoff: fixture.kickoff,
        label,
        price
      });
    });
  }

  function removeFromSlip(id) {
    setBetSlip((current) => current.filter((pick) => pick.id !== id));
  }

  function clearSlip() {
    setBetSlip([]);
  }

  function handleAuthSuccess(user, token) {
    setAuth({ user, token, loading: false });
    localStorage.setItem("pulsebet-user", JSON.stringify(user));
    localStorage.setItem("pulsebet-token", token);
  }

  function handleLogout() {
    setAuth({ user: null, token: null, loading: false });
    localStorage.removeItem("pulsebet-user");
    localStorage.removeItem("pulsebet-token");
  }

  return (
    <BrowserRouter>
      <div className={["min-h-screen", isDarkMode ? "bg-brand text-slate-50" : "bg-slate-100 text-slate-900"].join(" ")}>
        <div className="mx-auto flex min-h-screen w-full max-w-360 flex-col px-2 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
          <Header user={auth.user} onLogout={handleLogout} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((current) => !current)} />
          <Routes>
            <Route
              path="/"
              element={
                <SportsbookPage
                  sports={sports}
                  betSlip={betSlip}
                  onAddToSlip={addToSlip}
                  onRemoveFromSlip={removeFromSlip}
                  onClearSlip={clearSlip}
                  user={auth.user}
                  token={auth.token}
                />
              }
            />
            <Route path="/selections" element={<SelectionsWorkflowPage sports={sports} />} />
            <Route path="/virtual" element={<VirtualGamesPage sports={sports} />} />
            <Route
              path="/dashboard"
              element={auth.loading ? null : auth.user ? <DashboardPage user={auth.user} betSlip={betSlip} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={auth.loading ? null : auth.user ? <Navigate to="/dashboard" replace /> : <LoginPage onAuthSuccess={handleAuthSuccess} />}
            />
            <Route
              path="/register"
              element={auth.loading ? null : auth.user ? <Navigate to="/dashboard" replace /> : <RegisterPage onAuthSuccess={handleAuthSuccess} />}
            />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

function Header({ user, onLogout, isDarkMode, onToggleTheme }) {
  const headerNavItems = user ? navItems.concat({ to: '/dashboard', label: 'Dashboard' }) : navItems;
  return (
    <header className="mb-4 rounded-2xl border border-white/10 bg-slate-950/65 px-3 py-3 shadow-2xl shadow-black/20 backdrop-blur sm:rounded-[28px] sm:px-4 sm:py-4 xl:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#c9ff4d,#71defc)] font-display text-lg font-bold text-slate-950">
            PB
          </div>
          <div>
            <p className="font-display text-xl font-bold">PulseBet</p>
            <p className="text-xs text-slate-400 sm:text-sm">Live sportsbook, virtual games, secure deposits</p>
          </div>
        </div>

        <nav className="flex w-full gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1 lg:w-auto lg:flex-wrap lg:overflow-visible">
          {headerNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition",
                  isActive ? "bg-lime-300 text-slate-950" : "text-slate-300 hover:bg-white/8"
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          {user ? (
            <>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                {user.name}
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="flex-1 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-center text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/10 sm:flex-none"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex-1 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-center text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/10 sm:flex-none">
                Login
              </Link>
              <Link to="/register" className="flex-1 rounded-full bg-[linear-gradient(135deg,#c9ff4d,#ebfdb1)] px-4 py-2 text-center text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 sm:flex-none">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function SportsbookPage({ sports, betSlip, onAddToSlip, onRemoveFromSlip, onClearSlip, user, token }) {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSport = (() => {
    const value = new URLSearchParams(location.search).get("sport");
    return value ? value : "all";
  })();
  const [livePayload, setLivePayload] = useState(() => readCachedLivePayload() || normalizeLivePayload(backupLivePayload, "PulseBet backup feed"));
  const [liveError, setLiveError] = useState("");
  const [featuredBets, setFeaturedBets] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [depositAmount, setDepositAmount] = useState(5000);
  const [depositMessage, setDepositMessage] = useState("");
  const [isInitializingDeposit, setIsInitializingDeposit] = useState(false);
  const [betType, setBetType] = useState("multiple");
  const [stake, setStake] = useState(100);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [placeBetMessage, setPlaceBetMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState("");
  const [windowGamesPayload, setWindowGamesPayload] = useState({ fixtures: [], source: "", lastUpdated: null });
  const [openDropdownTabs, setOpenDropdownTabs] = useState({});
  const [visibleFixturesCount, setVisibleFixturesCount] = useState(8);
  const [sortMode, setSortMode] = useState("popular");
  const [selectedCountry, setSelectedCountry] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function fetchJson(path, attempts = 3) {
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const response = await fetch(`${apiBase}${path}`, { signal: controller.signal });
          if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
          }

          const json = await response.json();
          clearTimeout(timeoutId);
          return json;
        } catch (_error) {
          clearTimeout(timeoutId);
          if (attempt < attempts) {
            await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
          }
        }
      }

      return null;
    }

    async function loadPage() {
      setLiveError("");

      const liveJson = await fetchJson("/api/live-center", 3);

      if (cancelled) {
        return;
      }

      if (liveJson && Array.isArray(liveJson.fixtures) && liveJson.fixtures.length > 0) {
        const normalized = normalizeLivePayload(liveJson, "Live feed");
        setLivePayload(normalized);
        localStorage.setItem(liveCacheKey, JSON.stringify(normalized));
      } else {
        const cached = readCachedLivePayload();
        if (cached) {
          setLivePayload({
            ...cached,
            source: "Cached feed",
            live: false
          });
          setLiveError("Showing cached fixtures while live feed reconnects.");
        } else {
          setLivePayload(normalizeLivePayload(backupLivePayload, "PulseBet backup feed"));
          setLiveError("Showing backup fixtures while live feed reconnects.");
        }
      }

      const windowJson = await fetchJson("/api/live-now", 2);
      if (!cancelled && windowJson && Array.isArray(windowJson.fixtures)) {
        setWindowGamesPayload({
          fixtures: windowJson.fixtures,
          source: String(windowJson.source || ""),
          lastUpdated: windowJson.lastUpdated || null
        });
      }

      Promise.allSettled([fetchJson("/api/featured-bets", 2), fetchJson("/api/stats", 2)]).then((results) => {
        if (cancelled) {
          return;
        }

        const featuredResult = results[0];
        const statsResult = results[1];

        if (featuredResult?.status === "fulfilled" && Array.isArray(featuredResult.value)) {
          setFeaturedBets(featuredResult.value);
        }

        if (statsResult?.status === "fulfilled" && statsResult.value && typeof statsResult.value === "object") {
          setStats(statsResult.value);
        }
      });
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, []);
  const fixtures = Array.isArray(livePayload?.fixtures) ? livePayload.fixtures : [];
  const featuredFixture = fixtures[0];
  const isFallbackFeed = Boolean(livePayload && !livePayload.live);
  const filteredFixtures = selectedSport === "all"
    ? fixtures
    : fixtures.filter((fixture) => fixture.sport?.toLowerCase() === selectedSport.toLowerCase());
  const availableCountries = ["all"].concat(
    Array.from(new Set(filteredFixtures.map((fixture) => resolveFixtureCountry(fixture))))
      .sort((left, right) => left.localeCompare(right))
  );
  const countryFilteredFixtures = selectedCountry === "all"
    ? filteredFixtures
    : filteredFixtures.filter((fixture) => resolveFixtureCountry(fixture) === selectedCountry);
  const orderedFixtures = [...countryFilteredFixtures].sort((left, right) => parseKickoffToTimestamp(left.kickoff) - parseKickoffToTimestamp(right.kickoff));
  const sortedFixtures = (() => {
    if (sortMode === "time") {
      return orderedFixtures;
    }

    if (sortMode === "live") {
      return [...orderedFixtures].sort((left, right) => {
        const leftLive = left.liveScore || /live|in[- ]play|1st|2nd|ht|minute/i.test(String(left.status || ""));
        const rightLive = right.liveScore || /live|in[- ]play|1st|2nd|ht|minute/i.test(String(right.status || ""));
        if (leftLive === rightLive) {
          return 0;
        }
        return leftLive ? -1 : 1;
      });
    }

    if (sortMode === "boosted") {
      return [...orderedFixtures].sort((left, right) => String(right.boost || "").length - String(left.boost || "").length);
    }

    return [...orderedFixtures].sort((left, right) => {
      const leftOdds = Object.values(left.odds || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
      const rightOdds = Object.values(right.odds || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
      return rightOdds - leftOdds;
    });
  })();
  const marketFixtures = sortedFixtures.slice(0, visibleFixturesCount);
  const liveGames = fixtures
    .filter((fixture) => fixture.liveScore || /live|in[- ]play|1st|2nd|ht|minute/i.test(String(fixture.status || "")))
    .slice(0, 6);

  async function loadTransactions() {
    if (!token) {
      setTransactions([]);
      setTransactionsError("");
      return;
    }

    setIsTransactionsLoading(true);
    setTransactionsError("");

    try {
      const response = await fetch(`${apiBase}/api/bets/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const payload = await response.json();

      if (!response.ok) {
        setTransactionsError(payload.message || "Unable to load transaction history.");
        return;
      }

      setTransactions(Array.isArray(payload.tickets) ? payload.tickets : []);
    } catch (_error) {
      setTransactionsError("Unable to load transaction history.");
    } finally {
      setIsTransactionsLoading(false);
    }
  }

  useEffect(() => {
    const value = new URLSearchParams(location.search).get("sport");
    setSelectedSport(value || "all");
  }, [location.search]);

  useEffect(() => {
    const reference = new URLSearchParams(location.search).get("reference");
    if (!reference || !token) {
      return;
    }

    let cancelled = false;
    async function verifyDeposit() {
      try {
        const response = await fetch(`${apiBase}/api/payments/paystack/verify/${encodeURIComponent(reference)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const payload = await response.json();
        if (cancelled) {
          return;
        }
        if (!response.ok) {
          setDepositMessage(payload.message || "Unable to verify deposit right now.");
          return;
        }
        setDepositMessage(payload.message || "Deposit verification completed.");
      } catch (_error) {
        if (!cancelled) {
          setDepositMessage("Unable to verify deposit right now.");
        }
      }
    }

    verifyDeposit();
    return () => {
      cancelled = true;
    };
  }, [location.search, token]);

  useEffect(() => {
    loadTransactions();
  }, [token]);

  function handleSelectSport(sportName) {
    setSelectedSport(sportName);
    setSelectedCountry("all");
    setVisibleFixturesCount(8);
    const params = new URLSearchParams(location.search);
    if (sportName === "all") {
      params.delete("sport");
    } else {
      params.set("sport", sportName);
    }

    navigate({
      pathname: "/",
      search: params.toString() ? `?${params.toString()}` : ""
    }, { replace: true });
  }

  function handleSelectCountry(countryName) {
    setSelectedCountry(countryName);
    setVisibleFixturesCount(8);
  }

  const normalizedStake = Math.max(100, Number(stake) || 0);
  const multipleOdds = betSlip.reduce((total, pick) => total * pick.price, 1);
  const totalOdds = betType === "multiple"
    ? multipleOdds
    : betSlip.reduce((sum, pick) => sum + pick.price, 0);
  const totalStake = betType === "multiple"
    ? normalizedStake
    : normalizedStake * betSlip.length;
  const estimatedReturn = betSlip.length
    ? (betType === "multiple"
      ? multipleOdds * normalizedStake
      : betSlip.reduce((sum, pick) => sum + (pick.price * normalizedStake), 0)
    )
    : 0;

  async function handlePlaceBet() {
    setPlaceBetMessage("");

    if (!betSlip.length) {
      setPlaceBetMessage("Add at least one selection before placing a bet.");
      return;
    }

    if (normalizedStake < 100) {
      setPlaceBetMessage("Minimum stake is NGN 100.");
      return;
    }

    setIsPlacingBet(true);

    try {
      const response = await fetch(`${apiBase}/api/bets/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          picks: betSlip,
          stake: normalizedStake,
          betType
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        setPlaceBetMessage(payload.message || "Unable to place bet right now.");
        return;
      }

      setPlaceBetMessage(`Bet placed successfully. Ticket ${payload.ticket?.ticketId || "created"}.`);
      onClearSlip();
      loadTransactions();
    } catch (_error) {
      setPlaceBetMessage("Unable to place bet right now.");
    } finally {
      setIsPlacingBet(false);
    }
  }
  async function handleDeposit() {
    setDepositMessage("");
    if (!token) {
      setDepositMessage("Log in first to initialize a Paystack deposit.");
      return;
    }
    const numericAmount = Number(depositAmount);
    if (!Number.isFinite(numericAmount) || numericAmount < 100) {
      setDepositMessage("Minimum deposit is NGN 100.");
      return;
    }

    setIsInitializingDeposit(true);

    try {
      const response = await fetch(`${apiBase}/api/payments/paystack/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: numericAmount })
      });

      const payload = await response.json();
      if (!response.ok) {
        setDepositMessage(payload.message || "Unable to initialize deposit.");
        return;
      }

      window.location.href = payload.authorization_url;
    } catch (_error) {
      setDepositMessage("Unable to initialize Paystack right now.");
    } finally {
      setIsInitializingDeposit(false);
    }
  }

  function toggleDropdownTab(fixtureId, tabKey) {
    const targetKey = `${fixtureId}:${tabKey}`;
    setOpenDropdownTabs((current) => ({
      ...Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`${fixtureId}:`))),
      [targetKey]: !current[targetKey]
    }));
  }

  return (
    <main className="grid flex-1 gap-4 sm:gap-5 lg:gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="order-2 space-y-4 sm:space-y-5 lg:order-1 lg:space-y-6">
        <section className="panel-card overflow-hidden">
          <div className="border-b border-white/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-lime-300">All Sports</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Selections panel</h2>
          </div>
          <div className="hidden space-y-2 p-3 lg:block">
            <button type="button" onClick={() => handleSelectSport("all")} className={["w-full rounded-2xl border px-4 py-3 text-left transition", selectedSport === "all" ? "border-lime-300/45 bg-lime-300/12 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"].join(" ")}>
              <span className="block font-medium">All Markets</span>
              <span className="text-xs text-slate-400">Every available sport</span>
            </button>
            {sports.map((sport) => (
              <button key={sport.id} type="button" onClick={() => handleSelectSport(sport.name)} className={["w-full rounded-2xl border px-4 py-3 text-left transition", selectedSport.toLowerCase() === sport.name.toLowerCase() ? "border-lime-300/45 bg-lime-300/12 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"].join(" ")}>
                <span className="flex items-center justify-between font-medium">
                  {sport.name}
                  {sport.featured ? <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-lime-300">Hot</span> : null}
                </span>
                <span className="mt-1 block text-xs text-slate-400">{sport.competitions} active competitions</span>
              </button>
            ))}
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Country</p>
              <div className="mt-2 grid gap-2">
                {availableCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={["w-full rounded-xl border px-3 py-2 text-left text-xs uppercase tracking-[0.16em] transition", selectedCountry === country ? "border-lime-300/45 bg-lime-300/12 text-white" : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/25"].join(" ")}
                  >
                    {country === "all" ? "All Countries" : country}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 lg:hidden">
            <Link to={`/selections${selectedSport === "all" ? "" : `?sport=${encodeURIComponent(selectedSport)}`}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current selection</p>
                <p className="mt-1 font-medium text-white">{selectedSport === "all" ? "All Markets" : selectedSport}</p>
              </div>
              <span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-lime-300">Open workflow</span>
            </Link>
          </div>
        </section>
        {visibleFixturesCount > 8 ? <ExpandedSelectionAdsPanel /> : null}
        <LiveWindowPanel payload={windowGamesPayload} />

        <QuickTicketPanel
          betSlip={betSlip}
          onRemoveFromSlip={onRemoveFromSlip}
          stake={stake}
          setStake={setStake}
          betType={betType}
          onBetTypeChange={setBetType}
          totalStake={totalStake}
          totalOdds={totalOdds}
          estimatedReturn={estimatedReturn}
          onPlaceBet={handlePlaceBet}
          isPlacingBet={isPlacingBet}
          placeBetMessage={placeBetMessage}
        />

        <WalletDepositPanel user={user} depositAmount={depositAmount} setDepositAmount={setDepositAmount} handleDeposit={handleDeposit} depositMessage={depositMessage} isInitializingDeposit={isInitializingDeposit} />
        <TransactionHistoryPanel
          user={user}
          transactions={transactions}
          isLoading={isTransactionsLoading}
          error={transactionsError}
        />
        <SidebarAdsPanel sports={sports} />
      </aside>

      <section className="order-1 space-y-5 lg:order-2 lg:space-y-6">
        <section className="panel-hero grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.12fr)_340px] xl:p-7">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Matchday capital</p>
            <h1 className="mt-3 max-w-[11ch] font-display text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
              Live games, cleaner pricing, secure wallet flow.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Browse live and upcoming markets with clearer pricing and faster ticket building.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="w-full rounded-full bg-[linear-gradient(135deg,#c9ff4d,#ebfdb1)] px-5 py-3 text-center font-semibold text-slate-950 transition hover:-translate-y-0.5 sm:w-auto">
                Create account
              </Link>
              <Link to="/virtual" className="w-full rounded-full border border-white/12 bg-white/5 px-5 py-3 text-center text-slate-100 transition hover:border-white/25 hover:bg-white/10 sm:w-auto">
                Open virtual games
              </Link>
            </div>
          </div>

          <article className={["rounded-3xl border p-5", isFallbackFeed ? "border-amber-300/20 bg-[linear-gradient(180deg,rgba(120,53,15,0.35),rgba(2,6,23,0.82))]" : "border-white/10 bg-slate-950/55"].join(" ")}>
            <div className="flex items-center justify-between gap-3">
              <span className={["rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]", isFallbackFeed ? "border-amber-300/30 bg-amber-300/10 text-amber-100" : "border-lime-300/25 bg-lime-300/10 text-lime-300"].join(" ")}>
                {livePayload?.live ? "Live Source" : "Fallback Feed"}
              </span>
              <span className={["text-xs font-medium", isFallbackFeed ? "text-amber-100" : "text-slate-300"].join(" ")}>{livePayload ? livePayload.source : "Loading"}</span>
            </div>
            {isFallbackFeed ? (
              <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                <p className="font-medium uppercase tracking-[0.18em] text-amber-200">Fallback markets active</p>
                <p className="mt-2 leading-6 text-amber-50/85">Showing backup scheduled fixtures and backup odds while the live source refreshes.</p>
              </div>
            ) : null}
            {featuredFixture ? (
              <>
                <p className="mt-5 text-xs uppercase tracking-[0.2em] text-slate-400">{featuredFixture.league}</p>
                <div className="mt-3 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                  <TeamIdentity name={featuredFixture.homeTeam} logo={featuredFixture.homeLogo} align="left" sport={featuredFixture.sport} />
                  {featuredFixture.liveScore ? (
                    <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 font-display text-2xl font-bold text-lime-300">
                      {featuredFixture.liveScore.home} - {featuredFixture.liveScore.away}
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">vs</span>
                  )}
                  <TeamIdentity name={featuredFixture.awayTeam} logo={featuredFixture.awayLogo} align="right" sport={featuredFixture.sport} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{featuredFixture.kickoff} &middot; {featuredFixture.status}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {Object.entries(featuredFixture.odds).slice(0, 3).map(([label, price]) => (
                    <button key={label} type="button" onClick={() => onAddToSlip(featuredFixture, label, price)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-white/25">
                      <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">{label}</span>
                      <span className="mt-2 block font-display text-2xl font-bold text-lime-300">{price}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </article>
        </section>
        <section className="grid gap-4 lg:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {(stats ? [
            { label: "Active Users", value: stats.activeUsers },
            { label: "Live Markets", value: stats.liveMarkets },
            { label: "Payout Speed", value: stats.payoutTime },
            { label: "Boosted Odds", value: stats.boostedOdds }
          ] : []).map((item) => (
            <article key={item.label} className="panel-card px-5 py-4">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{item.value}</p>
            </article>
          ))}
        </section>
        <section className="panel-card p-5">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Top markets</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Live and upcoming fixtures</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Source: {livePayload ? livePayload.source : "Loading"}. Last updated: {livePayload?.lastUpdated ? new Date(livePayload.lastUpdated).toLocaleString() : "..."}
              </p>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
              <SortIcon />
              <span className="text-slate-400">Sort</span>
              <span className="text-slate-500">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                className="bg-transparent text-xs uppercase tracking-[0.18em] text-lime-300 outline-none"
              >
                <option value="time" className="bg-slate-950 text-white">Time</option>
                <option value="popular" className="bg-slate-950 text-white">Popular</option>
                <option value="live" className="bg-slate-950 text-white">Live</option>
                <option value="boosted" className="bg-slate-950 text-white">Boosted</option>
              </select>
            </label>
          </div>

          {isFallbackFeed ? (
            <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-amber-50">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Fallback feed visible</p>
              <p className="mt-2 text-sm leading-6 text-amber-50/85">These markets are intentionally visible as scheduled backup content, so you can still browse fixtures and odds clearly when live data is unavailable.</p>
            </div>
          ) : null}

          <div className="mt-5 grid gap-4">
            {marketFixtures.map((fixture) => (
              <article key={fixture.id} className={["rounded-3xl border p-5", isFallbackFeed ? "border-amber-300/15 bg-white/6" : "border-white/10 bg-white/4.5"].join(" ")}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                      <span>{fixture.league}</span>
                      <span className="text-slate-600">&middot;</span>
                      <span>{fixture.kickoff}</span>
                      <span className="text-slate-600">&middot;</span>
                      <span>{fixture.status}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-slate-950/45 px-4 py-4">
                      <TeamIdentity name={fixture.homeTeam} logo={fixture.homeLogo} align="left" compact sport={fixture.sport} />
                      {fixture.liveScore ? (
                        <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 font-display text-lg font-bold text-lime-300">{fixture.liveScore.home} - {fixture.liveScore.away}</span>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">vs</span>
                      )}
                      <TeamIdentity name={fixture.awayTeam} logo={fixture.awayLogo} align="right" compact sport={fixture.sport} />
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{fixture.market}</p>
                  </div>
                  <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-lime-300">
                    {fixture.boost}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {Object.entries(fixture.odds).map(([label, price]) => (
                    <button key={label} type="button" onClick={() => onAddToSlip(fixture, label, price)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-slate-900">
                      <span className="text-sm text-slate-300">{label}</span>
                      <span className="font-display text-xl font-bold text-lime-300">{price}</span>
                    </button>
                  ))}
                </div>
                {[
                  { key: "odds", label: "Odds Comparison" },
                  { key: "stats", label: "Statistics" },
                  { key: "other", label: "Other Betting Options" }
                ].map((tab) => {
                  const stateKey = `${fixture.id}:${tab.key}`;
                  const isOpen = Boolean(openDropdownTabs[stateKey]);
                  return (
                    <div key={tab.key} className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45">
                      <button
                        type="button"
                        onClick={() => toggleDropdownTab(fixture.id, tab.key)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      >
                        <span className="min-w-0 text-xs uppercase tracking-[0.18em] text-lime-300 sm:text-sm">{tab.label}</span>
                        <span className="shrink-0 text-slate-300">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen ? (
                        <div className="border-t border-white/10 px-4 py-4">
                          {tab.key === "odds" ? (
                            buildOddsComparison(fixture) ? (
                              <div className="grid gap-2 sm:grid-cols-3">
                                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Best</p>
                                  <p className="mt-1 font-display text-xl font-bold text-emerald-300">{buildOddsComparison(fixture).best}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Average</p>
                                  <p className="mt-1 font-display text-xl font-bold text-slate-100">{buildOddsComparison(fixture).average}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Worst</p>
                                  <p className="mt-1 font-display text-xl font-bold text-rose-300">{buildOddsComparison(fixture).worst}</p>
                                </div>
                              </div>
                            ) : <p className="text-sm text-slate-400">No comparison data available.</p>
                          ) : null}
                          {tab.key === "stats" ? (
                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                              {Object.entries(buildFixtureStats(fixture)).map(([key, value]) => (
                                <div key={key} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                                  <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {tab.key === "other" ? (
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                              {buildExtraMarkets(fixture).map((market) => (
                                <button key={`${fixture.id}-${market.label}`} type="button" onClick={() => onAddToSlip(fixture, market.label, market.price)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-slate-900">
                                  <span className="min-w-0 pr-2 text-xs uppercase tracking-[0.14em] text-slate-300">{market.label}</span>
                                  <span className="shrink-0 font-display text-lg font-bold text-lime-300">{market.price}</span>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>{fixture.trend}</span>
                  <span className="text-slate-300">Tap any price to add it to the ticket</span>
                </div>
              </article>
            ))}
            {sortedFixtures.length > marketFixtures.length ? (
              <button
                type="button"
                onClick={() => setVisibleFixturesCount((current) => current + 8)}
                className="w-full rounded-3xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-medium text-slate-100 transition hover:border-white/30 hover:bg-white/10"
              >
                View more games
              </button>
            ) : null}
            {marketFixtures.length === 0 ? <div className={["rounded-3xl border p-8 text-center", isFallbackFeed ? "border-dashed border-amber-300/20 bg-amber-300/10 text-amber-50" : "border-dashed border-white/12 bg-white/3 text-slate-400"].join(" ")}>{liveError || "No live fixtures match this sport yet."}</div> : null}
          </div>
        </section>

        <section className="grid gap-4 lg:gap-5 lg:grid-cols-3">
          {featuredBets.map((bet) => (
            <article key={bet.id} className={`rounded-3xl border border-white/10 bg-linear-to-br ${promoAccentClass[bet.accent] || "from-slate-800/80"} to-slate-950/90 p-5 shadow-xl shadow-black/10`}>
              <p className="text-sm font-medium text-slate-100">{bet.title}</p>
              <h3 className="mt-3 font-display text-2xl font-bold">{bet.returnText}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{bet.description}</p>
            </article>
          ))}
        </section>
      </section>


    </main>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-lime-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 7h10M8 12h7M8 17h4" />
      <path d="m5 6-2 2-2-2M3 8V4" />
    </svg>
  );
}

function QuickTicketPanel({
  betSlip,
  onRemoveFromSlip,
  stake,
  setStake,
  betType,
  onBetTypeChange,
  totalStake,
  totalOdds,
  estimatedReturn,
  onPlaceBet,
  isPlacingBet,
  placeBetMessage
}) {
  return (
    <section className="panel-card p-5">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Quick ticket</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Bet slip</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
          {betSlip.length} picks
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {["multiple", "single"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onBetTypeChange(type)}
            className={[
              "rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.18em] transition",
              betType === type
                ? "border-lime-300/45 bg-lime-300/12 text-lime-200"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-lime-300/35 hover:bg-lime-300/10"
            ].join(" ")}
          >
            {type}
          </button>
        ))}
      </div>

      {betSlip.length === 0 ? (
        <p className="py-8 text-sm leading-7 text-slate-400">Select odds from the sportsbook to start building a ticket. Your selections stay visible while you browse.</p>
      ) : (
        <div className="space-y-3 py-5">
          {betSlip.map((pick) => (
            <article key={pick.id} className="rounded-2xl border border-white/10 bg-white/4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-white">{pick.match}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{pick.league}</p>
                  <p className="mt-2 text-sm text-slate-300">{pick.market}</p>
                </div>
                <button type="button" onClick={() => onRemoveFromSlip(pick.id)} className="rounded-full border border-red-300/20 bg-red-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-red-200 transition hover:border-red-300/35 hover:bg-red-400/15">
                  Remove
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-400">{pick.label}</span>
                <span className="font-display text-xl font-bold text-lime-300">{pick.price}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <label className="block text-sm text-slate-300">
        Stake amount (NGN)
        <input
          type="number"
          min="100"
          value={stake}
          onChange={(event) => setStake(event.target.value)}
          onBlur={() => setStake((current) => Math.max(100, Number(current) || 100))}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300/35"
        />
      </label>

      <div className="grid gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-3 xl:grid-cols-1">
        <SummaryRow label={betType === "single" ? "Stake per pick" : "Stake"} value={formatNaira(Math.max(100, Number(stake) || 0))} />
        <SummaryRow label="Total Stake" value={formatNaira(totalStake)} />
        <SummaryRow label="Total Odds" value={betSlip.length ? totalOdds.toFixed(2) : "0.00"} />
        <SummaryRow label="Potential Return" value={formatNaira(estimatedReturn)} />
      </div>

      <button
        type="button"
        onClick={onPlaceBet}
        disabled={isPlacingBet || betSlip.length === 0}
        className="mt-5 w-full rounded-full bg-[linear-gradient(135deg,#c9ff4d,#ebfdb1)] px-4 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPlacingBet ? "Placing bet..." : "Place bet"}
      </button>
      {placeBetMessage ? <p className="mt-3 text-sm text-amber-200">{placeBetMessage}</p> : null}
    </section>
  );
}
function WalletDepositPanel({ user, depositAmount, setDepositAmount, handleDeposit, depositMessage, isInitializingDeposit }) {
  return (
    <section className="panel-card p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Wallet Deposit</p>
      <h2 className="mt-2 font-display text-2xl font-bold">Fund with Paystack (NGN)</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{user ? `Signed in as ${user.email}. Deposits are initialized in Nigerian naira through a JWT-protected backend route.` : "Log in to initialize a secure Paystack deposit from your wallet panel."}</p>
      <label className="mt-5 block text-sm text-slate-300">
        Deposit amount (NGN)
        <input type="number" min="100" value={depositAmount} onChange={(event) => setDepositAmount(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300/35" />
      </label>
      <button type="button" disabled={isInitializingDeposit} onClick={handleDeposit} className="mt-4 w-full rounded-full border border-white/12 bg-white/5 px-4 py-3 font-medium text-slate-100 transition hover:border-white/25 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60">
        {isInitializingDeposit ? "Initializing..." : "Deposit in naira via Paystack"}
      </button>
      {depositMessage ? <p className="mt-3 text-sm text-amber-200">{depositMessage}</p> : null}
    </section>
  );
}

function TransactionHistoryPanel({ user, transactions, isLoading, error }) {
  return (
    <section className="panel-card p-5">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Transactions</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Bet history</h2>
        </div>
      </div>

      {!user ? (
        <p className="pt-4 text-sm text-slate-400">Log in to view your transaction history.</p>
      ) : isLoading ? (
        <p className="pt-4 text-sm text-slate-400">Loading transactions...</p>
      ) : error ? (
        <p className="pt-4 text-sm text-amber-200">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="pt-4 text-sm text-slate-400">No transactions yet. Place a bet to see it here.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {transactions.map((ticket) => (
            <article key={ticket.id} className="rounded-2xl border border-white/10 bg-white/4 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-lime-300">{ticket.ticketId}</p>
                <p className="text-xs text-slate-400">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ""}</p>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <p>Picks: {ticket.picksCount} ({ticket.betType})</p>
                <p>Stake: {formatNaira(ticket.totalStake || ticket.stake)}</p>
                <p>Odds: {Number(ticket.totalOdds || 0).toFixed(2)}</p>
                <p>Payout: {formatNaira(ticket.totalPayout || ticket.potentialReturn)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
function SidebarAdsPanel({ sports }) {
  const adCards = [
    {
      id: "weekend-boost",
      label: "Limited Promo",
      title: "Weekend odds boost +25%",
      copy: "Activate this boost before kickoff and get improved payout on selected markets.",
      cta: "Claim boost"
    },
    {
      id: "referral-bonus",
      label: "Referral Bonus",
      title: "Invite friends, earn free bets",
      copy: "Share your invite code and earn wallet credits when referrals place their first ticket.",
      cta: "Get code"
    }
  ];

  const sportImages = [
    {
      sport: "Football",
      image: "https://media.newyorker.com/photos/6543f23235570d74bd3ef32e/master/w_2560%2Cc_limit/Akam-Pelly%2520Ruddock%2520Mpanzu.jpg"
    },
    {
      sport: "Basketball",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80"
    },
    {
      sport: "Tennis",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80"
    },
    {
      sport: "eSports",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80"
    }
  ];

  const activeSports = sports?.length
    ? sportImages.filter((item) => sports.some((sport) => sport.name?.toLowerCase().includes(item.sport.toLowerCase().replace("sports", ""))))
    : sportImages;
  const displaySports = (activeSports.length ? activeSports : sportImages).slice(0, 4);

  return (
    <section className="panel-card p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Sponsored</p>
      <h2 className="mt-2 font-display text-2xl font-bold">Ads and Sport Images</h2>

      <div className="mt-4 space-y-3">
        {adCards.map((ad) => (
          <article key={ad.id} className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(16,185,129,0.14),rgba(2,6,23,0.76))] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">{ad.label}</p>
            <h3 className="mt-2 font-display text-xl font-bold text-white">{ad.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{ad.copy}</p>
            <button type="button" className="mt-3 rounded-full border border-emerald-200/25 bg-emerald-300/15 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-emerald-100 transition hover:border-emerald-200/45 hover:bg-emerald-300/25">
              {ad.cta}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {displaySports.map((item) => (
          <figure key={item.sport} className="group relative overflow-hidden rounded-2xl border border-white/10">
            <img src={item.image} alt={`${item.sport} action`} loading="lazy" className="h-24 w-full object-cover transition duration-300 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-2 py-2 text-[11px] uppercase tracking-[0.18em] text-white">
              {item.sport}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
function MatchCenterPanel({ matchCenter }) {
  const fixture = matchCenter?.fixture;

  return (
    <section className="panel-card p-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Match Center</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Sportmonks fixture detail</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {matchCenter?.available ? "Live fixture detail feed connected." : matchCenter?.message || "Loading fixture detail..."}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
          {matchCenter?.lastUpdated ? new Date(matchCenter.lastUpdated).toLocaleString() : "Awaiting data"}
        </span>
      </div>

      {fixture ? (
        <div className="mt-5 space-y-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_320px]">
            <article className="rounded-3xl border border-white/10 bg-white/4 p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>{fixture.league}</span>
                {fixture.country ? <span className="text-slate-600">&middot;</span> : null}
                {fixture.country ? <span>{fixture.country}</span> : null}
                <span className="text-slate-600">&middot;</span>
                <span>{fixture.kickoff}</span>
                <span className="text-slate-600">&middot;</span>
                <span>{fixture.state}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                <TeamIdentity name={fixture.homeTeam} logo={fixture.homeLogo} align="left" sport={fixture.sport} />
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 font-display text-2xl font-bold text-lime-300">
                  {fixture.score ? `${fixture.score.home} - ${fixture.score.away}` : "vs"}
                </span>
                <TeamIdentity name={fixture.awayTeam} logo={fixture.awayLogo} align="right" sport={fixture.sport} />
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
                <InfoPill label="Venue" value={fixture.venue} />
                <InfoPill label="City" value={fixture.city || "TBC"} />
                <InfoPill label="Referee" value={fixture.referee || "Unassigned"} />
                <InfoPill label="Attendance" value={fixture.attendance || "Not posted"} />
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/4 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Match tags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(fixture.metadata?.length ? fixture.metadata : ["No metadata available"]).map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.24em] text-lime-300">Coaches</p>
              <div className="mt-4 space-y-3">
                {(fixture.coaches?.length ? fixture.coaches : [{ name: "No coach data", nationality: null, team: null }]).map((coach) => (
                  <div key={`${coach.team || "team"}-${coach.name}`} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    <p className="font-medium text-white">{coach.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{[coach.team, coach.nationality].filter(Boolean).join(" - ") || "Coach profile unavailable"}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <LineupCard title={`${fixture.homeTeam} lineup`} players={fixture.homeLineup} />
            <LineupCard title={`${fixture.awayTeam} lineup`} players={fixture.awayLineup} />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-white/12 bg-white/3 p-8 text-center text-slate-400">
          {matchCenter?.message || "Fixture details are not available right now."}
        </div>
      )}
    </section>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  );
}

function LineupCard({ title, players }) {
  const list = players?.length ? players : [{ player: "Lineup not posted", position: "Pending" }];

  return (
    <article className="rounded-3xl border border-white/10 bg-white/4 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Starting XI</p>
      <h3 className="mt-2 font-display text-2xl font-bold">{title}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map((entry) => (
          <div key={`${entry.player}-${entry.position}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
            <PlayerAvatar name={entry.player} image={entry.image} />
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{entry.player}</p>
              <p className="mt-1 text-sm text-slate-400">{entry.position}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function LiveWindowPanel({ payload }) {
  const fixtures = Array.isArray(payload?.fixtures) ? payload.fixtures : [];

  return (
    <section className="panel-card p-5">
      <div className="border-b border-white/10 pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Live Window</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Live + Next 60m</h2>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {payload?.source ? `Source: ${payload.source}` : "Loading source..."}
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {fixtures.slice(0, 8).map((fixture) => (
          <article key={`window-${fixture.id}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{fixture.league}</p>
            <p className="mt-1 text-sm font-medium text-white">{fixture.match}</p>
            <p className="mt-1 text-xs text-slate-300">{fixture.kickoff} · {fixture.status}</p>
          </article>
        ))}
        {fixtures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 px-4 py-5 text-center text-sm text-slate-400">
            No live or next-hour games right now.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ExpandedSelectionAdsPanel() {
  const adGroups = [
    {
      title: "Betting Ads",
      items: [
        "Weekend Acca Boost +30%",
        "Cashout Shield for Multi Bets"
      ]
    },
    {
      title: "Virtual Ads",
      items: [
        "Virtual Football every 3 mins",
        "Virtual Hoops jackpot tonight"
      ]
    },
    {
      title: "Promoters",
      items: [
        "Top tipster stream: Matchday Alpha",
        "Promoter code: PULSEVIP"
      ]
    }
  ];
  const promoPhotos = [
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/flagged/photo-1571358607210-1691cb0ea07c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1708696216242-a432e73ecd72?q=80&w=408&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <section className="panel-card p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Sponsored Space</p>
      <h2 className="mt-2 font-display text-2xl font-bold">Ads and Promoters</h2>
      <div className="mt-4 space-y-3">
        {adGroups.map((group) => (
          <article key={group.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">{group.title}</p>
            {group.items.map((item) => (
              <p key={item} className="mt-2 text-sm text-slate-200">{item}</p>
            ))}
          </article>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {promoPhotos.map((photo, index) => (
          <figure key={`${photo}-${index}`} className="overflow-hidden rounded-2xl border border-white/10">
            <img src={photo} alt={`Betting promotion ${index + 1}`} loading="lazy" className="h-28 w-full object-cover transition duration-300 hover:scale-105" />
          </figure>
        ))}
      </div>
    </section>
  );
}

function SelectionsWorkflowPage({ sports }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeSport = new URLSearchParams(location.search).get("sport") || "all";

  function goWithSport(sportName) {
    const search = sportName === "all" ? "" : `?sport=${encodeURIComponent(sportName)}`;
    navigate(`/${search}`);
  }

  return (
    <main className="grid flex-1 place-items-start py-2 sm:py-4">
      <section className="w-full max-w-3xl space-y-4">
        <article className="panel-hero p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Step 1 of 2</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Choose your sport selection</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Pick a sport to filter markets, then continue back to the sportsbook.</p>
        </article>

        <article className="panel-card p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => goWithSport("all")} className={["rounded-2xl border px-4 py-4 text-left transition", activeSport === "all" ? "border-lime-300/45 bg-lime-300/12 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"].join(" ")}>
              <p className="font-medium">All Markets</p>
              <p className="mt-1 text-xs text-slate-400">Every available sport</p>
            </button>
            {sports.map((sport) => (
              <button key={sport.id} type="button" onClick={() => goWithSport(sport.name)} className={["rounded-2xl border px-4 py-4 text-left transition", activeSport.toLowerCase() === sport.name.toLowerCase() ? "border-lime-300/45 bg-lime-300/12 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"].join(" ")}>
                <p className="font-medium">{sport.name}</p>
                <p className="mt-1 text-xs text-slate-400">{sport.competitions} active competitions</p>
              </button>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

function PlayerAvatar({ name, image }) {
  const [failed, setFailed] = useState(false);
  const [optimizedFailed, setOptimizedFailed] = useState(false);
  const initials = String(name || "PL")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const src = !failed && image ? image : resolveParticipantHeadshot(name);
  const optimizedSrc = optimizeRemoteImage(src, 88, 88, "cover");

  if (src) {
    return (
      <img
        src={optimizedFailed ? src : optimizedSrc}
        alt={name}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => {
          if (!optimizedFailed) {
            setOptimizedFailed(true);
            return;
          }
          setFailed(true);
        }}
        className="h-11 w-11 shrink-0 rounded-xl border border-white/12 bg-slate-900/90 object-cover shadow-[0_8px_22px_rgba(0,0,0,0.25)]"
      />
    );
  }

  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/12 bg-linear-to-b from-white/10 to-white/4 font-display text-xs font-bold text-lime-300">
      {initials || "PL"}
    </div>
  );
}
function DashboardPage({ user, betSlip }) {
  const accountHighlights = [
    { label: "Account Name", value: user?.name || "PulseBet Member" },
    { label: "Email", value: user?.email || "No email available" },
    { label: "Open Bets", value: String(betSlip.length) },
    { label: "Session", value: "Authenticated" }
  ];

  return (
    <main className="grid flex-1 gap-5 lg:gap-6 lg:grid-cols-[minmax(0,1.2fr)_340px]">
      <section className="space-y-5 lg:space-y-6">
        <section className="panel-hero p-6 lg:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">User Dashboard</p>
          <h1 className="mt-3 max-w-[12ch] font-display text-4xl font-bold leading-none sm:text-5xl">Welcome back, {user?.name?.split(" ")[0] || "Player"}.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Your account is active. Use the sportsbook to build tickets, keep an eye on upcoming football fixtures, and manage your wallet from the left rail.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {accountHighlights.map((item) => (
              <article key={item.label} className="rounded-3xl border border-white/10 bg-white/4 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-3 wrap-break-word font-display text-2xl font-bold text-white">{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel-card p-6">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Account Overview</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Dashboard actions</h2>
            </div>
            <Link to="/" className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-white/25 hover:bg-white/10">
              Open sportsbook
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              { title: "Continue betting", text: "Return to the sportsbook to add odds to your quick ticket and place your next wager.", action: "/" },
              { title: "Open virtual games", text: "Jump into the virtual lobby for faster-cycle markets when live fixtures are quiet.", action: "/virtual" },
              { title: "Manage wallet", text: "Use the wallet deposit panel to initialize a secure Paystack top-up in naira.", action: "/" },
              { title: "Track fixtures", text: "Follow top-league football markets loaded from Sportmonks over the next 7 days.", action: "/" }
            ].map((item) => (
              <article key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
                <h3 className="font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
                <Link to={item.action} className="mt-5 inline-flex rounded-full bg-[linear-gradient(135deg,#c9ff4d,#ebfdb1)] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5">
                  Go now
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>

      <aside className="space-y-5 lg:space-y-6">
        <section className="panel-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">User Status</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Account verified</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">You are signed in and can access deposits, protected routes, and session-aware features.</p>
          <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-emerald-100">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Active session</p>
            <p className="mt-2 text-sm leading-6">JWT session restored for {user?.email || "this account"}.</p>
          </div>
        </section>
        <section className="panel-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Open Ticket</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Quick summary</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Current bet slip selections remain attached to your active session while you browse.</p>
          <div className="mt-5 grid gap-3">
            <SummaryRow label="Selections" value={String(betSlip.length)} />
            <SummaryRow label="Ready to bet" value={betSlip.length ? "Yes" : "No"} />
          </div>
        </section>
      </aside>
    </main>
  );
}

function VirtualGamesPage({ sports }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`${apiBase}/api/virtual-games`)
      .then((response) => response.json())
      .then(setGames)
      .catch((error) => console.error("Failed to load virtual games", error));
  }, []);

  return (
    <main className="grid flex-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5">
      <aside className="order-2 panel-card p-4 sm:p-5 lg:order-1">
        <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Available Sports</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Navigation rail</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {sports.map((sport) => (
            <div key={sport.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
              <p className="font-medium text-white">{sport.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{sport.competitions} competitions</p>
            </div>
          ))}
        </div>
      </aside>

      <section className="order-1 space-y-4 sm:space-y-5 lg:order-2 lg:space-y-6">
        <section className="panel-hero p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Virtual Lobby</p>
          <h1 className="mt-3 max-w-[15ch] font-display text-3xl font-bold leading-tight sm:max-w-[13ch] sm:text-5xl sm:leading-none">Fast-cycle virtual games for round-the-clock play.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-5 sm:text-base sm:leading-7">Virtual football, racing, and hoops are presented in the same design system as the sportsbook, with clearer cadence, category, and prize visibility.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <article key={game.id} className="panel-card p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-lime-300">{game.category}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{game.cadence}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold">{game.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{game.description}</p>
              <div className="mt-6 flex flex-col items-start gap-2 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="text-sm text-slate-400">Prize pool</span>
                <span className="font-display text-xl font-bold text-lime-300 sm:text-2xl">{formatNaira(Number(String(game.jackpot ?? 0).replace(/[^\d.]/g, "")) || 0)}</span>
              </div>
              <button type="button" className="mt-5 w-full rounded-full bg-[linear-gradient(135deg,#c9ff4d,#ebfdb1)] px-4 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5">Launch game</button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
function LoginPage({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.message || "Unable to log in.");
        return;
      }

      onAuthSuccess(payload.user, payload.token);
      navigate("/dashboard");
    } catch (_error) {
      setError("Unable to reach the server.");
    }
  }

  return (
    <AuthShell title="Welcome back" description="Log in to manage your wallet, build slips, and deposit through Paystack.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
        <Field label="Password" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} />
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
        <button type="submit" className="w-full rounded-full bg-[linear-gradient(135deg,#c9ff4d,#ebfdb1)] px-4 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5">Log in</button>
        <p className="text-sm text-slate-400">No account yet? <Link className="text-lime-300" to="/register">Create one</Link>.</p>
      </form>
    </AuthShell>
  );
}

function RegisterPage({ onAuthSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.message || "Unable to register.");
        return;
      }

      setMessage(payload.message || "Registration successful.");
      onAuthSuccess(payload.user, payload.token);
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (_error) {
      setError("Unable to reach the server.");
    }
  }

  return (
    <AuthShell title="Create your account" description="New accounts are stored in MongoDB, passwords are hashed with bcryptjs, and sessions are issued as JWTs.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Full name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
        <Field label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
        <Field label="Password" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} />
        {message ? <p className="text-sm text-emerald-200">{message}</p> : null}
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
        <button type="submit" className="w-full rounded-full bg-[linear-gradient(135deg,#c9ff4d,#ebfdb1)] px-4 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5">Register</button>
        <p className="text-sm text-slate-400">Already registered? <Link className="text-lime-300" to="/login">Log in</Link>.</p>
      </form>
    </AuthShell>
  );
}

function AuthShell({ title, description, children }) {
  return (
    <main className="grid flex-1 place-items-center py-6">
      <section className="grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(0,1.1fr)_420px]">
        <article className="panel-hero p-6 lg:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Account access</p>
          <h1 className="mt-3 max-w-[10ch] font-display text-4xl font-bold leading-none sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">{description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Live Feed", value: "Backend powered" },
              { label: "Deposits", value: "JWT protected" },
              { label: "Storage", value: "MongoDB" }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-2 font-display text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card p-6 lg:p-8">{children}</article>
      </section>
    </main>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300/35" />
    </label>
  );
}

const TeamIdentity = memo(function TeamIdentity({ name, logo, sport = "Football", align = "left", compact = false }) {
  return (
    <div className={["flex min-w-0 items-center gap-3", align === "right" ? "flex-row-reverse text-right" : "text-left"].join(" ")}>
      <TeamLogo logo={logo} name={name} sport={sport} compact={compact} />
      <div className="min-w-0">
        <p className={["truncate font-display font-bold text-white", compact ? "text-lg" : "text-xl"].join(" ")}>{name}</p>
      </div>
    </div>
  );
});

const TeamLogo = memo(function TeamLogo({ logo, name, sport = "Football", compact = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [optimizedImageFailed, setOptimizedImageFailed] = useState(false);
  const [headshotFailed, setHeadshotFailed] = useState(false);
  const [optimizedHeadshotFailed, setOptimizedHeadshotFailed] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const sizeClass = compact ? "h-10 w-10" : "h-12 w-12";
  const sportIcon = getSportIcon(sport);
  const headshot = !headshotFailed ? resolveParticipantHeadshot(name) : "";
  const optimizedHeadshot = optimizeRemoteImage(headshot, compact ? 80 : 96, compact ? 80 : 96, "cover");
  const optimizedLogo = optimizeRemoteImage(logo, compact ? 80 : 96, compact ? 80 : 96, "contain");
  const prefersHeadshot = sportIcon === "tennis" || normalizeClubKey(sport).includes("mma");

  if (!logo || imageFailed) {
    if (prefersHeadshot && headshot) {
      return (
        <img
          src={optimizedHeadshotFailed ? headshot : optimizedHeadshot}
          alt={name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            if (!optimizedHeadshotFailed) {
              setOptimizedHeadshotFailed(true);
              return;
            }
            setHeadshotFailed(true);
          }}
          className={["shrink-0 rounded-2xl border border-white/15 bg-slate-900/90 object-cover shadow-[0_10px_28px_rgba(0,0,0,0.28)]", sizeClass].join(" ")}
        />
      );
    }

    return (
      <div className={["grid shrink-0 place-items-center rounded-2xl border border-white/12 bg-linear-to-b from-white/10 to-white/4 font-display text-sm font-bold text-lime-300 shadow-[0_10px_30px_rgba(0,0,0,0.25)]", sizeClass].join(" ")}>
        <SportIcon type={sportIcon} fallback={initials || "TM"} />
      </div>
    );
  }

  return (
    <img
      src={optimizedImageFailed ? logo : optimizedLogo}
      alt={name}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (!optimizedImageFailed) {
          setOptimizedImageFailed(true);
          return;
        }
        setImageFailed(true);
      }}
      className={["shrink-0 rounded-2xl border border-white/15 bg-white/95 object-contain p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.28)]", sizeClass].join(" ")}
    />
  );
});
function SportIcon({ type, fallback }) {
  if (type === "basketball") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-lime-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5v17M3.5 12h17M6 6.5c2.2 2 3.8 5 3.8 8.5M18 17.5c-2.2-2-3.8-5-3.8-8.5" />
      </svg>
    );
  }
  if (type === "tennis") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-lime-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M6.5 8.5c1.5 1.2 2.6 3 2.6 5s-1.1 3.8-2.6 5M17.5 5.5c-1.5 1.2-2.6 3-2.6 5s1.1 3.8 2.6 5" />
      </svg>
    );
  }
  if (type === "esports") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-lime-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="4" y="8" width="16" height="8" rx="4" />
        <path d="M8.5 10.5v3M7 12h3M15.5 11.5h.01M17 13h.01M10 16l-1.5 2M14 16l1.5 2" />
      </svg>
    );
  }
  if (type === "football") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-lime-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m12 7 2.3 1.7-.9 2.8h-2.8l-.9-2.8L12 7Zm-3.7 6.1 2-1.5h3.4l2 1.5-.8 2.5h-5.8l-.8-2.5Z" />
      </svg>
    );
  }
  return <span>{fallback}</span>;
}

function Footer() {
  const socialLinks = [
    { label: "X", href: "https://x.com", icon: <XIcon /> },
    { label: "Instagram", href: "https://instagram.com", icon: <InstagramIcon /> },
    { label: "Facebook", href: "https://facebook.com", icon: <FacebookIcon /> },
    { label: "Telegram", href: "https://telegram.org", icon: <TelegramIcon /> }
  ];

  return (
    <footer className="mt-6 rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-5 shadow-2xl shadow-black/20 backdrop-blur sm:rounded-[28px] sm:px-5 lg:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">PulseBet Network</p>
          <p className="mt-3 font-display text-2xl font-bold text-white">Sharper markets, cleaner matchday layout, one place for every ticket.</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Follow product updates, downtime notices, and market releases across our social channels.</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:-translate-y-0.5 hover:border-lime-300/35 hover:bg-lime-300/10 hover:text-lime-300"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
        <p>(c) {new Date().getFullYear()} PulseBet. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/">Sportsbook</Link>
          <Link to="/virtual">Virtual Games</Link>
          <Link to="/login">Account Access</Link>
        </div>
      </div>
    </footer>
  );
}

function IconFrame({ children }) {
  return <span className="flex h-5 w-5 items-center justify-center">{children}</span>;
}

function XIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23 22h-6.26l-4.9-6.41L6.23 22H3.1l7.24-8.27L1 2h6.42l4.43 5.85L18.9 2Zm-1.1 18h1.72L6.48 3.9H4.64L17.8 20Z" />
      </svg>
    </IconFrame>
  );
}

function InstagramIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    </IconFrame>
  );
}

function FacebookIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.6V4.8c-.3 0-1.2-.1-2.3-.1-2.2 0-3.8 1.3-3.8 3.9V11H8v3h2.7v8h2.8Z" />
      </svg>
    </IconFrame>
  );
}

function TelegramIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M21.4 4.6 3.8 11.4c-1.2.5-1.2 1.2-.2 1.5l4.5 1.4 1.7 5.2c.2.6.1.8.8.8.5 0 .8-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.8-.8l3-14c.4-1.2-.4-1.8-1.3-1.4ZM9.4 13.9l9-5.7c.4-.2.8-.1.5.2l-7.4 6.7-.3 3.2-1.8-4.4Z" />
      </svg>
    </IconFrame>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

export default App;





























