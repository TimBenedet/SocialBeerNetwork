/* untappdReborn — Beer detail + Check-in flow ----------------------------- */
const { useState } = React;


/* ============================== BEER DETAIL ============================== */
function RBar({ label, pct, color }) {
  return (
    <div className="rbar">
      <div className="rbar-top"><span className="lbl">{label}</span><span className="pct">{pct}%</span></div>
      <div className="rbar-track"><div className="rbar-fill" style={{ width:pct+'%', background:color }}></div></div>
    </div>
  );
}

const VCOLOR = { love:'var(--v-love)', again:'var(--v-again)', fine:'var(--v-fine)', meh:'var(--v-meh)', never:'var(--v-never)' };

function BeerDetail({ beerId, onOpenBeer, onCheckin }) {
  const beer = beerById(beerId);
  if (!beer) {
    return (
      <div className="page">
        <button className="btn ghost sm" style={{marginBottom:22}} onClick={()=>onOpenBeer(null)}><Icon name="arrowL" size={15}/> Retour</button>
        <p style={{color:'var(--ink-mute)',padding:'40px 0'}}>Cette bière n'existe pas (ou plus).</p>
      </div>
    );
  }
  const brew = BREWERIES[beer.brewery] || { name:'', city:'' };
  const c = BEER_HUES[beer.hue];
  const verdictEntries = Object.entries(beer.verdicts || {});
  const topV = verdictEntries.length ? verdictEntries.sort((a,b)=>b[1]-a[1])[0][0] : null;
  const similar = BEERS.filter(b=>b.id!==beerId && b.style.includes(beer.style.split(' ').pop())).slice(0,4);
  const fallbackSimilar = BEERS.filter(b=>b.id!==beerId).slice(0,4);
  const sim = (similar.length?similar:fallbackSimilar).slice(0,4);

  const myNotes = FEED.filter(f => f.mine && f.beerId === beerId).map(f => ({
    when: f.time, txt: f.note, tags: [...(f.feelings||[]), ...(f.characters||[])].slice(0,3),
  }));

  return (
    <div className="page">
      <button className="btn ghost sm" style={{marginBottom:22}} onClick={()=>onOpenBeer(null)}><Icon name="arrowL" size={15}/> Retour</button>

      <div className="beer-hero">
        <div className="beer-hero-glass" style={{ background:`radial-gradient(120% 90% at 50% 0%, ${c.glow}, var(--surface))` }}>
          <Glass hue={beer.hue} w={120} fill={beer.glassFill} />
        </div>
        <div className="beer-hero-info">
          <div className="style">{beer.style}</div>
          <h1>{beer.name}</h1>
          <div className="brew">{brew.name} · {brew.city}</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:4}}>
            {topV && <Verdict v={topV} />}
            {beer.checkins ? <Tag><Icon name="user" size={13}/>&nbsp;{(beer.checkins/1000).toFixed(1)}k dégustations</Tag> : null}
          </div>
          <div className="beer-meta">
            <div className="m"><div className="v serif">{beer.abv}%</div><div className="k">Alcool</div></div>
            <div className="m"><div className="v serif">{beer.ibu}</div><div className="k">Amertume (IBU)</div></div>
            <div className="m"><div className="v serif">{beer.checkins>9000?'★':'◇'}</div><div className="k">{beer.checkins>9000?'Très populaire':'À découvrir'}</div></div>
          </div>
          <p className="beer-desc">{beer.desc}</p>
          <div style={{display:'flex',gap:10}}>
            <button className="btn primary" onClick={()=>onCheckin(beer.id)}><Icon name="plus" size={16}/> Faire un check-in</button>
            <button className="btn"><Icon name="bookmark" size={16}/> Garder</button>
          </div>
        </div>
      </div>

      {/* collective ressenti */}
      <div className="block">
        <div className="section-title">Le ressenti collectif</div>
        <div className="section-note">Pas de moyenne sur 5. Voici ce que les gens ont vraiment ressenti.</div>
        <div className="ressenti">
          <div className="ressenti-bars">
            {Object.entries(beer.verdicts || {}).map(([k,v]) => (
              <RBar key={k} label={VERDICTS[k].label} pct={v} color={VCOLOR[k]} />
            ))}
          </div>
          <div>
            <div className="pick-cat" style={{marginTop:0}}>Ce qu'elle fait ressentir</div>
            <div className="tag-cloud" style={{marginBottom:18}}>
              {(beer.feelings || []).map(([f,n]) => (
                <span key={f} className="tag tint" style={{ fontSize: 12 + n/14 }}>{f}<span style={{opacity:.5,marginLeft:4}}>{n}%</span></span>
              ))}
            </div>
            <div className="pick-cat">Son caractère</div>
            <div className="tag-cloud">
              {(beer.characters || []).map(([f,n]) => (
                <span key={f} className="tag" style={{ fontSize: 12 + n/16 }}><span className="dot"></span>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* where to find */}
      <div className="block">
        <div className="section-title">Où la trouver</div>
        <div className="section-note">À la pression près de toi en ce moment.</div>
        <div className="venue-list">
          {VENUES.slice(0,3).map(v => (
            <div key={v.id} className="venue-row">
              <div className="venue-ic"><Icon name="pin" size={18}/></div>
              <div><div className="nm">{v.name}</div><div className="ad">{v.type} · {v.area}</div></div>
              <div className="end"><span className="on-tap"><Icon name="check" size={13}/> À la pression</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* my own notes */}
      {myNotes.length > 0 && (
      <div className="block">
        <div className="section-title">Ton carnet</div>
        <div className="section-note">Ce que cette bière t'a évoqué.</div>
        <div>
          {myNotes.map((n,i) => (
            <div key={i} className="note-row">
              <Avatar user="me" size={40}/>
              <div className="body">
                <span className="who">{USERS.me.name}</span> <span className="when">· {n.when}</span>
                <p className="txt">{n.txt}</p>
                <div className="ntags">{n.tags.map(t=><Tag key={t} variant="tint">{t}</Tag>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* similar */}
      <div className="block">
        <div className="section-title">Dans le même esprit</div>
        <div className="section-note">Des bières au ressenti proche.</div>
        <div className="beer-grid">
          {sim.map(b => <BeerCard key={b.id} beerId={b.id} onOpenBeer={onOpenBeer} />)}
        </div>
      </div>
    </div>
  );
}
window.BeerDetail = BeerDetail;

/* ============================== CHECK-IN FLOW ============================== */
const VERDICT_ORDER = ['love','again','fine','meh','never'];

function VerdictPicker({ value, onChange }) {
  return (
    <div className="verdict-grid">
      {VERDICT_ORDER.map(v => (
        <button key={v} className={'verdict-pick' + (value===v?' sel':'')} onClick={()=>onChange(v)}>
          <span className="em" style={{ color: VCOLOR[v] }}><VerdictGlyph v={v} size={34} /></span>
          <span className="lbl">{VERDICTS[v].label}</span>
        </button>
      ))}
    </div>
  );
}

/* -- Variant A: tag clouds (default) -- */
function FeelingTags({ feelings, characters, toggle }) {
  return (
    <>
      <div className="pick-cat">Comment te sens-tu&nbsp;? <span style={{textTransform:'none',fontWeight:500,color:'var(--ink-faint)'}}>· l'ambiance</span></div>
      <div className="pick-cloud">
        {FEELINGS.map(f => (
          <button key={f} className={'pick-tag accent' + (feelings.includes(f)?' sel':'')} onClick={()=>toggle('feelings',f)}>{f}</button>
        ))}
      </div>
      <div className="pick-cat">Son caractère <span style={{textTransform:'none',fontWeight:500,color:'var(--ink-faint)'}}>· les saveurs</span></div>
      <div className="pick-cloud">
        {CHARACTERS.map(f => (
          <button key={f} className={'pick-tag' + (characters.includes(f)?' sel':'')} onClick={()=>toggle('characters',f)}>{f}</button>
        ))}
      </div>
    </>
  );
}

/* -- Variant B: feeling sliders -- */
const SLIDERS = [
  { key:'body',   left:'Léger',     right:'Corsé' },
  { key:'bitter', left:'Doux',      right:'Amer' },
  { key:'mood',   left:'Apaisant',  right:'Énergisant' },
];
function FeelingSliders({ vals, setVal }) {
  return (
    <div>
      {SLIDERS.map(s => (
        <div className="feel-slider" key={s.key}>
          <div className="ends"><span>{s.left}</span><span>{s.right}</span></div>
          <input type="range" min="0" max="100" value={vals[s.key] ?? 50} onChange={e=>setVal(s.key, +e.target.value)} />
        </div>
      ))}
      <p style={{fontSize:13,color:'var(--ink-mute)',marginTop:6}}>Fais glisser pour décrire ta sensation — pas besoin de chercher les mots.</p>
    </div>
  );
}

/* -- Variant C: pick 3 cards -- */
const CARD_FEELINGS = [
  { f:'Réconfortant', ic:'moon' }, { f:'Rafraîchissant', ic:'drop' }, { f:'Festif', ic:'sparkle' },
  { f:'Contemplatif', ic:'moon' }, { f:'Aventureux', ic:'compass' }, { f:'Énergisant', ic:'sun' },
];
function FeelingCards({ feelings, toggle }) {
  return (
    <>
      <div className="pick-cat" style={{marginTop:0}}>Choisis jusqu'à 3 sensations</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {CARD_FEELINGS.map(({f,ic}) => {
          const sel = feelings.includes(f);
          return (
            <button key={f} onClick={()=>toggle('feelings',f)}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'20px 8px',
                borderRadius:'var(--r)',border:'1.5px solid '+(sel?'var(--accent)':'var(--line)'),
                background:sel?'var(--accent-tint)':'var(--surface)',transition:'all .14s',
                color:sel?'var(--accent-ink)':'var(--ink-soft)'}}>
              <Icon name={ic} size={26}/>
              <span style={{fontSize:13.5,fontWeight:600}}>{f}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function PhotoField({ photo, setPhoto }) {
  const inputRef = React.useRef(null);
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <>
      <button type="button" className={'photo-drop' + (photo?' has':'')} onClick={()=>inputRef.current&&inputRef.current.click()}
        style={photo ? { backgroundImage:`url(${photo})` } : undefined}>
        {!photo && <><Icon name="camera" size={28}/><span>Ajouter une photo</span></>}
        {photo && <span className="photo-edit"><Icon name="camera" size={15}/> Changer la photo</span>}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{display:'none'}} />
    </>
  );
}

const PLACES = ['Cave Saint-Georges','Le Houblon Vagabond','Chez soi','Terrasse du Quai'];

// beer styles, paired with the glass hue used to render them
const BEER_STYLES = [
  { style:'IPA', hue:'gold' },
  { style:'New England IPA', hue:'hazy' },
  { style:'Pilsner', hue:'pale' },
  { style:'Lager', hue:'pale' },
  { style:'Stout', hue:'stout' },
  { style:'Porter', hue:'brown' },
  { style:'Ambrée', hue:'amber' },
  { style:'Rousse', hue:'copper' },
  { style:'Blonde', hue:'gold' },
  { style:'Saison', hue:'gold' },
  { style:'Sour / Acidulée', hue:'pink' },
  { style:'Triple', hue:'gold' },
  { style:'Brune', hue:'brown' },
  { style:'Autre', hue:'amber' },
];

function CheckinModal({ beerId, variant, onClose }) {
  const isNew = !beerId;
  const [step, setStep] = useState(0);
  const [verdict, setVerdict] = useState(null);
  const [feelings, setFeelings] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [sliders, setSliders] = useState({});
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  // champs « nouvelle bière »
  const [name, setName] = useState('');
  const [brewery, setBrewery] = useState('');
  const [style, setStyle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [place, setPlace] = useState('');
  // enregistrement du lieu sur la carte
  const [saveOnMap, setSaveOnMap] = useState(false);
  const [addr, setAddr] = useState('');
  const [geoStatus, setGeoStatus] = useState(null); // null | 'loading' | 'notfound' | 'error'

  const beer = beerId ? beerById(beerId) : null;
  const brew = beer ? BREWERIES[beer.brewery] : null;
  const c = beer ? BEER_HUES[beer.hue] : null;
  const title = beer ? beer.name : (name.trim() || 'Nouvelle bière');

  // existing custom venues (active user) — to know if the place is already mapped
  const savedVenues = venueStore.all();
  const placeKnown = !!place && savedVenues.some(v => v.name.toLowerCase() === place.trim().toLowerCase());
  // a free-typed place that isn't on the map yet → offer to save it
  const placeCanBeMapped = !!place.trim() && !placeKnown;

  const toggle = (which, val) => {
    const set = which==='feelings' ? [feelings,setFeelings] : [characters,setCharacters];
    const [arr, fn] = set;
    fn(arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]);
  };

  const steps = isNew
    ? ['Ta bière', 'Ton verdict', 'Ton ressenti', 'Ta note']
    : ['Ton verdict', 'Ton ressenti', 'Ta note'];
  const lastStep = steps.length - 1;
  const phase = isNew ? step - 1 : step; // -1 = détails, 0 = verdict, 1 = ressenti, 2 = note
  const canNext = phase===-1 ? !!name.trim() : phase===0 ? !!verdict : true;

  // build the beer object for a brand-new beer
  const buildBeer = () => {
    if (beer) return beer;
    const st = BEER_STYLES.find(s => s.style === style) || { style: style || 'Bière', hue: 'amber' };
    const brewKey = brewery.trim() ? 'b-' + brewery.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
    return {
      id: genId('beer'),
      name: name.trim() || 'Bière sans nom',
      style: st.style,
      hue: st.hue,
      brewery: brewKey,
      glassFill: 0.82,
      photo: photo || null,
      feelings: [], characters: [], verdicts: {},
    };
  };

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    const b = buildBeer();
    // 1) persist the check-in (creates the beer in the carnet/feed too)
    checkinStore.add({
      id: genId('ci'),
      createdAt: Date.now(),
      beer: b,
      breweryName: beer ? (BREWERIES[beer.brewery] || {}).name : (brewery.trim() || ''),
      verdict,
      feelings, characters,
      note: note.trim(),
      place: place.trim(),
    });
    // 2) optionally geocode the address and add the venue to the map.
    //    The map marker is named after `place` (the venue name); `addr` is only
    //    the geocoding query so the pin lands at the right spot.
    if (saveOnMap && placeCanBeMapped) {
      const query = addr.trim() || place.trim();
      try {
        const geo = await geocodePlace(query);
        if (geo) {
          const venues = venueStore.all().concat([{
            id: 'u' + genId('v'), name: place.trim(), type: 'Autre',
            area: geo.area, taps: 0, friends: 0, lat: geo.lat, lng: geo.lng,
            hot: false, custom: true,
          }]);
          venueStore.save(venues);
        } else {
          // address not found → keep the modal open so the user can fix it
          setGeoStatus('notfound');
          setSaving(false);
          return;
        }
      } catch (e) {
        setGeoStatus('error');
        setSaving(false);
        return;
      }
    }
    setDone(true);
    setTimeout(onClose, 1400);
  };

  if (done) {
    return (
      <div className="scrim" onClick={onClose}>
        <div className="modal" style={{width:'min(440px,100%)'}} onClick={e=>e.stopPropagation()}>
          <div className="modal-body" style={{textAlign:'center',padding:'48px 32px'}}>
            <div style={{width:84,height:84,borderRadius:999,margin:'0 auto 22px',display:'grid',placeItems:'center',background:'var(--accent-tint)',color:'var(--accent)'}}>
              <Icon name="check" size={42}/>
            </div>
            <h3 className="serif" style={{fontSize:28,marginBottom:8}}>C'est noté&nbsp;!</h3>
            <p style={{color:'var(--ink-mute)'}}>{title} rejoint ton carnet.<br/>{verdict && <Verdict v={verdict}/>}</p>
          </div>
        </div>
      </div>
    );
  }

  const PickRow = () => (
    <div className="beer-pick-row">
      {beer ? (
        <div style={{width:48,height:80,display:'grid',placeItems:'center',background:c.glow,borderRadius:10}}>
          <Glass hue={beer.hue} w={34} fill={beer.glassFill}/>
        </div>
      ) : photo ? (
        <div className="pick-thumb" style={{ backgroundImage:`url(${photo})` }}></div>
      ) : (
        <div style={{width:54,height:80,display:'grid',placeItems:'center',background:'var(--surface)',border:'1px solid var(--line)',borderRadius:10,color:'var(--ink-faint)'}}>
          <Glass hue="amber" w={32} fill={0.5}/>
        </div>
      )}
      <div style={{minWidth:0}}>
        <div className="nm serif">{title}</div>
        <div className="br">{beer ? `${beer.style} · ${brew.name}` : (brewery.trim() || 'Brasserie non précisée')}{place && ` · ${place}`}</div>
      </div>
    </div>
  );

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="step">{isNew ? 'Nouvelle bière' : 'Check-in'} · {steps[step]}</div>
            <h3>{title}</h3>
          </div>
          <button className="modal-close" onClick={onClose}><Icon name="close" size={20}/></button>
        </div>

        <div className="modal-body">
          {phase > -1 && <PickRow />}

          {phase===-1 && (
            <div className="new-beer-form">
              <div className="nb-grid">
                <div className="nb-photo">
                  <label className="field-lbl">Photo</label>
                  <PhotoField photo={photo} setPhoto={setPhoto} />
                </div>
                <div className="nb-fields">
                  <label className="field-lbl">Nom de la bière</label>
                  <input className="text-input" autoFocus placeholder="Ex. Brume du Matin" value={name} onChange={e=>setName(e.target.value)} />
                  <label className="field-lbl" style={{marginTop:16}}>Brasserie</label>
                  <input className="text-input" placeholder="Ex. Brasserie des Cimes" value={brewery} onChange={e=>setBrewery(e.target.value)} />
                  <label className="field-lbl" style={{marginTop:16}}>Style</label>
                  <div className="place-chips">
                    {BEER_STYLES.map(s=>(
                      <button key={s.style} type="button" className={'pick-tag sm' + (style===s.style?' sel':'')} onClick={()=>setStyle(style===s.style?'':s.style)}>{s.style}</button>
                    ))}
                  </div>
                  <label className="field-lbl" style={{marginTop:16}}>Où l'as-tu bue&nbsp;? <span style={{textTransform:'none',fontWeight:500,color:'var(--ink-faint)'}}>· le nom du lieu</span></label>
                  <input className="text-input" placeholder="Ex. Le Comptoir des Brasseurs, chez toi…" value={place} onChange={e=>setPlace(e.target.value)} />
                  <div className="place-chips">
                    {PLACES.map(v=>(
                      <button key={v} type="button" className={'pick-tag sm' + (place===v?' sel':'')} onClick={()=>setPlace(place===v?'':v)}>{v}</button>
                    ))}
                  </div>
                  {placeCanBeMapped && (
                    <div className="map-save-box">
                      <label className="map-save-toggle">
                        <input type="checkbox" checked={saveOnMap}
                          onChange={e=>{ setSaveOnMap(e.target.checked); if(!e.target.checked) setGeoStatus(null); }} />
                        <span><Icon name="pin" size={14}/> Placer « {place.trim()} » sur la carte</span>
                      </label>
                      {saveOnMap && (
                        <>
                          <label className="field-lbl" style={{marginTop:12}}>Adresse du lieu</label>
                          <input className="text-input" placeholder="12 rue de la République, Lyon"
                            value={addr} onChange={e=>{ setAddr(e.target.value); if(geoStatus) setGeoStatus(null); }} />
                          <p className="map-hint" style={{color:'var(--ink-faint)'}}>L'adresse sert à localiser le lieu ; c'est le nom ci-dessus qui s'affichera sur la carte.</p>
                          {geoStatus==='notfound' && <p className="av-msg">Adresse introuvable — précise la rue et la ville.</p>}
                          {geoStatus==='error' && <p className="av-msg">Impossible de localiser pour le moment.</p>}
                        </>
                      )}
                    </div>
                  )}
                  {placeKnown && (
                    <p className="map-hint"><Icon name="check" size={14}/> « {place} » est déjà sur ta carte.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {phase===0 && (
            <>
              <p style={{marginBottom:18,color:'var(--ink-soft)',fontSize:15}}>En un mot, qu'est-ce que tu en retiens&nbsp;?</p>
              <VerdictPicker value={verdict} onChange={setVerdict} />
            </>
          )}

          {phase===1 && (
            <>
              {variant==='cloud' && <FeelingTags feelings={feelings} characters={characters} toggle={toggle} />}
              {variant==='sliders' && (<>
                <FeelingSliders vals={sliders} setVal={(k,v)=>setSliders({...sliders,[k]:v})} />
                <div className="pick-cat">Quelques mots de caractère</div>
                <div className="pick-cloud">
                  {CHARACTERS.slice(0,8).map(f => (
                    <button key={f} className={'pick-tag' + (characters.includes(f)?' sel':'')} onClick={()=>toggle('characters',f)}>{f}</button>
                  ))}
                </div>
              </>)}
              {variant==='cards' && (<>
                <FeelingCards feelings={feelings} toggle={toggle} />
                <div className="pick-cat">Son caractère</div>
                <div className="pick-cloud">
                  {CHARACTERS.slice(0,8).map(f => (
                    <button key={f} className={'pick-tag' + (characters.includes(f)?' sel':'')} onClick={()=>toggle('characters',f)}>{f}</button>
                  ))}
                </div>
              </>)}
            </>
          )}

          {phase===2 && (
            <>
              <p style={{marginBottom:14,color:'var(--ink-soft)',fontSize:15}}>Un souvenir, une impression&nbsp;? <span style={{color:'var(--ink-faint)'}}>(optionnel)</span></p>
              <textarea className="note-input" placeholder="Ce soir-là, avec qui, ce que ça t'a évoqué…" value={note} onChange={e=>setNote(e.target.value)} />

              <div className="pick-cat">Nom du lieu</div>
              <input className="text-input" placeholder="Ex. Le Comptoir des Brasseurs, chez toi…" value={place}
                onChange={e=>{ setPlace(e.target.value); if(!e.target.value.trim()){ setSaveOnMap(false); } setGeoStatus(null); }} />
              <div className="pick-cloud" style={{marginTop:10}}>
                {PLACES.map(v=>(
                  <button key={v} className={'pick-tag' + (place===v?' sel':'')} onClick={()=>{ setPlace(place===v?'':v); setSaveOnMap(false); }}>{v}</button>
                ))}
              </div>

              {placeKnown && (
                <p className="map-hint"><Icon name="check" size={14}/> « {place} » est déjà sur ta carte.</p>
              )}

              {placeCanBeMapped && (
                <div className="map-save-box">
                  <label className="map-save-toggle">
                    <input type="checkbox" checked={saveOnMap}
                      onChange={e=>{ setSaveOnMap(e.target.checked); if(!e.target.checked) setGeoStatus(null); }} />
                    <span><Icon name="pin" size={14}/> Placer « {place.trim()} » sur la carte</span>
                  </label>
                  {saveOnMap && (
                    <>
                      <label className="field-lbl" style={{marginTop:12}}>Adresse du lieu</label>
                      <input className="text-input" placeholder="12 rue de la République, Lyon"
                        value={addr} onChange={e=>{ setAddr(e.target.value); if(geoStatus) setGeoStatus(null); }} />
                      <p className="map-hint" style={{color:'var(--ink-faint)'}}>L'adresse sert à localiser le lieu ; c'est le nom ci-dessus qui s'affichera sur la carte.</p>
                      {geoStatus==='notfound' && <p className="av-msg">Adresse introuvable — précise la rue et la ville.</p>}
                      {geoStatus==='error' && <p className="av-msg">Impossible de localiser pour le moment.</p>}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-foot">
          <div className="ci-progress">
            {steps.map((_,i)=><span key={i} className={i<=step?'done':''}></span>)}
          </div>
          <div className="spacer"></div>
          {step>0 && <button className="btn" onClick={()=>setStep(step-1)}><Icon name="arrowL" size={15}/> Retour</button>}
          {step<lastStep
            ? <button className="btn dark" disabled={!canNext} style={{opacity:canNext?1:.4}} onClick={()=>canNext&&setStep(step+1)}>Continuer <Icon name="arrow" size={15}/></button>
            : <button className="btn primary" onClick={finish} disabled={saving} style={{opacity:saving?.6:1}}><Icon name="check" size={16}/> {saving ? 'Enregistrement…' : 'Enregistrer'}</button>}
        </div>
      </div>
    </div>
  );
}
window.CheckinModal = CheckinModal;
