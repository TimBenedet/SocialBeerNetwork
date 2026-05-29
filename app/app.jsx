/* untappdReborn — app shell, routing, tweaks ------------------------------ */
const { useState, useEffect } = React;


const VARIANT_KEY = { 'Tags':'cloud', 'Curseurs':'sliders', 'Cartes':'cards' };

const NAV = [
  { id:'feed',     label:'Accueil',     icon:'home' },
  { id:'discover', label:'Découverte',  icon:'compass' },
  { id:'map',      label:'Carte',       icon:'map' },
  { id:'badges',   label:'Défis',       icon:'trophy', badge:3 },
  { id:'profile',  label:'Carnet',      icon:'user' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C16B2C",
  "displayFont": "Newsreader",
  "uiFont": "Hanken Grotesk",
  "checkinVariant": "Tags",
  "density": "regular"
}/*EDITMODE-END*/;

// derive a darker "ink" version of an accent for text-on-light
function darken(hex, amt) {
  const n = parseInt(hex.slice(1),16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  r=Math.round(r*(1-amt)); g=Math.round(g*(1-amt)); b=Math.round(b*(1-amt));
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function tint(hex, amt) {
  const n = parseInt(hex.slice(1),16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  r=Math.round(r+(255-r)*amt); g=Math.round(g+(255-g)*amt); b=Math.round(b+(255-b)*amt);
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState('feed');
  const [openBeer, setOpenBeer] = useState(null);
  const [checkin, setCheckin] = useState({ open:false, beerId:null });

  // apply tweaks to CSS vars
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--accent', t.accent);
    r.setProperty('--accent-ink', darken(t.accent, .28));
    r.setProperty('--accent-soft', tint(t.accent, .72));
    r.setProperty('--accent-tint', tint(t.accent, .88));
    r.setProperty('--font-display', `'${t.displayFont}', Georgia, serif`);
    r.setProperty('--font-ui', `'${t.uiFont}', system-ui, sans-serif`);
  }, [t.accent, t.displayFont, t.uiFont]);

  const goBeer = (id) => { setOpenBeer(id); window.scrollTo(0,0); };
  const nav = (id) => { setRoute(id); setOpenBeer(null); window.scrollTo(0,0); };
  const startCheckin = (beerId=null) => setCheckin({ open:true, beerId });

  let screen;
  if (openBeer) {
    screen = <BeerDetail beerId={openBeer} onOpenBeer={goBeer} onCheckin={startCheckin} />;
  } else if (route==='feed') {
    screen = <FeedScreen onOpenBeer={goBeer} onCheckin={()=>startCheckin()} />;
  } else if (route==='discover') {
    screen = <DiscoverScreen onOpenBeer={goBeer} />;
  } else if (route==='map') {
    screen = <MapScreen />;
  } else if (route==='badges') {
    screen = <BadgesScreen />;
  } else if (route==='profile') {
    screen = <ProfileScreen onOpenBeer={goBeer} />;
  }

  return (
    <div className="app">
      {/* ---- desktop sidebar ---- */}
      <nav className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="drop" size={19}/></div>
          <div className="brand-name">untappd<b>·</b></div>
        </div>
        <div className="nav-group">
          {NAV.map(n => (
            <button key={n.id} className={'nav-item' + (route===n.id && !openBeer?' active':'')} onClick={()=>nav(n.id)}>
              <Icon name={n.icon} />
              {n.label}
              {n.badge && <span className="nav-badge">{n.badge}</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-spacer"></div>
        <button className="checkin-btn" onClick={()=>startCheckin()}>
          <Icon name="plus" size={18}/> Nouvelle bière
        </button>
        <button className="me-card" onClick={()=>nav('profile')}>
          <Avatar user="me" size={38}/>
          <div style={{textAlign:'left'}}>
            <div className="name">Timothée Bénédet</div>
            <div className="sub">@timothee</div>
          </div>
        </button>
      </nav>

      {/* ---- main ---- */}
      <div className="main">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark"><Icon name="drop" size={17}/></div>
            <div className="brand-name">untappd<b>·</b></div>
          </div>
          <div className="tb-spacer"></div>
          <button className="btn icon ghost"><Icon name="search" size={20}/></button>
          <button className="btn icon ghost"><Icon name="bell" size={20}/></button>
        </header>
        {screen}
      </div>

      {/* ---- mobile bottom nav ---- */}
      <nav className="mobile-nav">
        <button className={'mnav-item' + (route==='feed'&&!openBeer?' active':'')} onClick={()=>nav('feed')}><Icon name="home"/>Accueil</button>
        <button className={'mnav-item' + (route==='discover'&&!openBeer?' active':'')} onClick={()=>nav('discover')}><Icon name="compass"/>Découvrir</button>
        <button className="mnav-fab" onClick={()=>startCheckin()}><Icon name="plus"/></button>
        <button className={'mnav-item' + (route==='map'&&!openBeer?' active':'')} onClick={()=>nav('map')}><Icon name="map"/>Carte</button>
        <button className={'mnav-item' + (route==='profile'&&!openBeer?' active':'')} onClick={()=>nav('profile')}><Icon name="user"/>Carnet</button>
      </nav>

      {/* ---- check-in modal ---- */}
      {checkin.open && (
        <CheckinModal beerId={checkin.beerId} variant={VARIANT_KEY[t.checkinVariant] || 'cloud'} onClose={()=>setCheckin({open:false,beerId:null})} />
      )}

      {/* ---- tweaks ---- */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Identité" />
        <TweakColor label="Accent" value={t.accent}
          options={['#C16B2C','#3F7A4E','#C0492F','#2F4B7C','#7A5AE0']}
          onChange={v=>setTweak('accent', v)} />
        <TweakSelect label="Police titres" value={t.displayFont}
          options={['Newsreader','Spectral','Instrument Serif','Libre Caslon Text','Fraunces']}
          onChange={v=>setTweak('displayFont', v)} />
        <TweakSelect label="Police UI" value={t.uiFont}
          options={['Hanken Grotesk','Schibsted Grotesk','Albert Sans','Figtree','Onest']}
          onChange={v=>setTweak('uiFont', v)} />

        <TweakSection label="Écran Check-in" />
        <TweakRadio label="Style de ressenti" value={t.checkinVariant}
          options={['Tags','Curseurs','Cartes']}
          onChange={v=>setTweak('checkinVariant', v)} />
        <TweakButton label="Ouvrir le check-in" onClick={()=>startCheckin()}>Tester →</TweakButton>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
