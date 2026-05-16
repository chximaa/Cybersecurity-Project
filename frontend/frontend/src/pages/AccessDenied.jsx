import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AccessDenied() {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const t = setInterval(() => setCount(c => c - 1), 1000);
    const r = setTimeout(() => navigate('/dashboard'), 5000);
    return () => { clearInterval(t); clearTimeout(r); };
  }, [navigate]);

  return (
    <div className="page denied-wrap">
      <div style={{ animation: 'fadeUp .45s ease both' }}>
        <div className="denied-number">403</div>

        <h1 className="denied-title">Accès refusé</h1>
        <p className="denied-sub">
          Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
          <br />
          Le rôle{' '}
          <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>ROLE_ADMIN</span>
          {' '}est requis.
        </p>

        {/* HTTP snippet */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(25,29,35,0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(155,91,91,0.22)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          textAlign: 'left',
          fontFamily: "'Outfit', monospace",
          fontSize: '.78rem',
          lineHeight: 1.85,
        }}>
          <span style={{ color: 'var(--text-muted)' }}>HTTP/1.1 </span>
          <span style={{ color: '#c07070' }}>403 Forbidden</span>
          <br />
          <span style={{ color: 'var(--text-muted)' }}>WWW-Authenticate: </span>
          <span style={{ color: 'var(--c-300)' }}>Bearer error="insufficient_scope"</span>
          <br /><br />
          <span style={{ color: '#c07070' }}>{'{'}</span>
          <br />
          <span style={{ paddingLeft: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>"error": </span>
            <span style={{ color: 'var(--c-200)' }}>"Access Denied"</span>
          </span>
          <br />
          <span style={{ color: '#c07070' }}>{'}'}</span>
        </div>

        <p style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          Redirection automatique dans{' '}
          <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{count}s</span>…
        </p>

        <Link to="/dashboard" className="btn btn-primary">
          ← Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
