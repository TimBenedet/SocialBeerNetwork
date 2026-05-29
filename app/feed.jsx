/* untappdReborn — Feed + Discover ----------------------------------------- */
const { useState } = React;


/* ============================== FEED ============================== */
function CheckinCard({ item, onOpenBeer }) {
  const u = USERS[item.user];
  const beer = beerById(item.beerId);
  const brew = BREWERIES[beer.brewery];
  return (
    <article className="checkin">
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
          <div className="ci-brewery">{brew.name} · {brew.city}</div>
          <div className="ci-tags">
            {item.feelings.map(f => <Tag key={f} variant="tint">{f}</Tag>)}
            {item.characters.map(c => <Tag key={c}><span className="dot"></span>{c}</Tag>)}
          </div>
          {item.note && <p className="ci-note"><span className="q">«&nbsp;</span>{item.note}<span className="q">&nbsp;»</span></p>}
        </div>
      </div>
      <div className="ci-foot">
        <span className="ci-venue"><Icon name="pin" size={15}/> {item.venue}</span>
        <div className="ci-actions">
          <button className="ci-act"><Icon name="pen" size={15} /> Modifier</button>
          <button className="ci-act"><Icon name="bookmark" /></button>
        </div>
      </div>
    </article>
  );
}

function RecoCard({ beerId, why, onOpenBeer }) {
  const beer = beerById(beerId);
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
  return (
    <div className="page">
      <div className="page-head">
        <div className="page-kicker">Mercredi 29 mai · Lyon</div>
        <h1 className="page-title">Bonsoir, Timothée.</h1>
        <p className="page-sub">Tes dernières dégustations — et quelques bières qui pourraient te parler ce soir.</p>
      </div>

      <div className="reco-strip">
        <div className="strip-head">
          <div className="strip-title">Pour toi, ce soir</div>
        </div>
        <div className="strip-cards">
          <RecoCard beerId="velours" why="Tu aimes le « Contemplatif »" onOpenBeer={onOpenBeer} />
          <RecoCard beerId="comete" why="Dans la lignée de tes IPA" onOpenBeer={onOpenBeer} />
          <RecoCard beerId="aurore" why="Pour une soirée festive" onOpenBeer={onOpenBeer} />
          <RecoCard beerId="ambre" why="Parfait quand il fait frais" onOpenBeer={onOpenBeer} />
          <RecoCard beerId="sauvage" why="Tu n'as jamais goûté de Saison" onOpenBeer={onOpenBeer} />
        </div>
      </div>

      <div className="feed-layout">
        <div className="feed-list">
          {FEED.map(item => <CheckinCard key={item.id} item={item} onOpenBeer={onOpenBeer} />)}
        </div>
        <aside className="rail">
          <div className="rail-card">
            <div className="rail-title">Ta semaine</div>
            <div className="mini-stat" style={{marginBottom:14}}>
              <span className="n serif">9</span><span className="l">bières<br/>découvertes</span>
            </div>
            <hr className="hr" style={{margin:'4px 0 14px'}}/>
            <div style={{display:'flex',gap:24}}>
              <div className="mini-stat"><span className="n serif">4</span><span className="l">coups de<br/>cœur</span></div>
              <div className="mini-stat"><span className="n serif">5</span><span className="l">nouveaux<br/>styles</span></div>
            </div>
          </div>

          <div className="rail-card">
            <div className="rail-title">À reprendre</div>
            <div className="rail-row">
              <Avatar user="me" size={36}/>
              <div><div className="name">Velours Noir</div><div className="sub">Ton dernier coup de cœur</div></div>
            </div>
            <div className="rail-row">
              <Avatar user="me" size={36}/>
              <div><div className="name">Brume</div><div className="sub">Goûtée il y a 14 min</div></div>
            </div>
          </div>

          <div className="rail-card">
            <div className="rail-title">Défi de la semaine</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:19,lineHeight:1.1,marginBottom:8}}>5 styles à découvrir</div>
            <div className="badge-prog">
              <div className="track"><div className="fill" style={{width:'60%'}}></div></div>
              <div className="lbl">3 / 5 nouveaux styles</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
window.FeedScreen = FeedScreen;

/* ============================== DISCOVER ============================== */
function BeerCard({ beerId, onOpenBeer }) {
  const beer = beerById(beerId);
  const brew = BREWERIES[beer.brewery];
  const c = BEER_HUES[beer.hue];
  const topV = Object.entries(beer.verdicts).sort((a,b)=>b[1]-a[1])[0][0];
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
          <Verdict v={topV} />
        </div>
      </div>
    </div>
  );
}
window.BeerCard = BeerCard;

const MOODS = ['Tous','Rafraîchissant','Réconfortant','Contemplatif','Festif','Aventureux','Énergisant'];

function DiscoverScreen({ onOpenBeer }) {
  const [mood, setMood] = useState('Tous');
  const [q, setQ] = useState('');

  const all = BEERS.map(b=>b.id);
  const byMood = (ids) => mood==='Tous' ? ids : ids.filter(id => {
    const b = beerById(id);
    return b.feelings.some(f=>f[0]===mood);
  });
  const matchQ = (ids) => !q ? ids : ids.filter(id=>{
    const b = beerById(id);
    return (b.name+b.style+BREWERIES[b.brewery].name).toLowerCase().includes(q.toLowerCase());
  });

  const trending = matchQ(byMood(['brume','pepite','comete','aurore']));
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

      {!q && mood==='Tous' && (
        <div className="collection">
          <div className="coll-head">
            <div>
              <div className="coll-title">Tendances cette semaine</div>
              <div className="coll-sub">Le plus de coups de cœur à Lyon</div>
            </div>
          </div>
          <div className="beer-grid">
            {['brume','pepite','comete','aurore'].map(id => <BeerCard key={id} beerId={id} onOpenBeer={onOpenBeer} />)}
          </div>
        </div>
      )}

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
