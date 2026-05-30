/* untappdReborn — app shell, routing, tweaks ------------------------------ */
const { useState, useEffect } = React;


const VARIANT_KEY = { 'Tags':'cloud', 'Curseurs':'sliders', 'Cartes':'cards' };

const NAV = [
  { id:'feed',     label:'Accueil',     icon:'home' },
  { id:'discover', label:'Découverte',  icon:'compass' },
  { id:'map',      label:'Carte',       icon:'map' },
  { id:'badges',   label:'Défis',       icon:'trophy' },
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

  // --- auth/session ---
  // authed: null = still checking a stored token, false = logged out, true = in
  const [authed, setAuthed] = useState(null);
  const [, forceUser] = useState(0); // bump to re-render after USERS.me changes

  // restore a stored session on first load
  useEffect(() => {
    const token = authStore.getToken();
    if (!token) { setAuthed(false); return; }
    let cancelled = false;
    api.me(token)
      .then(({ user }) => { if (cancelled) return; setActiveUser(user); setAuthed(true); })
      .catch(() => { if (cancelled) return; authStore.clear(); setAuthed(false); })
      .finally(() => { if (!cancelled) forceUser(n => n + 1); });
    return () => { cancelled = true; };
  }, []);

  const handleLogin = (token, user) => {
    authStore.setToken(token);
    setActiveUser(user);
    setRoute('feed');
    setOpenBeer(null);
    setAuthed(true);
    forceUser(n => n + 1);
  };

  const handleLogout = () => {
    api.logout(authStore.getToken());
    authStore.clear();
    setAuthed(false);
    setRoute('feed');
    setOpenBeer(null);
    forceUser(n => n + 1);
  };

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

  // checking a stored token — keep it blank for a beat to avoid a login flash
  if (authed === null) {
    return <div className="login-wrap" />;
  }
  // not logged in → only the login screen
  if (!authed) {
    return <LoginScreen onLogin={handleLogin} />;
  }

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
        <div className="me-row">
          <button className="me-card" onClick={()=>nav('profile')}>
            <Avatar user="me" size={38}/>
            <div style={{textAlign:'left'}}>
              <div className="name">{USERS.me.name}</div>
              <div className="sub">{USERS.me.handle}</div>
            </div>
          </button>
          <button className="btn icon ghost logout-btn" title="Se déconnecter" onClick={handleLogout}>
            <Icon name="arrow" size={18}/>
          </button>
        </div>
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
