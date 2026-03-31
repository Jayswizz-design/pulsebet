import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  featuredBets,
  sportsSelections,
  stats,
  virtualGames
} from "./data.js";
import { requireAuth } from "./auth.js";
import { connectToDatabase } from "./db.js";
import { getFeaturedFixtureDetails, getLiveFixtures } from "./live-service.js";
import { getUserById, loginUser, registerUser } from "./user-store.js";

const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");
let databaseReady = false;

app.use(cors());
app.use(express.json());

function ensureDatabase(res) {
  if (databaseReady) {
    return true;
  }

  res.status(503).json({
    message: "Database is not available yet. Public sportsbook feeds still work."
  });
  return false;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", databaseReady });
});

app.get("/api/live-center", async (_req, res) => {
  const liveData = await getLiveFixtures();
  res.json({
    fixtures: liveData.fixtures,
    source: liveData.source,
    live: liveData.live,
    lastUpdated: new Date().toISOString()
  });
});

app.get("/api/match-center", async (_req, res) => {
  const details = await getFeaturedFixtureDetails();
  res.json({
    ...details,
    lastUpdated: new Date().toISOString()
  });
});

app.get("/api/featured-bets", (_req, res) => {
  res.json(featuredBets);
});

app.get("/api/stats", (_req, res) => {
  res.json(stats);
});

app.get("/api/sports", (_req, res) => {
  res.json(sportsSelections);
});

app.get("/api/virtual-games", (_req, res) => {
  res.json(virtualGames);
});

app.post("/api/auth/register", async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required." });
    return;
  }

  try {
    const result = await registerUser({ name, email, password });

    if (result.error) {
      res.status(409).json({ message: result.error });
      return;
    }

    res.status(201).json({
      user: result.user,
      token: result.token,
      message: "Registration successful."
    });
  } catch (_error) {
    res.status(500).json({ message: "Unable to register right now." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  try {
    const result = await loginUser({ email, password });

    if (result.error) {
      res.status(401).json({ message: result.error });
      return;
    }

    res.json({ user: result.user, token: result.token });
  } catch (_error) {
    res.status(500).json({ message: "Unable to log in right now." });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  try {
    const user = await getUserById(req.auth.sub);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json({ user });
  } catch (_error) {
    res.status(500).json({ message: "Unable to load user profile." });
  }
});

app.post("/api/payments/paystack/initialize", requireAuth, async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const { amount } = req.body || {};
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

  try {
    const user = await getUserById(req.auth.sub);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (!paystackSecret) {
      res.status(503).json({
        message: "PAYSTACK_SECRET_KEY is not configured on the server."
      });
      return;
    }

    if (!amount) {
      res.status(400).json({ message: "Amount is required." });
      return;
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(Number(amount) * 100),
        callback_url: process.env.PAYSTACK_CALLBACK_URL || "http://localhost:5173/",
        metadata: {
          source: "PulseBet deposit",
          userId: user.id
        }
      })
    });

    const payload = await response.json();

    if (!response.ok || !payload.status) {
      res.status(502).json({
        message: payload.message || "Paystack initialization failed."
      });
      return;
    }

    res.json({
      authorization_url: payload.data.authorization_url,
      access_code: payload.data.access_code,
      reference: payload.data.reference
    });
  } catch (_error) {
    res.status(502).json({ message: "Unable to reach Paystack right now." });
  }
});

app.use(express.static(clientDistPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    next();
    return;
  }

  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

connectToDatabase()
  .then(() => {
    databaseReady = true;
    console.log("MongoDB connected");
  })
  .catch((error) => {
    databaseReady = false;
    console.error("MongoDB unavailable, continuing with public feed routes only:", error.message);
  });


