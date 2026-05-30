/* untappdReborn — Profile + Badges + Map ---------------------------------- */
const { useState, useEffect, useRef } = React;


/* ============================== PROFILE ============================== */
function ProfileScreen({ onOpenBeer }) {
  useDataVersion();
  const me = USERS.me;
  const journalCount = JOURNAL.reduce((n,g)=>n+(g.entries?.length||0),0);
  return (
    <div className="page">
      <div className="prof-hero">
        <div className="avatar big-av" style={{ background:me.color }}>{me.init}</div>
        <div>
          <div className="prof-name">{me.name}</div>
          <div className="prof-handle">{me.handle}</div>
          <div style={{display:'flex',gap:9,marginTop:14,flexWrap:'wrap'}}>
            <button className="btn sm"><Icon name="pen" size={14}/> Éditer le profil</button>
          </div>
        </div>
      </div>

      <div className="block">
        <div className="section-title">Ton palais, en un coup d'œil</div>
        <div className="section-note">Les ressentis qui reviennent le plus dans ton carnet.</div>
        {ME_TASTE.length ? (
          <div className="taste-profile">
            {ME_TASTE.map((t,i) => (
              <span key={t} className={'tag ' + (i<3?'solid':'')} style={{ fontSize: 15 - i*0.6, padding:'7px 15px' }}>{t}</span>
            ))}
          </div>
        ) : (
          <p style={{color:'var(--ink-mute)'}}>Ton profil de goût se construira au fil de tes dégustations.</p>
        )}
      </div>

      <div className="block">
        <div className="section-title">Ton carnet de dégustation</div>
        <div className="section-note">Chaque bière, ce qu'elle t'a fait ressentir.</div>
        {journalCount ? (
          <div className="journal">
            {JOURNAL.map(group => (
              <div key={group.month}>
                <div className="journal-month">{group.month}</div>
                {group.entries.map((e,i) => {
                  const beer = beerById(e.beerId);
                  if (!beer) return null;
                  const brew = BREWERIES[beer.brewery] || { name:'' };
                  return (
                    <div key={i} className="j-entry" onClick={()=>onOpenBeer(e.beerId)}>
                      <div className="j-glass" style={{ background: BEER_HUES[beer.hue].glow }}>
                        <Glass hue={beer.hue} w={26} fill={beer.glassFill}/>
                      </div>
                      <div>
                        <div className="j-name">{beer.name}</div>
                        <div className="j-brew">{brew.name}</div>
                        <div className="j-tags">
                          <Verdict v={e.verdict} />
                          {(e.feelings||[]).map(f=><Tag key={f} variant="tint">{f}</Tag>)}
                          {(e.characters||[]).map(f=><Tag key={f}>{f}</Tag>)}
                        </div>
                      </div>
                      <div className="j-date">{e.date}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p style={{color:'var(--ink-mute)',padding:'12px 0'}}>Ton carnet est vide pour l'instant. Tes dégustations apparaîtront ici.</p>
        )}
      </div>
    </div>
  );
}
window.ProfileScreen = ProfileScreen;

/* ============================== BADGES ============================== */
function BadgeMedal({ icon, color, earned }) {
  return (
    <div className="badge-medal" style={{ background: earned ? color : 'var(--surface-sunk)', color: earned ? '#fff' : 'var(--ink-faint)',
      boxShadow: earned ? 'inset 0 0 0 3px rgba(255,255,255,.25)' : 'none' }}>
      <Icon name={icon} size={30}/>
    </div>
  );
}

function BadgesScreen() {
  const earned = BADGES.filter(b=>b.earned);
  const locked = BADGES.filter(b=>!b.earned);
  return (
    <div className="page">
      <div className="page-head">
        <div className="page-kicker">Récompenses</div>
        <h1 className="page-title">Tes défis & badges</h1>
        <p className="page-sub">Pas de course aux points. Des objectifs qui t'invitent à goûter autrement.</p>
      </div>

      <div className="block">
        <div className="section-title">Défis en cours</div>
        <div className="section-note">Ils se renouvellent chaque semaine.</div>
        {!CHALLENGES.length && <p style={{color:'var(--ink-mute)'}}>Aucun défi en cours pour le moment.</p>}
        {CHALLENGES.map(ch => (
          <div key={ch.id} className="challenge">
            <div className="challenge-ic"><Icon name={ch.icon}/></div>
            <div>
              <div className="ttl">{ch.title}</div>
              <div className="ds">{ch.desc}</div>
              <div className="badge-prog" style={{maxWidth:240,marginTop:10}}>
                <div className="track"><div className="fill" style={{width:(ch.done/ch.total*100)+'%'}}></div></div>
              </div>
            </div>
            <div className="end">
              <div className="frac serif">{ch.done}<small>/{ch.total}</small></div>
            </div>
          </div>
        ))}
      </div>

      <div className="block">
        <div className="section-title">Badges obtenus <span style={{color:'var(--ink-faint)',fontFamily:'var(--font-ui)',fontSize:16,fontWeight:600}}>· {earned.length}</span></div>
        {!earned.length && <p style={{color:'var(--ink-mute)'}}>Tu n'as pas encore débloqué de badge.</p>}
        <div className="badge-grid" style={{marginTop:14}}>
          {earned.map(b => (
            <div key={b.id} className="badge">
              <BadgeMedal icon={b.icon} color={b.color} earned={true} />
              <div className="badge-name">{b.name}</div>
              <div className="badge-desc">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="block">
        <div className="section-title">À débloquer</div>
        <div className="badge-grid" style={{marginTop:14}}>
          {locked.map(b => (
            <div key={b.id} className="badge locked">
              <BadgeMedal icon={b.icon} color={b.color} earned={false} />
              <div className="badge-name">{b.name}</div>
              <div className="badge-desc">{b.desc}</div>
              <div className="badge-prog">
                <div className="track"><div className="fill" style={{width:(b.prog/b.total*100)+'%'}}></div></div>
                <div className="lbl">{b.prog} / {b.total}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.BadgesScreen = BadgesScreen;

/* ============================== MAP ============================== */
const VENUE_TYPES = ['Bar à bières', 'Brasserie · Taproom', 'Cave à bières', 'Restaurant', 'Autre'];

function AddVenueForm({ onAdd, onSave, onClose, editing }) {
  const isEdit = !!editing;
  const [name, setName] = useState(editing ? editing.name : '');
  const [addr, setAddr] = useState('');
  const [type, setType] = useState(editing ? (editing.type || VENUE_TYPES[0]) : VENUE_TYPES[0]);
  const [status, setStatus] = useState(null); // null | 'loading' | 'notfound' | 'error'

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || status === 'loading') return;
    // edit without a new address → just update name/type, keep coords
    if (isEdit && !addr.trim()) {
      onSave(editing.id, { name: name.trim(), type });
      onClose();
      return;
    }
    if (!isEdit && !addr.trim()) return; // new venue needs an address
    setStatus('loading');
    try {
      const geo = await geocodePlace(addr.trim());
      if (!geo) { setStatus('notfound'); return; }
      if (isEdit) {
        onSave(editing.id, { name: name.trim(), type, area: geo.area, lat: geo.lat, lng: geo.lng });
      } else {
        onAdd({
          id: 'u' + genId('v'),
          name: name.trim(), type, area: geo.area,
          taps: 0, friends: 0, lat: geo.lat, lng: geo.lng,
          hot: false, custom: true,
        });
      }
      onClose();
    } catch (err) {
      setStatus('error');
    }
  };

  const disabled = status === 'loading' || !name.trim() || (!isEdit && !addr.trim());
  return (
    <form className="add-venue" onSubmit={submit}>
      <div className="av-title"><Icon name="pin" size={15}/> {isEdit ? 'Modifier le lieu' : 'Ajouter un lieu'}</div>
      <label className="field-lbl">Nom du lieu</label>
      <input className="text-input" placeholder="Ex. Le Comptoir des Brasseurs" value={name} onChange={e=>setName(e.target.value)} autoFocus />
      <label className="field-lbl" style={{marginTop:12}}>Adresse {isEdit && <span style={{textTransform:'none',fontWeight:500,color:'var(--ink-faint)'}}>(laisse vide pour garder l'actuelle)</span>}</label>
      <input className="text-input" placeholder="12 rue de la République, Lyon" value={addr} onChange={e=>{setAddr(e.target.value); if(status)setStatus(null);}} />
      <label className="field-lbl" style={{marginTop:12}}>Type</label>
      <div className="place-chips">
        {VENUE_TYPES.map(t => (
          <button type="button" key={t} className={'pick-tag sm' + (type===t?' sel':'')} onClick={()=>setType(t)}>{t}</button>
        ))}
      </div>
      {status==='notfound' && <p className="av-msg">Adresse introuvable — précise la rue et la ville.</p>}
      {status==='error' && <p className="av-msg">Impossible de localiser pour le moment, réessaie.</p>}
      <div className="av-actions">
        <button type="button" className="btn sm" onClick={onClose}>Annuler</button>
        <button type="submit" className="btn dark sm" disabled={disabled} style={{opacity:disabled?.5:1}}>
          {status==='loading' ? 'Recherche…' : (isEdit ? <>Enregistrer <Icon name="check" size={14}/></> : <>Localiser <Icon name="arrow" size={14}/></>)}
        </button>
      </div>
    </form>
  );
}

function MapScreen() {
  useDataVersion();
  const loadVenues = () => [...VENUES, ...venueStore.all()];
  const [venues, setVenues] = useState(loadVenues);
  const [active, setActive] = useState(() => (venues[0] ? venues[0].id : null));
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null); // venue being edited, or null

  const addVenue = (v) => {
    const next = [...venueStore.all(), v];
    venueStore.save(next);
    setVenues(loadVenues());
    setActive(v.id);
  };

  const saveVenue = (id, patch) => {
    venueStore.update(id, patch);
    setVenues(loadVenues());
    setActive(id);
  };

  const removeVenue = (v) => {
    if (!window.confirm(`Supprimer « ${v.name} » de ta carte ?`)) return;
    venueStore.remove(v.id);
    const next = loadVenues();
    setVenues(next);
    if (active === v.id) setActive(next[0] ? next[0].id : null);
  };

  const startEdit = (v) => { setEditing(v); setAdding(true); };
  const closeForm = () => { setAdding(false); setEditing(null); };

  return (
    <div className="page">
      <div className="page-head map-head">
        <div>
          <div className="page-kicker">Autour de toi</div>
          <h1 className="page-title">Bars & brasseries</h1>
        </div>
        <button className={'btn ' + (adding ? '' : 'primary')} onClick={()=>{ if(adding){closeForm();}else{setEditing(null);setAdding(true);} }}>
          <Icon name={adding?'close':'plus'} size={16}/> {adding ? 'Fermer' : 'Ajouter une adresse'}
        </button>
      </div>
      <div className="map-layout">
        <div className="map-list">
          {adding && <AddVenueForm onAdd={addVenue} onSave={saveVenue} onClose={closeForm} editing={editing} />}
          {!venues.length && !adding && (
            <div style={{color:'var(--ink-mute)',padding:'24px 4px'}}>Aucun lieu enregistré. Ajoute une adresse pour la voir sur la carte.</div>
          )}
          {venues.map(v => (
            <div key={v.id} className={'map-list-item' + (active===v.id?' active':'')} onClick={()=>setActive(v.id)}>
              <div className="ic"><Icon name="pin" size={18}/></div>
              <div style={{flex:1}}>
                <div className="nm">{v.name}{v.custom && <span className="mine-tag">Ajouté</span>}</div>
                <div className="meta">{v.type} · {v.area}</div>
                <div className="meta" style={{marginTop:5,display:'flex',gap:12}}>
                  {v.custom ? (
                    <span>Lieu enregistré par toi</span>
                  ) : (<>
                    <span>{v.taps} pressions</span>
                    {v.hot && <span style={{color:'var(--accent-ink)',fontWeight:700}}>● Animé</span>}
                  </>)}
                </div>
                {v.custom && (
                  <div className="venue-actions">
                    <button className="ci-act" onClick={(e)=>{ e.stopPropagation(); startEdit(v); }}><Icon name="pen" size={14}/> Modifier</button>
                    <button className="ci-act danger" onClick={(e)=>{ e.stopPropagation(); removeVenue(v); }}><Icon name="trash" size={14}/> Supprimer</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="map-canvas">
          <LeafletMap venues={venues} active={active} setActive={setActive} />
        </div>
      </div>
    </div>
  );
}

/* Real OpenStreetMap (Leaflet + Carto Positron tiles, OSM data) */
function LeafletMap({ venues, active, setActive }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const didFitRef = useRef(false);
  const setActiveRef = useRef(setActive);
  setActiveRef.current = setActive;

  // init once
  useEffect(() => {
    if (!window.L || mapRef.current || !elRef.current) return;
    const map = L.map(elRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
    }).setView([45.758, 4.832], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    const fix = () => map.invalidateSize();
    setTimeout(fix, 250);
    window.addEventListener('resize', fix);
    return () => { window.removeEventListener('resize', fix); map.remove(); mapRef.current = null; markersRef.current = {}; };
  }, []);

  // add/remove markers when the venue list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let added = false;
    venues.forEach(v => {
      if (markersRef.current[v.id]) return;
      const cls = 'lpin' + (v.hot ? ' hot' : '') + (v.custom ? ' mine' : '');
      const icon = L.divIcon({
        className: 'lpin-wrap',
        html: `<div class="${cls}"><span class="lpin-dot"></span><span class="lpin-label">${v.name}</span></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const m = L.marker([v.lat, v.lng], { icon, title: v.name }).addTo(map);
      m.on('click', () => setActiveRef.current(v.id));
      markersRef.current[v.id] = m;
      added = true;
    });
    if (added && !didFitRef.current) {
      const group = L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.25));
      didFitRef.current = true;
    }
  }, [venues]);

  // react to the active venue (from list clicks or marker clicks)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const v = venues.find(x => x.id === active);
    if (!v) return;
    map.flyTo([v.lat, v.lng], Math.max(map.getZoom(), 14), { animate: true, duration: 0.5 });
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const el = m.getElement();
      const pin = el && el.querySelector('.lpin');
      if (pin) pin.classList.toggle('active', id === active);
      m.setZIndexOffset(id === active ? 1000 : 0);
    });
  }, [active, venues]);

  return <div ref={elRef} className="leaflet-host" style={{ position: 'absolute', inset: 0 }}></div>;
}
window.LeafletMap = LeafletMap;
window.MapScreen = MapScreen;
