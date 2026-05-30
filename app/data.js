/* untappdReborn — mock data ----------------------------------------------- */

// beer "colours" by SRM-ish family, used to fill the glass placeholders
const BEER_HUES = {
  pale:   { liquid: '#F2C14E', foam: '#FBF2D8', glow: '#FCEFC7' },
  gold:   { liquid: '#E8A93C', foam: '#FBEFD2', glow: '#FBE9C4' },
  amber:  { liquid: '#C9772A', foam: '#F6E2C6', glow: '#F4DFC0' },
  copper: { liquid: '#A6531F', foam: '#EAD2B4', glow: '#EFD9BD' },
  ruby:   { liquid: '#7E2B22', foam: '#E6C2B8', glow: '#E9CFC4' },
  brown:  { liquid: '#5A3315', foam: '#D8C2A6', glow: '#E0CCAE' },
  stout:  { liquid: '#2A1B12', foam: '#D9C3A0', glow: '#CBBBA0' },
  hazy:   { liquid: '#F0B43F', foam: '#FBEAC9', glow: '#FBE7BE' },
  pink:   { liquid: '#D96A86', foam: '#F7DEE2', glow: '#F8E1E6' },
};

const VERDICTS = {
  love:  { key: 'love',  label: 'Coup de cœur', short: 'Coup de cœur' },
  again: { key: 'again', label: 'À refaire',    short: 'À refaire' },
  fine:  { key: 'fine',  label: 'Sympa',        short: 'Sympa' },
  meh:   { key: 'meh',   label: 'Bof',          short: 'Bof' },
  never: { key: 'never', label: 'Jamais',       short: 'Jamais' },
};

// feeling (mood) tags & character (flavour) tags for the emotional rating
const FEELINGS = ['Réconfortant','Festif','Contemplatif','Rafraîchissant','Aventureux','Cosy','Nostalgique','Énergisant','Apaisant','Audacieux'];
const CHARACTERS = ['Houblonné','Fruité','Torréfié','Acidulé','Maltée','Amer','Floral','Boisé','Épicé','Sec','Velouté','Pétillant','Caramel','Agrumes'];

// Known profiles, keyed like the backend's user.key. `me` is a pointer to the
// currently logged-in profile — set by setActiveUser() after login, so existing
// `USERS.me` / <Avatar user="me"> references always reflect the active user.
const USERS = {
  tim:   { id:'tim',   key:'tim',   name:'Timothée Bénédet', handle:'@timothee', color:'#C16B2C', init:'TB' },
  guest: { id:'guest', key:'guest', name:'Invité',           handle:'@guest',    color:'#4E7A4E', init:'IN' },
};
// default pointer until a session is restored/established
USERS.me = USERS.tim;

// point USERS.me at a profile (from a backend `user` object or a known key)
function setActiveUser(user) {
  if (!user) return USERS.me;
  const key = typeof user === 'string' ? user : user.key;
  const known = USERS[key];
  // merge any fresh fields coming from the backend onto the known profile
  const profile = known
    ? Object.assign(known, typeof user === 'object' ? user : {})
    : Object.assign({ id:key, key }, typeof user === 'object' ? user : {});
  USERS[key] = profile;
  USERS.me = profile;
  return profile;
}

const BREWERIES = {};

const BEERS = [];

function beerById(id){ return BEERS.find(b=>b.id===id); }

// the current user's own recent check-ins
const FEED = [];

const VENUES = [];

const BADGES = [];

const CHALLENGES = [];

// the current user's tasting journal
const JOURNAL = [];

const ME_TASTE = [];

/* --- Per-user localStorage -------------------------------------------------
 * Profile data is partitioned by the active user so Timothée and Guest never
 * share state. Keys look like `ur:<userKey>:<name>`.
 */
const userStore = {
  key(name) { return `ur:${(USERS.me && USERS.me.key) || 'anon'}:${name}`; },
  get(name, fallback) {
    try {
      const raw = localStorage.getItem(this.key(name));
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(name, value) {
    try { localStorage.setItem(this.key(name), JSON.stringify(value)); } catch (e) {}
  },
};

/* --- Session token ---------------------------------------------------------- */
const AUTH_TOKEN_KEY = 'ur:auth:token';
const authStore = {
  getToken() { try { return localStorage.getItem(AUTH_TOKEN_KEY) || null; } catch (e) { return null; } },
  setToken(t) { try { t ? localStorage.setItem(AUTH_TOKEN_KEY, t) : localStorage.removeItem(AUTH_TOKEN_KEY); } catch (e) {} },
  clear() { this.setToken(null); },
};

/* --- Data version ----------------------------------------------------------
 * Screens read the module-level arrays (BEERS/FEED/JOURNAL) directly. After a
 * mutation we bump this version and notify subscribers so they re-render.
 */
let DATA_VERSION = 0;
const dataListeners = new Set();
function bumpData() { DATA_VERSION++; dataListeners.forEach(fn => { try { fn(DATA_VERSION); } catch (e) {} }); }
function onDataChange(fn) { dataListeners.add(fn); return () => dataListeners.delete(fn); }

// React hook: re-render the calling component whenever the per-user data
// changes. Defined here (a plain global) so every Babel-compiled screen file
// can call it by bare identifier regardless of script load order.
function useDataVersion() {
  const R = window.React;
  const [, setV] = R.useState(0);
  R.useEffect(() => onDataChange(v => setV(v)), []);
}

/* --- Check-ins (the source of truth for user-added beers) -------------------
 * Persisted per user under `ur:<key>:checkins`. Each check-in carries its own
 * beer definition so the carnet/feed can render it without a separate catalog.
 */
function genId(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 9);
}

const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
function monthLabel(ts) {
  const d = new Date(ts);
  const m = MONTHS_FR[d.getMonth()];
  return m.charAt(0).toUpperCase() + m.slice(1) + ' ' + d.getFullYear();
}
function dayLabel(ts) {
  const d = new Date(ts);
  return d.getDate() + ' ' + MONTHS_FR[d.getMonth()].slice(0, 4) + '.';
}
function relTime(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const days = Math.floor(h / 24);
  if (days === 1) return 'hier';
  if (days < 7) return `il y a ${days} j`;
  return dayLabel(ts);
}

// Rebuild BEERS / FEED / JOURNAL (in place) from the active user's check-ins.
function rebuildFromCheckins(checkins) {
  BEERS.length = 0;
  FEED.length = 0;
  JOURNAL.length = 0;
  Object.keys(BREWERIES).forEach(k => delete BREWERIES[k]);

  // newest first
  const sorted = checkins.slice().sort((a, b) => b.createdAt - a.createdAt);

  const monthMap = new Map();
  sorted.forEach(ci => {
    const beer = ci.beer;
    if (beer && !beerById(beer.id)) BEERS.push(beer);
    if (beer && beer.brewery && ci.breweryName && !BREWERIES[beer.brewery]) {
      BREWERIES[beer.brewery] = { name: ci.breweryName, city: ci.breweryCity || '' };
    }
    FEED.push({
      id: ci.id, user: 'me', beerId: beer ? beer.id : null, verdict: ci.verdict,
      time: relTime(ci.createdAt), feelings: ci.feelings || [], characters: ci.characters || [],
      note: ci.note || '', venue: ci.place || '', mine: true,
    });
    const ml = monthLabel(ci.createdAt);
    if (!monthMap.has(ml)) { const g = { month: ml, entries: [] }; monthMap.set(ml, g); JOURNAL.push(g); }
    monthMap.get(ml).entries.push({
      beerId: beer ? beer.id : null, verdict: ci.verdict, date: dayLabel(ci.createdAt),
      feelings: ci.feelings || [], characters: ci.characters || [],
    });
  });
}

const checkinStore = {
  all() { return userStore.get('checkins', []); },
  // Load the active user's check-ins into the live arrays. Call after login.
  hydrate() { rebuildFromCheckins(this.all()); bumpData(); },
  add(checkin) {
    const list = this.all();
    list.push(checkin);
    userStore.set('checkins', list);
    rebuildFromCheckins(list);
    bumpData();
    return checkin;
  },
};

/* --- Geocoding (shared by the map + the check-in place step) ---------------- */
async function geocodePlace(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=' + encodeURIComponent(query);
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  const data = await res.json();
  if (!data || !data.length) return null;
  const r = data[0];
  const a = r.address || {};
  const area = a.suburb || a.neighbourhood || a.city_district || a.city || a.town || a.village
    || (r.display_name.split(',')[1] || '').trim() || 'Adresse';
  return { area, lat: parseFloat(r.lat), lng: parseFloat(r.lon), display: r.display_name };
}

Object.assign(window, {
  BEER_HUES, VERDICTS, FEELINGS, CHARACTERS, USERS, setActiveUser, BREWERIES, BEERS,
  beerById, FEED, VENUES, BADGES, CHALLENGES, JOURNAL, ME_TASTE,
  userStore, authStore, checkinStore, geocodePlace,
  bumpData, onDataChange, useDataVersion, genId,
});
