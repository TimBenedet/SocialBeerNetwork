/* untappdReborn — icons + UI primitives ----------------------------------- */
const { useState, useEffect, useRef } = React;

/* ---- icon set (stroke, 24 grid) ---- */
const Icon = ({ name, size, style, className }) => {
  const s = size || 24;
  const p = { width:s, height:s, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor',
              strokeWidth:1.7, strokeLinecap:'round', strokeLinejoin:'round', style, className };
  const paths = {
    home:    <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-5h5v5"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></>,
    map:     <><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z"/><path d="M9 4v13M15 6.5v13"/></>,
    trophy:  <><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/><path d="M12 13v4M9 21h6M9.5 21l.5-4h4l.5 4"/></>,
    user:    <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></>,
    plus:    <><path d="M12 5v14M5 12h14"/></>,
    search:  <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></>,
    heart:   <><path d="M12 20s-7-4.4-9.2-9C1.5 8 3 4.8 6.2 4.8c2 0 3.2 1.3 3.8 2.4.6-1.1 1.8-2.4 3.8-2.4 3.2 0 4.7 3.2 3.4 6.2C19 15.6 12 20 12 20z"/></>,
    chat:    <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-5.2A8 8 0 1 1 21 12z"/></>,
    bookmark:<><path d="M6 4h12v16l-6-4-6 4V4z"/></>,
    pin:     <><path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></>,
    clock:   <><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></>,
    close:   <><path d="M6 6l12 12M18 6 6 18"/></>,
    arrow:   <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    arrowL:  <><path d="M19 12H5M11 6l-6 6 6 6"/></>,
    sparkle: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3"/></>,
    spark:   <><path d="M12 2.5 14 9l6.5 2L14 13l-2 6.5L10 13 3.5 11 10 9z"/></>,
    drop:    <><path d="M12 3s6 6.4 6 10.5A6 6 0 0 1 6 13.5C6 9.4 12 3 12 3z"/></>,
    globe:   <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"/></>,
    moon:    <><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></>,
    hop:     <><path d="M12 3c3 0 5 2 5 5 0 5-5 13-5 13S7 13 7 8c0-3 2-5 5-5z"/><path d="M12 7v9M9.5 9.5h5M9 13h6"/></>,
    leaf:    <><path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z"/><path d="M5 19c3.5-3.5 7-6 11-8"/></>,
    star:    <><path d="m12 3 2.6 5.6L20.5 9.5l-4.3 4 1 6-5.2-2.8L6.8 19.5l1-6-4.3-4 5.9-.9z"/></>,
    lemon:   <><ellipse cx="12" cy="12" rx="6" ry="8"/><path d="M12 4v16M6 12h12"/></>,
    cheers:  <><path d="M5 4h5l-.5 7a2 2 0 0 1-4 0L5 4zM14 4h5l-.5 7a2 2 0 0 1-4 0L14 4z"/><path d="M7.5 13v6M16.5 13v6M5 21h5M14.5 21h5"/></>,
    list:    <><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></>,
    check:   <><path d="M4 12.5 9 17 20 6"/></>,
    bell:    <><path d="M18 9a6 6 0 1 0-12 0c0 7-2 8-2 8h16s-2-1-2-8z"/><path d="M10.5 20a2 2 0 0 0 3 0"/></>,
    pen:     <><path d="M16 4 20 8 9 19l-4.5 1.2L6 16z"/></>,
    camera:  <><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.4"/></>,
    sun:     <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></>,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
};
window.Icon = Icon;

/* ---- beer glass placeholder (iconographic, filled w/ beer colour) ---- */
const Glass = ({ hue, w, fill, foam }) => {
  const c = (BEER_HUES[hue] || BEER_HUES.gold);
  const W = w || 56;
  const H = W * 1.7;
  const level = fill ?? .84;
  const id = 'g' + hue + W;
  // glass tapers slightly; liquid fills from bottom
  const topY = 6, botY = H - 5;
  const liqTop = topY + (botY - topY) * (1 - level);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="glass" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <path d={`M${W*0.2} ${topY} h${W*0.6} l-${W*0.07} ${botY-topY} h-${W*0.46} z`} />
        </clipPath>
        <linearGradient id={id+'l'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.liquid} stopOpacity="0.92"/>
          <stop offset="1" stopColor={c.liquid}/>
        </linearGradient>
      </defs>
      {/* glass body bg */}
      <path d={`M${W*0.2} ${topY} h${W*0.6} l-${W*0.07} ${botY-topY} h-${W*0.46} z`} fill="#fff" />
      {/* liquid */}
      <g clipPath={`url(#${id})`}>
        <rect x="0" y={liqTop} width={W} height={H} fill={`url(#${id+'l'})`} />
        {foam !== false && <rect x="0" y={liqTop-7} width={W} height="9" fill={c.foam} />}
        {/* bubbles */}
        <circle cx={W*0.36} cy={H*0.7} r="1.3" fill="#fff" opacity=".4"/>
        <circle cx={W*0.5} cy={H*0.82} r="1" fill="#fff" opacity=".35"/>
        <circle cx={W*0.6} cy={H*0.6} r="1.1" fill="#fff" opacity=".3"/>
      </g>
      {/* glass outline */}
      <path d={`M${W*0.2} ${topY} h${W*0.6} l-${W*0.07} ${botY-topY} h-${W*0.46} z`}
            fill="none" stroke="rgba(27,23,20,.22)" strokeWidth="1.4" strokeLinejoin="round"/>
      {/* shine */}
      <path d={`M${W*0.27} ${topY+3} l-${W*0.045} ${botY-topY-6}`} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".5"/>
    </svg>
  );
};
window.Glass = Glass;

/* ---- avatar ---- */
const Avatar = ({ user, size }) => {
  const u = typeof user === 'string' ? USERS[user] : user;
  const s = size || 40;
  return (
    <div className="avatar" style={{ width:s, height:s, background:u.color, fontSize:s*0.36 }}>
      {u.init}
    </div>
  );
};
window.Avatar = Avatar;

/* ---- verdict chip ---- */
const VerdictGlyph = ({ v, size }) => {
  const s = size || 15;
  const common = { width:s, height:s, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' };
  const g = {
    love:  <path d="M12 20s-7-4.4-9.2-9C1.5 8 3 4.8 6.2 4.8c2 0 3.2 1.3 3.8 2.4.6-1.1 1.8-2.4 3.8-2.4 3.2 0 4.7 3.2 3.4 6.2C19 15.6 12 20 12 20z" fill="currentColor" stroke="none"/>,
    again: <path d="M4 12.5 9 17 20 6"/>,
    fine:  <><circle cx="12" cy="12" r="8.5"/><path d="M8.5 13.5s1.2 1.5 3.5 1.5 3.5-1.5 3.5-1.5"/><path d="M9 9.5h.01M15 9.5h.01"/></>,
    meh:   <><circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5h7"/><path d="M9 9.5h.01M15 9.5h.01"/></>,
    never: <><circle cx="12" cy="12" r="8.5"/><path d="M9 8l6 8M15 8l-6 8"/></>,
  };
  return <svg {...common} className="glyph">{g[v]}</svg>;
};
const Verdict = ({ v, withIcon=true }) => (
  <span className="verdict" data-v={v}>
    {withIcon && <VerdictGlyph v={v} />}
    {VERDICTS[v].short}
  </span>
);
window.Verdict = Verdict;
window.VerdictGlyph = VerdictGlyph;

/* ---- tag ---- */
const Tag = ({ children, variant }) => (
  <span className={'tag' + (variant ? ' ' + variant : '')}>{children}</span>
);
window.Tag = Tag;

/* ---- toast (heart) action with local state ---- */
const ToastBtn = ({ count }) => {
  const [on, setOn] = useState(false);
  return (
    <button className={'ci-act' + (on ? ' on' : '')} onClick={()=>setOn(!on)}>
      <Icon name="heart" style={{ fill: on ? 'currentColor':'none' }} />
      {count + (on?1:0)}
    </button>
  );
};
window.ToastBtn = ToastBtn;
