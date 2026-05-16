import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const active = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to={user ? '/dashboard' : '/'} className="nav-brand" style={{ textDecoration: 'none' }}>
        <div className="nav-brand-mark">S</div>
        <span className="nav-brand-name">SecureAPI</span>
        <span className="nav-brand-tag">JWT</span>
      </Link>

      {/* Center links */}
      <div className="nav-links">
        {user && (
          <>
            <Link to="/dashboard" className={`nav-link ${active('/dashboard')}`}>
              Tableau de bord
            </Link>
            <Link to="/profile" className={`nav-link ${active('/profile')}`}>
              Profil
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`nav-link nav-link-admin ${active('/admin')}`}>
                Administration
              </Link>
            )}
          </>
        )}
      </div>

      {/* Right */}
      <div className="nav-right">
        {user ? (
          <div className="nav-user">
            <div className="user-chip">
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.username}</span>
              <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="nav-auth-btns">
            <Link to="/login" className="btn-ghost btn"
                  style={{ padding: '.38rem .9rem', fontSize: '.82rem',
                           borderRadius: '6px', display: 'inline-block' }}>
              Connexion
            </Link>
            <Link to="/register" className="btn-accent btn"
                  style={{ padding: '.38rem 1rem', fontSize: '.82rem',
                           borderRadius: '6px', display: 'inline-block' }}>
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
