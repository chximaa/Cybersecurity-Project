import { useState, useEffect } from 'react';
import api from '../api/axios';
import Toast from '../components/Toast';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    api.get('/api/user/profile')
      .then(({ data }) => setProfile(data))
      .catch(() => setToast({ type: 'error', message: 'Impossible de charger le profil' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p className="loading">Chargement du profil…</p></div>;

  const initials = profile
    ? `${profile.firstName?.charAt(0) ?? ''}${profile.lastName?.charAt(0) ?? ''}`
    : '?';

  return (
    <div className="page">
      <div className="container-sm">

        <div className="page-header">
          <p className="page-eyebrow">Compte utilisateur</p>
          <h1 className="page-title">Mon Profil</h1>
          <p className="page-sub">Données récupérées via GET /api/user/profile</p>
        </div>

        {/* Profile card */}
        <div className="glass-card" style={{ marginBottom: '1.25rem' }}>
          <div className="profile-hero">
            <div className="profile-avatar">{initials}</div>
            <div>
              <h2 className="profile-name">{profile.firstName} {profile.lastName}</h2>
              <p className="profile-email">{profile.email}</p>
              <div className="profile-tags">
                {profile.roles?.map(role => (
                  <span key={role} className={`badge ${role.includes('ADMIN') ? 'admin' : 'user'}`}>
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
                <span className={`badge ${profile.enabled ? 'active' : 'inactive'}`}>
                  {profile.enabled ? '● Actif' : '● Inactif'}
                </span>
              </div>
            </div>
          </div>

          <div className="section-label">Informations du compte</div>
          <div className="info-grid" style={{ marginBottom: '1.5rem' }}>
            {[
              { label: 'ID',               value: `#${profile.id}` },
              { label: "Nom d'utilisateur", value: profile.username },
              { label: 'Prénom',           value: profile.firstName },
              { label: 'Nom de famille',   value: profile.lastName },
              { label: 'Email',            value: profile.email },
              { label: 'Statut',           value: profile.enabled ? 'Actif' : 'Désactivé' },
            ].map(({ label, value }) => (
              <div key={label} className="info-item">
                <p className="info-label">{label}</p>
                <p className="info-value">{value ?? '—'}</p>
              </div>
            ))}
          </div>

          <div className="section-label">Métadonnées</div>
          <div className="info-grid">
            <div className="info-item">
              <p className="info-label">Inscription</p>
              <p className="info-value">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString('fr-MA', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div className="info-item">
              <p className="info-label">Rôles</p>
              <p className="info-value">{profile.roles?.join(', ') ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* HTTP response preview */}
        <div className="glass-card">
          <div className="section-label">Réponse HTTP — /api/user/profile</div>
          <div className="code-block full">
            <span style={{ color: 'var(--text-muted)' }}>HTTP/1.1 </span>
            <span style={{ color: '#8fbda0' }}>200 OK</span>
            <br />
            <span style={{ color: 'var(--text-muted)' }}>Content-Type: </span>
            <span>application/json</span>
            <br /><br />
            {JSON.stringify(profile, null, 2).split('\n').map((line, i) => (
              <div key={i}>
                <span style={{ color: line.includes(':') ? 'var(--c-400)' : 'var(--c-300)' }}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}
