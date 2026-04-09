import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
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

function formatNaira(value) {
  return nairaFormatter.format(Number(value) || 0);
}
function App() {
  const [betSlip, setBetSlip] = useState([]);
  const [sports, setSports] = useState([]);
  const [auth, setAuth] = useState({ user: null, token: null, loading: true });

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
      <div className="min-h-screen bg-brand text-slate-50">
        <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-2 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
          <Header user={auth.user} onLogout={handleLogout} />
          <Routes>
            <Route
              path="/"
              element={
                <SportsbookPage
                  sports={sports}
                  betSlip={betSlip}
                  onAddToSlip={addToSlip}
                  onRemoveFromSlip={removeFromSlip}
                  user={auth.user}
                  token={auth.token}
                />
              }
            />
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

function Header({ user, onLogout }) {
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

function SportsbookPage({ sports, betSlip, onAddToSlip, onRemoveFromSlip, user, token }) {
  const [livePayload, setLivePayload] = useState(null);
  const [liveError, setLiveError] = useState("");
  const [featuredBets, setFeaturedBets] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSport, setSelectedSport] = useState("all");
  const [depositAmount, setDepositAmount] = useState(5000);
  const [depositMessage, setDepositMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchJson(path) {
      try {
        const response = await fetch(`${apiBase}${path}`);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        return await response.json();
      } catch (_error) {
        return null;
      }
    }

    async function loadPage() {
      setLiveError("");

      const [liveJson, featuredJson, statsJson] = await Promise.all([
        fetchJson("/api/live-center"),
        fetchJson("/api/featured-bets"),
        fetchJson("/api/stats")
      ]);

      if (cancelled) {
        return;
      }

      if (liveJson && Array.isArray(liveJson.fixtures)) {
        setLivePayload(liveJson);
      } else {
        setLivePayload({ fixtures: [], source: "Feed unavailable", live: false, lastUpdated: null });
        setLiveError("Live feed unavailable. Ensure backend is running on port 4000.");
      }

      if (Array.isArray(featuredJson)) {
        setFeaturedBets(featuredJson);
      }

      if (statsJson && typeof statsJson === "object") {
        setStats(statsJson);
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, []);

  const fixtures = livePayload?.fixtures || [];
  const featuredFixture = fixtures[0];
  const isFallbackFeed = Boolean(livePayload && !livePayload.live);
  const marketFixtures = (selectedSport === "all"
    ? fixtures
    : fixtures.filter((fixture) => fixture.sport?.toLowerCase() === selectedSport.toLowerCase())).slice(0, 8);

  const totalOdds = betSlip.reduce((total, pick) => total * pick.price, 1);
  const stake = 100;
  const estimatedReturn = betSlip.length ? (totalOdds * stake).toFixed(2) : "0.00";

  async function handleDeposit() {
    setDepositMessage("");
    if (!token) {
      setDepositMessage("Log in first to initialize a Paystack deposit.");
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/payments/paystack/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(depositAmount) })
      });

      const payload = await response.json();
      if (!response.ok) {
        setDepositMessage(payload.message || "Unable to initialize deposit.");
        return;
      }

      window.location.href = payload.authorization_url;
    } catch (_error) {
      setDepositMessage("Unable to initialize Paystack right now.");
    }
  }

  return (
    <main className="grid flex-1 gap-4 sm:gap-5 lg:gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="order-2 space-y-4 sm:space-y-5 lg:order-1 lg:space-y-6">
        <section className="panel-card overflow-hidden">
          <div className="border-b border-white/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-lime-300">All Sports</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Selections panel</h2>
          </div>
          <div className="space-y-2 p-3">
            <button type="button" onClick={() => setSelectedSport("all")} className={["w-full rounded-2xl border px-4 py-3 text-left transition", selectedSport === "all" ? "border-lime-300/45 bg-lime-300/12 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"].join(" ")}>
              <span className="block font-medium">All Markets</span>
              <span className="text-xs text-slate-400">Every available sport</span>
            </button>
            {sports.map((sport) => (
              <button key={sport.id} type="button" onClick={() => setSelectedSport(sport.name)} className={["w-full rounded-2xl border px-4 py-3 text-left transition", selectedSport.toLowerCase() === sport.name.toLowerCase() ? "border-lime-300/45 bg-lime-300/12 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"].join(" ")}>
                <span className="flex items-center justify-between font-medium">
                  {sport.name}
                  {sport.featured ? <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-lime-300">Hot</span> : null}
                </span>
                <span className="mt-1 block text-xs text-slate-400">{sport.competitions} active competitions</span>
              </button>
            ))}
          </div>
        </section>

        <QuickTicketPanel betSlip={betSlip} onRemoveFromSlip={onRemoveFromSlip} stake={stake} totalOdds={totalOdds} estimatedReturn={estimatedReturn} />

        <WalletDepositPanel user={user} depositAmount={depositAmount} setDepositAmount={setDepositAmount} handleDeposit={handleDeposit} depositMessage={depositMessage} />`r`n        <SidebarAdsPanel sports={sports} />`r`n      </aside>

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

          <article className={["rounded-[24px] border p-5", isFallbackFeed ? "border-amber-300/20 bg-[linear-gradient(180deg,rgba(120,53,15,0.35),rgba(2,6,23,0.82))]" : "border-white/10 bg-slate-950/55"].join(" ")}>
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
                <div className="mt-3 flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <TeamIdentity name={featuredFixture.homeTeam} logo={featuredFixture.homeLogo} align="left" />
                  {featuredFixture.liveScore ? (
                    <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 font-display text-2xl font-bold text-lime-300">
                      {featuredFixture.liveScore.home} - {featuredFixture.liveScore.away}
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">vs</span>
                  )}
                  <TeamIdentity name={featuredFixture.awayTeam} logo={featuredFixture.awayLogo} align="right" />
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
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["Popular", "Live", "Boosted"].map((label, index) => (
                <span key={label} className={["shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em]", index === 0 ? "border-lime-300/35 bg-lime-300/10 text-lime-300" : "border-white/10 bg-white/5 text-slate-300"].join(" ")}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {isFallbackFeed ? (
            <div className="mt-5 rounded-[24px] border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-amber-50">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Fallback feed visible</p>
              <p className="mt-2 text-sm leading-6 text-amber-50/85">These markets are intentionally visible as scheduled backup content, so you can still browse fixtures and odds clearly when live data is unavailable.</p>
            </div>
          ) : null}

          <div className="mt-5 grid gap-4">
            {marketFixtures.map((fixture) => (
              <article key={fixture.id} className={["rounded-[24px] border p-5", isFallbackFeed ? "border-amber-300/15 bg-white/[0.06]" : "border-white/10 bg-white/[0.045]"].join(" ")}>
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
                      <TeamIdentity name={fixture.homeTeam} logo={fixture.homeLogo} align="left" compact />
                      {fixture.liveScore ? (
                        <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 font-display text-lg font-bold text-lime-300">{fixture.liveScore.home} - {fixture.liveScore.away}</span>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">vs</span>
                      )}
                      <TeamIdentity name={fixture.awayTeam} logo={fixture.awayLogo} align="right" compact />
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

                <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>{fixture.trend}</span>
                  <span className="text-slate-300">Tap any price to add it to the ticket</span>
                </div>
              </article>
            ))}
            {marketFixtures.length === 0 ? <div className={["rounded-[24px] border p-8 text-center", isFallbackFeed ? "border-dashed border-amber-300/20 bg-amber-300/10 text-amber-50" : "border-dashed border-white/12 bg-white/[0.03] text-slate-400"].join(" ")}>{liveError || "No live fixtures match this sport yet."}</div> : null}
          </div>
        </section>

        <section className="grid gap-4 lg:gap-5 lg:grid-cols-3">
          {featuredBets.map((bet) => (
            <article key={bet.id} className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${promoAccentClass[bet.accent] || "from-slate-800/80"} to-slate-950/90 p-5 shadow-xl shadow-black/10`}>
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

function QuickTicketPanel({ betSlip, onRemoveFromSlip, stake, totalOdds, estimatedReturn }) {
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

      {betSlip.length === 0 ? (
        <p className="py-8 text-sm leading-7 text-slate-400">Select odds from the sportsbook to start building a ticket. Your selections stay visible while you browse.</p>
      ) : (
        <div className="space-y-3 py-5">
          {betSlip.map((pick) => (
            <article key={pick.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
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

      <div className="grid gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-3 xl:grid-cols-1">
        <SummaryRow label="Stake" value={formatNaira(stake)} />
        <SummaryRow label="Total Odds" value={betSlip.length ? totalOdds.toFixed(2) : "0.00"} />
        <SummaryRow label="Potential Return" value={formatNaira(estimatedReturn)} />
      </div>

      <button type="button" className="mt-5 w-full rounded-full bg-[linear-gradient(135deg,#c9ff4d,#ebfdb1)] px-4 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5">
        Place bet
      </button>
    </section>
  );
}

function WalletDepositPanel({ user, depositAmount, setDepositAmount, handleDeposit, depositMessage }) {
  return (
    <section className="panel-card p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Wallet Deposit</p>
      <h2 className="mt-2 font-display text-2xl font-bold">Fund with Paystack (NGN)</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{user ? `Signed in as ${user.email}. Deposits are initialized in Nigerian naira through a JWT-protected backend route.` : "Log in to initialize a secure Paystack deposit from your wallet panel."}</p>
      <label className="mt-5 block text-sm text-slate-300">
        Deposit amount (NGN)
        <input type="number" min="100" value={depositAmount} onChange={(event) => setDepositAmount(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300/35" />
      </label>
      <button type="button" onClick={handleDeposit} className="mt-4 w-full rounded-full border border-white/12 bg-white/5 px-4 py-3 font-medium text-slate-100 transition hover:border-white/25 hover:bg-white/10">
        Deposit in naira via Paystack
      </button>
      {depositMessage ? <p className="mt-3 text-sm text-amber-200">{depositMessage}</p> : null}
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
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80"
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
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 text-[11px] uppercase tracking-[0.18em] text-white">
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
            <article className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>{fixture.league}</span>
                {fixture.country ? <span className="text-slate-600">&middot;</span> : null}
                {fixture.country ? <span>{fixture.country}</span> : null}
                <span className="text-slate-600">&middot;</span>
                <span>{fixture.kickoff}</span>
                <span className="text-slate-600">&middot;</span>
                <span>{fixture.state}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-slate-950/55 px-4 py-4">
                <TeamIdentity name={fixture.homeTeam} logo={fixture.homeLogo} align="left" />
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 font-display text-2xl font-bold text-lime-300">
                  {fixture.score ? `${fixture.score.home} - ${fixture.score.away}` : "vs"}
                </span>
                <TeamIdentity name={fixture.awayTeam} logo={fixture.awayLogo} align="right" />
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
                <InfoPill label="Venue" value={fixture.venue} />
                <InfoPill label="City" value={fixture.city || "TBC"} />
                <InfoPill label="Referee" value={fixture.referee || "Unassigned"} />
                <InfoPill label="Attendance" value={fixture.attendance || "Not posted"} />
              </div>
            </article>

            <article className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
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
        <div className="mt-5 rounded-[24px] border border-dashed border-white/12 bg-white/[0.03] p-8 text-center text-slate-400">
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
    <article className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Starting XI</p>
      <h3 className="mt-2 font-display text-2xl font-bold">{title}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map((entry) => (
          <div key={`${entry.player}-${entry.position}`} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
            <p className="font-medium text-white">{entry.player}</p>
            <p className="mt-1 text-sm text-slate-400">{entry.position}</p>
          </div>
        ))}
      </div>
    </article>
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
              <article key={item.label} className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-3 break-words font-display text-2xl font-bold text-white">{item.value}</p>
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
              <article key={item.title} className="rounded-[24px] border border-white/10 bg-slate-950/45 p-5">
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
          <div className="mt-5 rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-emerald-100">
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
    <main className="grid flex-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="panel-card p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Available Sports</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Navigation rail</h2>
        <div className="mt-5 space-y-2">
          {sports.map((sport) => (
            <div key={sport.id} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="font-medium text-white">{sport.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{sport.competitions} competitions</p>
            </div>
          ))}
        </div>
      </aside>

      <section className="space-y-5 lg:space-y-6">
        <section className="panel-hero p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Virtual Lobby</p>
          <h1 className="mt-3 max-w-[13ch] font-display text-4xl font-bold leading-none sm:text-5xl">Fast-cycle virtual games for round-the-clock play.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Virtual football, racing, and hoops are presented in the same design system as the sportsbook, with clearer cadence, category, and prize visibility.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <article key={game.id} className="panel-card p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-lime-300">{game.category}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{game.cadence}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold">{game.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{game.description}</p>
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-sm text-slate-400">Prize pool</span>
                <span className="font-display text-2xl font-bold text-lime-300">{formatNaira(Number(String(game.jackpot ?? 0).replace(/[^\d.]/g, "")) || 0)}</span>
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
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
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

function TeamIdentity({ name, logo, align = "left", compact = false }) {
  return (
    <div className={["flex min-w-0 items-center gap-3", align === "right" ? "flex-row-reverse text-right" : "text-left"].join(" ")}>
      <TeamLogo logo={logo} name={name} compact={compact} />
      <div className="min-w-0">
        <p className={["truncate font-display font-bold text-white", compact ? "text-lg" : "text-xl"].join(" ")}>{name}</p>
      </div>
    </div>
  );
}

function TeamLogo({ logo, name, compact = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const sizeClass = compact ? "h-10 w-10" : "h-12 w-12";

  if (!logo || imageFailed) {
    return (
      <div className={["grid shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 font-display text-sm font-bold text-lime-300", sizeClass].join(" ")}>
        {initials || "TM"}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      loading="lazy"
      onError={() => setImageFailed(true)}
      className={["shrink-0 rounded-2xl border border-white/10 bg-white/95 object-contain p-1", sizeClass].join(" ")}
    />
  );
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

export default App;

























