/* SocialBeerNetwork — auth + per-user data backend -------------------------
 *
 * Auth (login-only): users defined via env vars, sessions in memory (a Map).
 * Data: each user's check-ins + saved venues are persisted server-side in
 * SQLite (on a PersistentVolume) so they follow the user across devices and
 * URLs/origins — the client no longer relies on localStorage.
 *
 * Routes:
 *   POST /api/login   { username, password } -> { token, user }
 *   GET  /api/me      (Authorization: Bearer <token>) -> { user }
 *   POST /api/logout  (Authorization: Bearer <token>) -> { ok: true }
 *   GET  /api/data    (auth) -> { checkins: [...], venues: [...] }
 *   PUT  /api/data    (auth) { checkins, venues } -> { ok: true }
 *   GET  /api/health  -> { ok: true }
 */
'use strict';

const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json({ limit: '2mb' })); // check-ins can embed small base64 photos

const PORT = process.env.PORT || 3001;

/* --- Database (SQLite on a persistent volume) ------------------------------
 * One row per user holding a JSON blob of { checkins, venues }. Simple and
 * plenty for this app; the JSON shape stays owned by the frontend.
 */
const DB_DIR = process.env.DATA_DIR || '/data';
try { fs.mkdirSync(DB_DIR, { recursive: true }); } catch (e) {}
const db = new Database(path.join(DB_DIR, 'socialbeernetwork.db'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS user_data (
  user_key TEXT PRIMARY KEY,
  data     TEXT NOT NULL,
  updated_at INTEGER NOT NULL
)`);
const selData = db.prepare('SELECT data FROM user_data WHERE user_key = ?');
const upsertData = db.prepare(`INSERT INTO user_data (user_key, data, updated_at)
  VALUES (@key, @data, @ts)
  ON CONFLICT(user_key) DO UPDATE SET data = @data, updated_at = @ts`);

function loadUserData(key) {
  const row = selData.get(key);
  if (!row) return { checkins: [], venues: [] };
  try {
    const d = JSON.parse(row.data);
    return { checkins: Array.isArray(d.checkins) ? d.checkins : [], venues: Array.isArray(d.venues) ? d.venues : [] };
  } catch (e) {
    return { checkins: [], venues: [] };
  }
}
function saveUserData(key, data) {
  const clean = {
    checkins: Array.isArray(data && data.checkins) ? data.checkins : [],
    venues: Array.isArray(data && data.venues) ? data.venues : [],
  };
  upsertData.run({ key, data: JSON.stringify(clean), ts: Date.now() });
  return clean;
}

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

// --- per-user data (auth required) ---
function requireUser(req, res) {
  const user = userFromToken(bearer(req));
  if (!user) { res.status(401).json({ error: 'Non authentifié' }); return null; }
  return user;
}

app.get('/api/data', (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;
  res.json(loadUserData(user.key));
});

app.put('/api/data', (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;
  const saved = saveUserData(user.key, req.body || {});
  res.json({ ok: true, ...saved });
});

app.listen(PORT, () => {
  console.log(`SocialBeerNetwork auth backend listening on :${PORT}`);
});
