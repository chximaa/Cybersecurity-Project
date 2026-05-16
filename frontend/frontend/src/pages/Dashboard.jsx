import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getToken } from '../utils/auth';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [tokenParts,    setTokenParts]    = useState({ header: '', payload: '', signature: '' });
  const [decodedPayload, setDecodedPayload] = useState(null);
  const [timeLeft,      setTimeLeft]      = useState('');

  useEffect(() => {
    const t = getToken();
    if (!t) return;
    try {
      const parts = t.split('.');
      setTokenParts({ header: parts[0], payload: parts[1], signature: parts[2] });
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setDecodedPayload(payload);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!decodedPayload?.exp) return;
    const iv = setInterval(() => {
      const rem = decodedPayload.exp * 1000 - Date.now();
      if (rem <= 0) { setTimeLeft('Expiré'); clearInterval(iv); return; }
      const h = Math.floor(rem / 3600000);
      const m = Math.floor((rem % 3600000) / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(iv);
  }, [decodedPayload]);

  const issuedAt  = decodedPayload?.iat ? new Date(decodedPayload.iat * 1000).toLocaleString('fr-MA') : '—';
  const expiresAt = decodedPayload?.exp ? new Date(decodedPayload.exp * 1000).toLocaleString('fr-MA') : '—';

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <p className="page-eyebrow">Session active</p>
          <h1 className="page-title">
            Bonjour, {user?.username} 👋
          </h1>
          <p className="page-sub">Authentification JWT stateless — vos accès sont sécurisés</p>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          <div className="stat-card teal">
            <p className="stat-label">Statut de session</p>
            <p className="stat-value teal">Active</p>
          </div>
          <div className="stat-card rose">
            <p className="stat-label">Expiration dans</p>
            <p className="stat-value rose" style={{ fontSize: '1.4rem' }}>{timeLeft || '…'}</p>
          </div>
          <div className="stat-card slate">
            <p className="stat-label">Rôle attribué</p>
            <p className="stat-value slate" style={{ fontSize: '1.2rem' }}>
              {isAdmin ? 'Admin' : 'User'}
            </p>
          </div>
          <div className="stat-card mauve">
            <p className="stat-label">Algorithme</p>
            <p className="stat-value mauve" style={{ fontSize: '1.2rem' }}>HS256</p>
          </div>
        </div>

        {/* JWT Viewer */}
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div className="section-label">Token JWT actuel</div>
          <div style={{ display: 'grid', gap: '.85rem' }}>
            {[
              { label: 'Header — algorithme & type', value: tokenParts.header, cls: 'teal' },
              { label: 'Payload — données utilisateur', value: tokenParts.payload, cls: 'slate' },
              { label: 'Signature — HMAC-SHA256', value: tokenParts.signature, cls: 'rose' },
            ].map(({ label, value, cls }) => (
              <div key={label}>
                <p style={{ fontSize: '.7rem', fontWeight: 600, letterSpacing: '.1em',
                            textTransform: 'uppercase', color: 'var(--text-muted)',
                            marginBottom: '.35rem' }}>
                  {label}
                </p>
                <div className={`code-block ${cls}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Decoded Payload */}
          <div className="glass-card">
            <div className="section-label">Payload décodé</div>
            {decodedPayload ? (
              <div style={{ display: 'grid', gap: '.7rem' }}>
                {[
                  { k: 'Sujet (sub)',      v: decodedPayload.sub },
                  { k: 'Émis le (iat)',    v: issuedAt },
                  { k: 'Expire le (exp)',  v: expiresAt },
                  { k: 'Rôles',           v: decodedPayload.roles?.join(', ') },
                ].map(({ k, v }) => (
                  <div key={k} style={{ paddingBottom: '.6rem', borderBottom: '1px solid var(--border)' }}>
                    <p className="info-label" style={{ marginBottom: '.18rem' }}>{k}</p>
                    <p className="info-value" style={{ fontSize: '.84rem' }}>{v || '—'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="loading">Chargement…</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="glass-card">
            <div className="section-label">Navigation rapide</div>
            <div style={{ display: 'grid', gap: '.65rem' }}>
              <Link to="/profile" className="quick-link">
                <span className="quick-link-icon">👤</span>
                <div>
                  <p className="quick-link-title">Mon profil</p>
                  <p className="quick-link-hint">GET /api/user/profile</p>
                </div>
              </Link>

              {isAdmin && (
                <Link to="/admin" className="quick-link admin-link">
                  <span className="quick-link-icon">⚙️</span>
                  <div>
                    <p className="quick-link-title">Administration</p>
                    <p className="quick-link-hint">GET /api/admin/users</p>
                  </div>
                </Link>
              )}

              <a href="http://localhost:8080/swagger-ui.html"
                 target="_blank" rel="noreferrer"
                 className="quick-link api-link">
                <span className="quick-link-icon">📋</span>
                <div>
                  <p className="quick-link-title">Swagger UI</p>
                  <p className="quick-link-hint">Documentation OpenAPI</p>
                </div>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
