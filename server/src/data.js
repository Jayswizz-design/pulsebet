export const featuredBets = [
  {
    id: "fb-1",
    title: "Weekend Treble",
    description: "Three favorites combined into one higher-return slip.",
    returnText: "Potential return x4.8",
    accent: "sunrise"
  },
  {
    id: "fb-2",
    title: "Courtside Combo",
    description: "NBA spread plus player points special.",
    returnText: "Boosted by 22%",
    accent: "field"
  },
  {
    id: "fb-3",
    title: "Late Night Goals",
    description: "Over 2.5 goals across two European fixtures.",
    returnText: "Popular with live bettors",
    accent: "ember"
  }
];

export const fallbackFixtures = [
  {
    id: "fixture-1",
    league: "Premier League",
    sport: "Football",
    kickoff: "Today, 19:30",
    match: "Arsenal vs Chelsea",
    market: "Match Winner",
    odds: { Home: 1.82, Draw: 3.55, Away: 4.2 },
    trend: "+18% slips on Arsenal",
    boost: "Same Game Boost",
    status: "Pre-match"
  },
  {
    id: "fixture-2",
    league: "La Liga",
    sport: "Football",
    kickoff: "Today, 21:00",
    match: "Barcelona vs Sevilla",
    market: "Goals Over/Under 2.5",
    odds: { Over: 1.74, Under: 2.06 },
    trend: "Goals market heating up",
    boost: "Early Payout",
    status: "Pre-match"
  },
  {
    id: "fixture-3",
    league: "NBA",
    sport: "Basketball",
    kickoff: "Tonight, 02:00",
    match: "Lakers vs Celtics",
    market: "Spread",
    odds: { "LAL -3.5": 1.91, "BOS +3.5": 1.91 },
    trend: "Balanced action on both sides",
    boost: "Flash Odds",
    status: "Pre-match"
  },
  {
    id: "fixture-4",
    league: "UCL",
    sport: "Football",
    kickoff: "Tomorrow, 20:00",
    match: "Inter vs Bayern",
    market: "Both Teams To Score",
    odds: { Yes: 1.68, No: 2.12 },
    trend: "Sharp money on BTTS",
    boost: "Acca Insurance",
    status: "Pre-match"
  }
];

export const stats = {
  activeUsers: "24.8k",
  liveMarkets: 312,
  payoutTime: "< 5 min",
  boostedOdds: 18,
  depositMethod: "Paystack"
};

export const sportsSelections = [
  { id: "football", name: "Football", competitions: 124, featured: true },
  { id: "basketball", name: "Basketball", competitions: 42, featured: true },
  { id: "tennis", name: "Tennis", competitions: 31, featured: false },
  { id: "baseball", name: "Baseball", competitions: 16, featured: false },
  { id: "mma", name: "MMA", competitions: 12, featured: false },
  { id: "esports", name: "eSports", competitions: 28, featured: true },
  { id: "handball", name: "Handball", competitions: 14, featured: false },
  { id: "hockey", name: "Ice Hockey", competitions: 18, featured: false }
];

export const virtualGames = [
  {
    id: "virtual-football",
    title: "Virtual Football League",
    description: "Fast-cycle football fixtures with instant settlement and live-style odds.",
    cadence: "Every 3 minutes",
    category: "Football",
    jackpot: 18000000
  },
  {
    id: "virtual-racing",
    title: "Virtual Horse Racing",
    description: "Broadcast-style horse racing cards with boosted exotic markets.",
    cadence: "Every 5 minutes",
    category: "Racing",
    jackpot: 9500000
  },
  {
    id: "virtual-basketball",
    title: "Virtual Hoops Arena",
    description: "Quick basketball simulations built for in-play style picks and totals.",
    cadence: "Every 4 minutes",
    category: "Basketball",
    jackpot: 12300000
  }
];
