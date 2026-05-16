import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm]   = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast]   = useState(null);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Champ obligatoire';
    if (!form.password)        e.password = 'Champ obligatoire';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await login(form);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="auth-wrap">
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse 90% 55% at 50% 110%, rgba(87,112,122,0.45) 0%, transparent 65%),
          radial-gradient(ellipse 60% 40% at 15% 85%, rgba(133,79,108,0.22) 0%, transparent 55%),
          radial-gradient(ellipse 45% 35% at 85% 25%, rgba(133,79,108,0.12) 0%, transparent 50%),
          linear-gradient(180deg, #060a0e 0%, #10161e 55%, #16212d 100%)
        `,
      }} aria-hidden="true">
        {/* Mountain silhouette in background */}
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="none"
             style={{ position: 'absolute', bottom: 0, width: '100%', opacity: .6 }}>
          <path d="M0,320 L0,200 L200,120 L400,185 L600,95 L800,165 L1000,80 L1200,145 L1440,100 L1440,320 Z"
                fill="rgba(87,112,122,0.10)" />
          <path d="M0,320 L0,265 L320,185 L640,240 L960,175 L1280,225 L1440,200 L1440,320 Z"
                fill="rgba(25,29,35,0.55)" />
          <path d="M0,320 L0,305 L480,265 L960,300 L1440,275 L1440,320 Z"
                fill="rgba(12,18,24,0.8)" />
        </svg>
      </div>

      {/* Card */}
      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>
        {/* Back to landing */}
        <Link to="/" className="auth-back">
          ← Accueil
        </Link>

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-mark">S</div>
          <span className="auth-logo-text">SecureAPI</span>
        </div>

        {/* Header */}
        <h1 className="auth-title">Bon retour</h1>
        <p className="auth-sub">Connectez-vous à votre espace sécurisé</p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              className="form-input"
              type="text"
              placeholder="ex: jean.dupont"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
              autoFocus
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: '.5rem' }}
          >
            {loading ? 'Authentification…' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          Pas encore inscrit ?{' '}
          <Link to="/register">Créer un compte</Link>
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
