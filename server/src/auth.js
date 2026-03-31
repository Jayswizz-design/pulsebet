import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

export function createAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name
    },
    getJwtSecret(),
    {
      expiresIn: "7d"
    }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  try {
    const token = header.slice(7);
    req.auth = verifyAuthToken(token);
    next();
  } catch (_error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}
