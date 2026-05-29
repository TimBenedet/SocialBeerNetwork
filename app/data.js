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

const BREWERIES = {
   ondes:   { name:'Brasserie des Ondes',  city:'Lyon' },
  pavlov:   { name:'Pavlov Brewing',       city:'Bruxelles' },
  noirsel:  { name:'Noir & Sel',           city:'Nantes' },
  hoplab:   { name:'HopLab',               city:'Paris' },
  verger:   { name:'Le Verger Sauvage',    city:'Annecy' },
  comptoir: { name:'Comptoir Houblon',     city:'Lille' },
};

const BEERS = [
  {
    id:'brume', name:'Brume', style:'New England IPA', hue:'hazy',
    brewery:'hoplab', abv:6.4, ibu:35, glassFill:.82,
    desc:"Une IPA trouble et juteuse, débordante de fruits tropicaux. Le houblon Citra et Mosaic donne une explosion de mangue et de fruit de la passion, sur une trame veloutée presque sans amertume.",
    feelings:[['Rafraîchissant',71],['Festif',54],['Aventureux',38]],
    characters:[['Fruité',88],['Agrumes',62],['Velouté',47],['Houblonné',44]],
    verdicts:{love:52,again:31,fine:12,meh:4,never:1},
    checkins:14200,
  },
  {
    id:'velours', name:'Velours Noir', style:'Imperial Stout', hue:'stout',
    brewery:'noirsel', abv:9.2, ibu:55, glassFill:.9,
    desc:"Un stout impérial dense, vieilli sur fèves de cacao et vanille. Café noir, chocolat amer et une chaleur enveloppante qui s'étire en finale.",
    feelings:[['Réconfortant',79],['Contemplatif',61],['Cosy',55]],
    characters:[['Torréfié',84],['Caramel',58],['Velouté',52],['Amer',40]],
    verdicts:{love:61,again:24,fine:9,meh:4,never:2},
    checkins:8700,
  },
  {
    id:'pepite', name:'Pépite', style:'Pilsner', hue:'pale',
    brewery:'ondes', abv:4.8, ibu:28, glassFill:.85,
    desc:"Une pilsner de soif, nette et croquante. Pain frais, une pointe de miel et un amer herbacé franc qui claque en finale.",
    feelings:[['Rafraîchissant',88],['Énergisant',49],['Apaisant',30]],
    characters:[['Sec',64],['Floral',45],['Maltée',42],['Amer',38]],
    verdicts:{love:28,again:46,fine:20,meh:5,never:1},
    checkins:21500,
  },
  {
    id:'sauvage', name:'Saison Sauvage', style:'Saison', hue:'gold',
    brewery:'verger', abv:5.6, ibu:24, glassFill:.8,
    desc:"Une saison rustique fermentée avec des levures sauvages. Poivre, écorce d'agrume et une effervescence champenoise qui réveille le palais.",
    feelings:[['Aventureux',66],['Contemplatif',41],['Festif',37]],
    characters:[['Épicé',58],['Acidulé',52],['Sec',49],['Pétillant',46]],
    verdicts:{love:39,again:35,fine:18,meh:6,never:2},
    checkins:5400,
  },
  {
    id:'aurore', name:'Aurore', style:'Berliner Weisse', hue:'pink',
    brewery:'pavlov', abv:3.9, ibu:8, glassFill:.83,
    desc:"Une weisse acidulée infusée à la framboise et l'hibiscus. Vive, presque pétillante, d'un rose lumineux. La gorgée de fin d'été.",
    feelings:[['Rafraîchissant',74],['Festif',58],['Énergisant',33]],
    characters:[['Acidulé',81],['Fruité',69],['Pétillant',44]],
    verdicts:{love:44,again:33,fine:15,meh:6,never:2},
    checkins:6800,
  },
  {
    id:'ambre', name:'Vieil Ambre', style:'Amber Ale', hue:'amber',
    brewery:'comptoir', abv:5.4, ibu:32, glassFill:.86,
    desc:"Une ambrée maltée et réconfortante. Caramel, croûte de pain et noisette grillée, équilibrée par un houblonnage discret.",
    feelings:[['Réconfortant',72],['Cosy',60],['Nostalgique',38]],
    characters:[['Maltée',76],['Caramel',64],['Boisé',38]],
    verdicts:{love:31,again:44,fine:18,meh:5,never:2},
    checkins:9300,
  },
  {
    id:'comete', name:'Comète', style:'West Coast IPA', hue:'gold',
    brewery:'hoplab', abv:6.8, ibu:65, glassFill:.84,
    desc:"Une West Coast franche et résineuse. Pin, pamplemousse et une amertume tranchante, limpide comme de l'or liquide.",
    feelings:[['Énergisant',64],['Audacieux',57],['Aventureux',41]],
    characters:[['Houblonné',82],['Amer',71],['Agrumes',58],['Sec',44]],
    verdicts:{love:42,again:33,fine:16,meh:6,never:3},
    checkins:11200,
  },
  {
    id:'rousse', name:'Tempête Rousse', style:'Irish Red', hue:'copper',
    brewery:'ondes', abv:5.0, ibu:26, glassFill:.87,
    desc:"Une rousse irlandaise tout en rondeur. Caramel toffee, une touche torréfiée et une finale sèche et nette.",
    feelings:[['Cosy',68],['Réconfortant',61],['Apaisant',34]],
    characters:[['Caramel',70],['Maltée',66],['Torréfié',40]],
    verdicts:{love:26,again:48,fine:19,meh:5,never:2},
    checkins:4700,
  },
];

function beerById(id){ return BEERS.find(b=>b.id===id); }

// the current user's own recent check-ins
const FEED = [
  {
    id:'f1', user:'me', beerId:'brume', verdict:'love', time:'il y a 14 min',
    feelings:['Rafraîchissant','Festif'], characters:['Fruité','Agrumes'],
    note:"Première gorgée et c'est l'été dans le verre. La mangue domine sans jamais devenir écœurante.",
    venue:'Cave Saint-Georges', mine:true,
  },
  {
    id:'f2', user:'me', beerId:'velours', verdict:'love', time:'hier soir',
    feelings:['Contemplatif','Cosy'], characters:['Torréfié','Velouté'],
    note:"À siroter lentement un soir de pluie. Le cacao reste longtemps en bouche.",
    venue:'Chez moi', mine:true,
  },
  {
    id:'f3', user:'me', beerId:'comete', verdict:'again', time:'il y a 3 j',
    feelings:['Énergisant','Audacieux'], characters:['Houblonné','Amer'],
    note:"Amertume franche et résineuse, exactement ce que je cherchais ce soir-là.",
    venue:'Le Houblon Vagabond', mine:true,
  },
  {
    id:'f4', user:'me', beerId:'aurore', verdict:'again', time:'la semaine dernière',
    feelings:['Rafraîchissant','Festif'], characters:['Acidulé','Fruité'],
    note:"Rose, vive, parfaite en terrasse. L'hibiscus apporte un petit côté floral inattendu.",
    venue:'Terrasse du Quai', mine:true,
  },
  {
    id:'f5', user:'me', beerId:'sauvage', verdict:'fine', time:'la semaine dernière',
    feelings:['Aventureux'], characters:['Épicé','Acidulé'],
    note:"Intéressante, très sèche. Le côté sauvage déroute un peu au début.",
    venue:'Bar des Capucins', mine:true,
  },
];

const VENUES = [
  { id:'v1', name:'Cave Saint-Georges', type:'Cave à bières', area:'Vieux Lyon', taps:18, friends:4, lat:45.7601, lng:4.8273, hot:true },
  { id:'v2', name:'Le Houblon Vagabond', type:'Bar à bières', area:'Croix-Rousse', taps:24, friends:6, lat:45.7745, lng:4.8324, hot:true },
  { id:'v3', name:'Brasserie des Ondes', type:'Brasserie · Taproom', area:'Confluence', taps:12, friends:2, lat:45.7415, lng:4.8158, hot:false },
  { id:'v4', name:'Terrasse du Quai', type:'Bar', area:'Berges du Rhône', taps:9, friends:3, lat:45.7585, lng:4.8410, hot:false },
  { id:'v5', name:'Bar des Capucins', type:'Bar à bières', area:'Presqu\'île', taps:16, friends:1, lat:45.7668, lng:4.8338, hot:false },
  { id:'v6', name:'Comptoir Houblon', type:'Cave & dégustation', area:'Guillotière', taps:30, friends:5, lat:45.7548, lng:4.8445, hot:true },
];

const BADGES = [
  { id:'b1', name:'Première gorgée', desc:'Ton tout premier check-in', icon:'drop', earned:true, color:'#C16B2C' },
  { id:'b2', name:'Globe-houblon', desc:'10 styles différents', icon:'globe', earned:true, color:'#4E7A4E' },
  { id:'b3', name:'Âme contemplative', desc:'20 bières « Contemplatif »', icon:'moon', earned:true, color:'#2F4B7C' },
  { id:'b4', name:'Chasseur d\'amertume', desc:'15 IPA enregistrées', icon:'hop', earned:true, color:'#A6531F' },
  { id:'b5', name:'Cœur tendre', desc:'25 coups de cœur', icon:'heart', earned:false, prog:18, total:25, color:'#C0492F' },
  { id:'b6', name:'Explorateur sauvage', desc:'10 bières fermentées sauvages', icon:'leaf', earned:false, prog:6, total:10, color:'#4E7A4E' },
  { id:'b7', name:'Veilleur', desc:'Check-in après minuit ×5', icon:'moon', earned:false, prog:3, total:5, color:'#6E7585' },
  { id:'b8', name:'Sommelier', desc:'100 tags de caractère posés', icon:'star', earned:false, prog:74, total:100, color:'#C16B2C' },
];

const CHALLENGES = [
  { id:'c1', title:'Tour de France des styles', desc:'Goûte une bière de chaque région ce mois-ci', icon:'map', done:7, total:13 },
  { id:'c2', title:'Saison des sours', desc:'5 bières acidulées avant fin juin', icon:'lemon', done:3, total:5 },
  { id:'c3', title:'Carnet bien rempli', desc:'Enregistre 30 dégustations cette semaine', icon:'cheers', done:22, total:30 },
];

// the current user's tasting journal
const JOURNAL = [
  { month:'Mai 2026', entries:[
    { beerId:'brume', verdict:'love', date:'27 mai', feelings:['Rafraîchissant'], characters:['Fruité','Agrumes'] },
    { beerId:'velours', verdict:'love', date:'24 mai', feelings:['Contemplatif','Cosy'], characters:['Torréfié'] },
    { beerId:'pepite', verdict:'again', date:'21 mai', feelings:['Rafraîchissant'], characters:['Sec','Floral'] },
    { beerId:'comete', verdict:'fine', date:'18 mai', feelings:['Audacieux'], characters:['Houblonné','Amer'] },
  ]},
  { month:'Avril 2026', entries:[
    { beerId:'aurore', verdict:'love', date:'29 avr', feelings:['Festif'], characters:['Acidulé','Fruité'] },
    { beerId:'ambre', verdict:'again', date:'22 avr', feelings:['Cosy','Réconfortant'], characters:['Caramel'] },
    { beerId:'rousse', verdict:'fine', date:'14 avr', feelings:['Apaisant'], characters:['Maltée'] },
    { beerId:'sauvage', verdict:'again', date:'06 avr', feelings:['Aventureux'], characters:['Épicé','Sec'] },
  ]},
];

const ME_TASTE = ['Houblonné','Fruité','Torréfié','Rafraîchissant','Contemplatif','Agrumes','Velouté'];

Object.assign(window, {
  BEER_HUES, VERDICTS, FEELINGS, CHARACTERS, USERS, BREWERIES, BEERS,
  beerById, FEED, VENUES, BADGES, CHALLENGES, JOURNAL, ME_TASTE,
});
