import { useState, useEffect } from 'react';
import api from '../api/axios';
import Toast from '../components/Toast';

export default function AdminDashboard() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search,   setSearch]   = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/api/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(() => setToast({ type: 'error', message: 'Erreur de chargement des utilisateurs' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Supprimer "${username}" ?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setToast({ type: 'success', message: `Utilisateur "${username}" supprimé` });
    } catch {
      setToast({ type: 'error', message: 'Impossible de supprimer cet utilisateur' });
    } finally { setDeleting(null); }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount  = users.filter(u => u.roles?.includes('ROLE_ADMIN')).length;
  const activeCount = users.filter(u => u.enabled).length;

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <p className="page-eyebrow">Accès restreint · ROLE_ADMIN</p>
          <h1 className="page-title">Administration</h1>
          <p className="page-sub">Gestion complète des utilisateurs et des accès</p>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card teal">
            <p className="stat-label">Total utilisateurs</p>
            <p className="stat-value teal">{users.length}</p>
          </div>
          <div className="stat-card slate">
            <p className="stat-label">Comptes actifs</p>
            <p className="stat-value slate">{activeCount}</p>
          </div>
          <div className="stat-card rose">
            <p className="stat-label">Administrateurs</p>
            <p className="stat-value rose">{adminCount}</p>
          </div>
          <div className="stat-card mauve">
            <p className="stat-label">Inactifs</p>
            <p className="stat-value mauve">{users.length - activeCount}</p>
          </div>
        </div>

        {/* Table Card */}
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="section-label" style={{ margin: 0 }}>
              Utilisateurs ({filtered.length})
            </div>
            <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
              <input
                className="search-input"
                placeholder="Rechercher…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="btn-icon-sm btn" onClick={fetchUsers}>
                ↻ Actualiser
              </button>
            </div>
          </div>

          {loading ? (
            <p className="loading">Chargement des utilisateurs…</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Prénom / Nom</th>
                    <th>Rôles</th>
                    <th>Statut</th>
                    <th>Inscrit le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  ) : filtered.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '.28rem', flexWrap: 'wrap' }}>
                          {user.roles?.map(r => (
                            <span key={r} className={`badge ${r.includes('ADMIN') ? 'admin' : 'user'}`}>
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${user.enabled ? 'active' : 'inactive'}`}>
                          {user.enabled ? '● Actif' : '● Inactif'}
                        </span>
                      </td>
                      <td style={{ fontSize: '.76rem' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-MA') : '—'}
                      </td>
                      <td>
                        <button
                          className="btn-danger-soft btn"
                          onClick={() => handleDelete(user.id, user.username)}
                          disabled={deleting === user.id || user.roles?.includes('ROLE_ADMIN')}
                          title={user.roles?.includes('ROLE_ADMIN') ? 'Impossible de supprimer un admin' : ''}
                        >
                          {deleting === user.id ? '…' : '✕ Supprimer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Endpoints */}
        <div className="glass-card">
          <div className="section-label">Endpoints utilisés</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            {[
              { method: 'GET',    cls: 'get',    path: '/api/admin/users',      desc: 'Lister tous les utilisateurs' },
              { method: 'DELETE', cls: 'delete', path: '/api/admin/users/{id}', desc: 'Supprimer un utilisateur' },
            ].map(({ method, cls, path, desc }) => (
              <div key={path} className="endpoint-chip">
                <div>
                  <span className={`method ${cls}`}>{method}</span>
                  <span className="path-text">{path}</span>
                </div>
                <p className="endpoint-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}
