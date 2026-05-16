import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', email: '', password: '',
    firstName: '', lastName: '',
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast]   = useState(null);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())                    e.firstName = 'Champ obligatoire';
    if (!form.lastName.trim())                     e.lastName  = 'Champ obligatoire';
    if (!form.username.trim() || form.username.length < 3) e.username = 'Minimum 3 caractères';
    if (!form.email.includes('@'))                 e.email = 'Adresse email invalide';
    if (form.password.length < 8)                  e.password = 'Minimum 8 caractères';
    else if (!/[A-Z]/.test(form.password))         e.password = 'Doit contenir une majuscule';
    else if (!/\d/.test(form.password))            e.password = 'Doit contenir un chiffre';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await register(form);
    if (result.success) {
      setToast({ type: 'success', message: result.message });
      setTimeout(() => navigate('/login'), 1800);
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: (e) => setForm({ ...form, [field]: e.target.value }),
  });

  return (
    <div className="auth-split">
      {/* ── Left decorative panel ───────────────────────── */}
      <div className="auth-split-panel">
        {/* Mountain bg */}
        <div className="split-panel-mountains">
          <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg"
               preserveAspectRatio="none" style={{ width: '100%', display: 'block' }}>
            <path d="M0,400 L0,240 L100,155 L200,200 L300,120 L400,175 L500,95 L600,155 L700,115 L700,400 Z"
                  fill="rgba(87,112,122,0.12)" />
            <path d="M0,400 L0,300 L175,210 L350,270 L525,200 L700,255 L700,400 Z"
                  fill="rgba(87,112,122,0.20)" />
            <path d="M0,400 L0,360 L350,305 L700,345 L700,400 Z"
                  fill="rgba(14,20,28,0.6)" />
          </svg>
        </div>

        {/* Content */}
        <div className="split-panel-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--c-500), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontWeight: 700, color: '#fff',
              boxShadow: '0 6px 24px rgba(133,79,108,0.35)',
              margin: '0 auto 1.25rem',
            }}>S</div>
            <h2 className="split-panel-title">
              Rejoignez<br /><em>SecureAPI</em>
            </h2>
            <p className="split-panel-sub">
              Créez votre compte et accédez à une infrastructure
              d'authentification JWT robuste et sécurisée.
            </p>
          </div>

          <div className="split-panel-badges">
            {[
              { icon: '🔐', text: 'Chiffrement BCrypt' },
              { icon: '🛡️', text: 'Tokens JWT signés HS256' },
              { icon: '⚡', text: 'Stateless & scalable' },
            ].map(({ icon, text }) => (
              <span className="split-badge" key={text}>
                <span className="split-badge-icon">{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form side ─────────────────────────────── */}
      <div className="auth-side">
        <div className="auth-card auth-card-wide">
          <Link to="/" className="auth-back">← Accueil</Link>

          <div className="auth-logo">
            <div className="auth-logo-mark">S</div>
            <span className="auth-logo-text">SecureAPI</span>
          </div>

          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-sub">Remplissez les informations ci-dessous</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">Prénom</label>
                <input id="firstName" className="form-input" placeholder="Fatima" {...f('firstName')} />
                {errors.firstName && <p className="form-error">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Nom</label>
                <input id="lastName" className="form-input" placeholder="Alaoui" {...f('lastName')} />
                {errors.lastName && <p className="form-error">{errors.lastName}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Nom d'utilisateur</label>
              <input id="reg-username" className="form-input" placeholder="fatima.alaoui" {...f('username')} />
              {errors.username && <p className="form-error">{errors.username}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Adresse email</label>
              <input id="reg-email" className="form-input" type="email" placeholder="fatima@mail.ma" {...f('email')} />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Mot de passe</label>
              <input
                id="reg-password"
                className="form-input"
                type="password"
                placeholder="Min. 8 car. · majuscule · chiffre"
                {...f('password')}
              />
              {errors.password
                ? <p className="form-error">{errors.password}</p>
                : <p className="form-hint">Haché avec BCrypt (facteur 12) côté serveur</p>
              }
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: '.4rem' }}
            >
              {loading ? 'Création en cours…' : 'Créer mon compte'}
            </button>
          </form>

          <div className="auth-footer">
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </div>
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
