import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="landing">
      {/* Atmospheric background layers */}
      <div className="landing-bg" aria-hidden="true" />
      <div className="landing-stars" aria-hidden="true" />

      {/* Minimal header */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="landing-logo-mark">S</div>
          <span className="landing-logo-text">SecureAPI</span>
        </div>
        <nav style={{ display: 'flex', gap: '.5rem' }}>
          <Link to="/login" className="btn-ghost btn"
                style={{ padding: '.38rem .9rem', fontSize: '.82rem', fontWeight: 500,
                         background: 'rgba(151,157,171,0.07)', border: '1px solid rgba(151,157,171,0.15)',
                         borderRadius: '6px', color: 'var(--c-300)', transition: 'all .2s' }}>
            Se connecter
          </Link>
          <Link to="/register" className="btn-accent btn"
                style={{ padding: '.38rem 1rem', fontSize: '.82rem', fontWeight: 600,
                         background: 'var(--accent)', color: '#fff',
                         border: '1px solid transparent', borderRadius: '6px',
                         boxShadow: '0 2px 12px rgba(133,79,108,0.3)', transition: 'all .25s' }}>
            S'inscrire
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="landing-hero">
        <div className="landing-eyebrow">
          <span>✦</span>
          Spring Boot · JWT · Spring Security
        </div>

        <h1 className="landing-title">
          Sécurisez vos <em>API</em><br />
          
        </h1>

        <p className="landing-sub">
          Une architecture moderne d'authentification JWT,
          conçue pour la performance et la sécurité de vos services REST.
        </p>

        <div className="landing-cta">
          <Link to="/login" className="btn-landing-primary">
            Se connecter →
          </Link>
          <Link to="/register" className="btn-landing-ghost">
            Créer un compte
          </Link>
        </div>

        <div className="landing-features">
          {[
            'JWT Stateless',
            'BCrypt · Facteur 12',
            'RBAC Roles',
            'Spring Security 6',
            'OpenAPI / Swagger',
          ].map(f => (
            <span className="landing-feature" key={f}>
              <span className="landing-feature-dot" />
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* Mountain silhouettes — pure CSS SVG */}
      <div className="landing-mountains" aria-hidden="true">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="none" style={{ width: '100%', display: 'block' }}>
          {/* Far mountains */}
          <path d="M0,320 L0,200 L120,110 L240,165 L360,90 L480,145 L600,70 L720,130 L840,55 L960,120 L1080,75 L1200,135 L1320,85 L1440,140 L1440,320 Z"
                fill="rgba(87,112,122,0.10)" />
          {/* Mid mountains */}
          <path d="M0,320 L0,240 L180,150 L360,210 L540,130 L720,190 L900,120 L1080,175 L1260,140 L1440,195 L1440,320 Z"
                fill="rgba(87,112,122,0.18)" />
          {/* Near ridge */}
          <path d="M0,320 L0,275 L240,195 L480,250 L720,185 L960,245 L1200,195 L1440,230 L1440,320 Z"
                fill="rgba(30,39,48,0.55)" />
          {/* Foreground */}
          <path d="M0,320 L0,305 L360,260 L720,295 L1080,255 L1440,280 L1440,320 Z"
                fill="rgba(14,20,28,0.85)" />
        </svg>
      </div>
    </div>
  );
}
