/* SocialBeerNetwork — minimal auth backend ---------------------------------
 *
 * Login-only API. No database: users are defined via env vars, sessions live
 * in memory (a Map), like the homelab fermentation-backend. Profile data stays
 * client-side (localStorage, partitioned per user) — this service only proves
 * "who you are" and hands back a token + the user's public profile.
 *
 * Routes:
 *   POST /api/login   { username, password } -> { token, user }
 *   GET  /api/me      (Authorization: Bearer <token>) -> { user }
 *   POST /api/logout  (Authorization: Bearer <token>) -> { ok: true }
 *   GET  /api/health  -> { ok: true }
 */
'use strict';

const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

/* --- Users -------------------------------------------------------------------
 * Credentials come from env vars so they aren't baked into the image.
 * Defaults match the requested accounts for local/dev use.
 * Each user exposes a `key` used by the frontend to partition localStorage,
 * plus public profile fields (no password leaves this object).
 */
const USERS = {
  tim: {
    key: 'tim',
    username: process.env.TIM_USERNAME || 'Tim',
    password: process.env.TIM_PASSWORD || 'berlin',
    profile: { key: 'tim', name: 'Timothée Bénédet', handle: '@timothee', init: 'TB', color: '#C16B2C' },
  },
  guest: {
    key: 'guest',
    username: process.env.GUEST_USERNAME || 'guest',
    password: process.env.GUEST_PASSWORD || 'guest',
    profile: { key: 'guest', name: 'Invité', handle: '@guest', init: 'IN', color: '#4E7A4E' },
  },
};

// case-insensitive lookup by username
function findUser(username) {
  if (!username) return null;
  const u = String(username).trim().toLowerCase();
  return Object.values(USERS).find(x => x.username.toLowerCase() === u) || null;
}

// timing-safe password compare
function passwordMatches(provided, expected) {
  const a = Buffer.from(String(provided || ''));
  const b = Buffer.from(String(expected || ''));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/* --- Sessions (in-memory) -------------------------------------------------- */
const sessions = new Map(); // token -> { userKey, createdAt }

function newToken() {
  return crypto.randomBytes(24).toString('hex');
}

function bearer(req) {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function userFromToken(token) {
  const s = token && sessions.get(token);
  if (!s) return null;
  return USERS[s.userKey] || null;
}

/* --- Routes ---------------------------------------------------------------- */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = findUser(username);
  if (!user || !passwordMatches(password, user.password)) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  const token = newToken();
  sessions.set(token, { userKey: user.key, createdAt: Date.now() });
  res.json({ token, user: user.profile });
});

app.get('/api/me', (req, res) => {
  const user = userFromToken(bearer(req));
  if (!user) return res.status(401).json({ error: 'Non authentifié' });
  res.json({ user: user.profile });
});

app.post('/api/logout', (req, res) => {
  const token = bearer(req);
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`SocialBeerNetwork auth backend listening on :${PORT}`);
});
