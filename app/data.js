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

Object.assign(window, {
  BEER_HUES, VERDICTS, FEELINGS, CHARACTERS, USERS, setActiveUser, BREWERIES, BEERS,
  beerById, FEED, VENUES, BADGES, CHALLENGES, JOURNAL, ME_TASTE,
  userStore, authStore,
});
