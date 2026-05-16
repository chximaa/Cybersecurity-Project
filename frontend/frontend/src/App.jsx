import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing       from './pages/Landing';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Dashboard     from './pages/Dashboard';
import Profile       from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AccessDenied  from './pages/AccessDenied';

// Routes where the top Navbar should not render (they have their own headers)
const NO_NAV = ['/', '/login', '/register'];

function Layout() {
  const location = useLocation();
  const showNav = !NO_NAV.includes(location.pathname);

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — any authenticated user */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Protected — ROLE_ADMIN only */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>
        } />

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
