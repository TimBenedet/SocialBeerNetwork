/* untappdReborn — Feed + Discover ----------------------------------------- */
const { useState } = React;

/* ---- Edit an existing check-in (verdict / feelings / characters / note / place) ---- */
const EDIT_VERDICTS = ['love','again','fine','meh','never'];
function EditCheckinModal({ item, onClose }) {
  const beer = beerById(item.beerId);
  const [verdict, setVerdict] = useState(item.verdict || null);
  const [feelings, setFeelings] = useState(item.feelings || []);
  const [characters, setCharacters] = useState(item.characters || []);
  const [note, setNote] = useState(item.note || '');
  const [place, setPlace] = useState(item.venue || '');

  const toggle = (arr, fn, val) => fn(arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]);

  const save = () => {
    checkinStore.update(item.id, { verdict, feelings, characters, note: note.trim(), place: place.trim() });
    onClose();
  };

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="step">Modifier le check-in</div>
            <h3>{beer ? beer.name : 'Dégustation'}</h3>
          </div>
          <button className="modal-close" onClick={onClose}><Icon name="close" size={20}/></button>
        </div>
        <div className="modal-body">
          <div className="pick-cat" style={{marginTop:0}}>Ton verdict</div>
          <div className="verdict-grid">
            {EDIT_VERDICTS.map(v => (
              <button key={v} className={'verdict-pick' + (verdict===v?' sel':'')} onClick={()=>setVerdict(v)}>
                <span className="em"><VerdictGlyph v={v} size={34} /></span>
                <span className="lbl">{VERDICTS[v].label}</span>
              </button>
            ))}
          </div>
          <div className="pick-cat">Ressenti</div>
          <div className="pick-cloud">
            {FEELINGS.map(f => (
              <button key={f} className={'pick-tag accent' + (feelings.includes(f)?' sel':'')} onClick={()=>toggle(feelings,setFeelings,f)}>{f}</button>
            ))}
          </div>
          <div className="pick-cat">Caractère</div>
          <div className="pick-cloud">
            {CHARACTERS.map(f => (
              <button key={f} className={'pick-tag' + (characters.includes(f)?' sel':'')} onClick={()=>toggle(characters,setCharacters,f)}>{f}</button>
            ))}
          </div>
          <div className="pick-cat">Ta note</div>
          <textarea className="note-input" placeholder="Un souvenir, une impression…" value={note} onChange={e=>setNote(e.target.value)} />
          <div className="pick-cat">Où&nbsp;?</div>
          <input className="text-input" placeholder="Un bar, une adresse, chez toi…" value={place} onChange={e=>setPlace(e.target.value)} />
        </div>
        <div className="modal-foot">
          <div className="spacer"></div>
          <button className="btn" onClick={onClose}>Annuler</button>
          <button className="btn primary" onClick={save}><Icon name="check" size={16}/> Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
window.EditCheckinModal = EditCheckinModal;

/* ============================== FEED ============================== */
function CheckinCard({ item, onOpenBeer }) {
  const u = USERS[item.user];
  const beer = beerById(item.beerId);
  const [editing, setEditing] = useState(false);
  if (!beer) return null;
  const brew = BREWERIES[beer.brewery] || { name:'', city:'' };

  const remove = () => {
    if (!window.confirm(`Supprimer ta dégustation de « ${beer.name} » ?`)) return;
    checkinStore.remove(item.id);
  };

  return (
    <article className="checkin">
      {editing && <EditCheckinModal item={item} onClose={()=>setEditing(false)} />}
      <div className="ci-head">
        <Avatar user={u} size={42} />
        <div className="ci-who">
          <b>Tu as dégusté</b><br/>
          <Verdict v={item.verdict} />
        </div>
        <span className="ci-time">{item.time}</span>
      </div>
      <div className="ci-body">
        <div className="ci-glass">
          <Glass hue={beer.hue} w={46} fill={beer.glassFill} />
        </div>
        <div>
          <div className="ci-beer-style">{beer.style}</div>
          <h3 className="ci-beer-name" style={{cursor:'pointer'}} onClick={()=>onOpenBeer(beer.id)}>{beer.name}</h3>
          <div className="ci-brewery">{brew.name}{brew.city ? ` · ${brew.city}` : ''}</div>
          <div className="ci-tags">
            {item.feelings.map(f => <Tag key={f} variant="tint">{f}</Tag>)}
            {item.characters.map(c => <Tag key={c}><span className="dot"></span>{c}</Tag>)}
          </div>
          {item.note && <p className="ci-note"><span className="q">«&nbsp;</span>{item.note}<span className="q">&nbsp;»</span></p>}
        </div>
      </div>
      <div className="ci-foot">
        {item.venue && <span className="ci-venue"><Icon name="pin" size={15}/> {item.venue}</span>}
        <div className="ci-actions">
          <button className="ci-act" onClick={()=>setEditing(true)}><Icon name="pen" size={15} /> Modifier</button>
          <button className="ci-act danger" onClick={remove}><Icon name="trash" size={15} /> Supprimer</button>
        </div>
      </div>
    </article>
  );
}

function RecoCard({ beerId, why, onOpenBeer }) {
  const beer = beerById(beerId);
  if (!beer) return null;
  const c = BEER_HUES[beer.hue];
  return (
    <div className="reco-card" onClick={()=>onOpenBeer(beerId)}>
      <div className="reco-thumb" style={{ background:c.glow }}>
        <Glass hue={beer.hue} w={52} fill={beer.glassFill} />
      </div>
      <div className="reco-body">
        <div className="reco-style">{beer.style}</div>
        <div className="reco-name">{beer.name}</div>
        <div className="reco-why"><Icon name="sparkle" size={13}/> {why}</div>
      </div>
    </div>
  );
}

function FeedScreen({ onOpenBeer, onCheckin }) {
  useDataVersion();
  const me = USERS.me;
  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Bonsoir{me && me.name ? `, ${me.name.split(' ')[0]}` : ''}.</h1>
        <p className="page-sub">Tes dernières dégustations apparaîtront ici.</p>
      </div>

      <div className="feed-layout">
        <div className="feed-list">
          {FEED.length ? (
            FEED.map(item => <CheckinCard key={item.id} item={item} onOpenBeer={onOpenBeer} />)
          ) : (
            <div className="empty-state" style={{padding:'48px 0',textAlign:'center',color:'var(--ink-mute)'}}>
              <p style={{marginBottom:16}}>Aucune dégustation pour l'instant.</p>
              {onCheckin && <button className="ci-act" onClick={onCheckin}><Icon name="pen" size={15}/> Enregistrer une dégustation</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
window.FeedScreen = FeedScreen;

/* ============================== DISCOVER ============================== */
function BeerCard({ beerId, onOpenBeer }) {
  const beer = beerById(beerId);
  if (!beer) return null;
  const brew = BREWERIES[beer.brewery] || { name:'' };
  const c = BEER_HUES[beer.hue];
  const verdictEntries = Object.entries(beer.verdicts || {});
  const topV = verdictEntries.length ? verdictEntries.sort((a,b)=>b[1]-a[1])[0][0] : null;
  return (
    <div className="beer-card" onClick={()=>onOpenBeer(beerId)}>
      <div className="beer-card-thumb" style={{ background:c.glow }}>
        <Glass hue={beer.hue} w={62} fill={beer.glassFill} />
      </div>
      <div className="beer-card-body">
        <div className="reco-style">{beer.style}</div>
        <div className="beer-card-name">{beer.name}</div>
        <div className="beer-card-brew">{brew.name}</div>
        <div className="beer-card-foot">
          {topV && <Verdict v={topV} />}
        </div>
      </div>
    </div>
  );
}
window.BeerCard = BeerCard;

const MOODS = ['Tous','Rafraîchissant','Réconfortant','Contemplatif','Festif','Aventureux','Énergisant'];

function DiscoverScreen({ onOpenBeer }) {
  useDataVersion();
  const [mood, setMood] = useState('Tous');
  const [q, setQ] = useState('');

  const all = BEERS.map(b=>b.id);
  const byMood = (ids) => mood==='Tous' ? ids : ids.filter(id => {
    const b = beerById(id);
    return b && (b.feelings || []).some(f=>f[0]===mood);
  });
  const matchQ = (ids) => !q ? ids : ids.filter(id=>{
    const b = beerById(id);
    if (!b) return false;
    const brewName = (BREWERIES[b.brewery] || {}).name || '';
    return (b.name+b.style+brewName).toLowerCase().includes(q.toLowerCase());
  });

  const moodResults = matchQ(byMood(all));

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-kicker">Découverte</div>
        <h1 className="page-title">Qu'est-ce qui te ferait du bien&nbsp;?</h1>
      </div>

      <div className="search-bar">
        <Icon name="search" />
        <input placeholder="Une bière, un style, une brasserie…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      <div className="mood-row">
        {MOODS.map(m => (
          <button key={m} className={'mood-chip' + (m===mood?' active':'')} onClick={()=>setMood(m)}>{m}</button>
        ))}
      </div>

      <div className="collection">
        <div className="coll-head">
          <div>
            <div className="coll-title">{mood==='Tous' ? 'Toutes les bières' : `Pour un moment « ${mood} »`}</div>
            <div className="coll-sub">{moodResults.length} résultat{moodResults.length>1?'s':''}</div>
          </div>
        </div>
        {moodResults.length ? (
          <div className="beer-grid">
            {moodResults.map(id => <BeerCard key={id} beerId={id} onOpenBeer={onOpenBeer} />)}
          </div>
        ) : (
          <p style={{color:'var(--ink-mute)',padding:'30px 0'}}>Aucune bière ne correspond. Essaie un autre ressenti.</p>
        )}
      </div>
    </div>
  );
}
window.DiscoverScreen = DiscoverScreen;
