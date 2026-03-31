import bcrypt from "bcryptjs";
import { createAuthToken } from "./auth.js";
import { User } from "./models/User.js";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    balance: user.balance
  };
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash
  });

  return {
    user: serializeUser(user),
    token: createAuthToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    })
  };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { error: "Invalid email or password." };
  }

  return {
    user: serializeUser(user),
    token: createAuthToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    })
  };
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  return user ? serializeUser(user) : null;
}
