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

const USERS = {
  me: { id:'me', name:'Timothée Bénédet', handle:'@timothee', color:'#C16B2C', init:'TB' },
};

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

Object.assign(window, {
  BEER_HUES, VERDICTS, FEELINGS, CHARACTERS, USERS, BREWERIES, BEERS,
  beerById, FEED, VENUES, BADGES, CHALLENGES, JOURNAL, ME_TASTE,
});
