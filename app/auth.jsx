/* untappdReborn — auth: API helper + Login screen ------------------------- */
const { useState } = React;

/* --- API helper ------------------------------------------------------------
 * Talks to the auth backend through the nginx /api/ proxy (same origin).
 */
const api = {
  async login(username, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      let msg = 'Identifiants invalides';
      try { const j = await res.json(); if (j && j.error) msg = j.error; } catch (e) {}
      const err = new Error(msg); err.status = res.status; throw err;
    }
    return res.json(); // { token, user }
  },
  async me(token) {
    const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Session expirée');
    return res.json(); // { user }
  },
  async logout(token) {
    try {
      await fetch('/api/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { /* best effort */ }
  },
};
window.api = api;

/* --- Login screen ---------------------------------------------------------- */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | string(error)

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password || status === 'loading') return;
    setStatus('loading');
    try {
      const { token, user } = await api.login(username.trim(), password);
      onLogin(token, user);
    } catch (err) {
      setStatus(err.message || 'Connexion impossible');
    }
  };

  const disabled = status === 'loading' || !username.trim() || !password;

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand login-brand">
          <div className="brand-mark"><Icon name="drop" size={22} /></div>
          <div className="brand-name">untappd<b>·</b></div>
        </div>
        <h1 className="login-title serif">Connexion</h1>
        <p className="login-sub">Identifie-toi pour retrouver ton carnet.</p>

        <form onSubmit={submit} className="login-form">
          <label className="field-lbl">Identifiant</label>
          <input className="text-input" autoFocus autoComplete="username"
            placeholder="Tim ou guest" value={username}
            onChange={e => { setUsername(e.target.value); if (status && status !== 'loading') setStatus(null); }} />

          <label className="field-lbl" style={{ marginTop: 14 }}>Mot de passe</label>
          <input className="text-input" type="password" autoComplete="current-password"
            placeholder="••••••" value={password}
            onChange={e => { setPassword(e.target.value); if (status && status !== 'loading') setStatus(null); }} />

          {status && status !== 'loading' && <p className="login-err">{status}</p>}

          <button type="submit" className="btn primary login-btn" disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
            {status === 'loading' ? 'Connexion…' : <>Se connecter <Icon name="arrow" size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
window.LoginScreen = LoginScreen;
