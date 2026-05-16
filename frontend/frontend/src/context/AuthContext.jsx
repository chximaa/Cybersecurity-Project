import { createContext, useContext, useState, useCallback } from 'react';
import { clearSession, getUser, setSession } from '../utils/auth';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      // Prepare login data - try both formats
      const loginData = {
        usernameOrEmail: credentials.username,  // First try with username
        password: credentials.password
      };
      
      const { data } = await api.post('/api/auth/login', loginData);
       console.log("LOGIN RESPONSE:", data);
       const token = data.accessToken;

if (token) {
  setSession(data, user => ({
    username: data.username || credentials.username,
    email: data.email || credentials.email,
    roles: data.roles || ['ROLE_USER'],
  }));

  setUser({
    username: data.username || credentials.username,
    email: data.email || credentials.email,
    roles: data.roles || ['ROLE_USER']
  });

  return { success: true };
} else {
  return { success: false, message: 'No token received' };
}
    } catch (err) {
      console.error('Login error:', err.response?.data);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Identifiants incorrects';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      // Make sure we're sending the correct format
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || '',
        lastName: formData.lastName || ''
      };
      
      const { data } = await api.post('/api/auth/register', registerData);
      
      if (data && (data.message || data.success)) {
        return { success: true, message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' };
      }
      return { success: true, message: 'Inscription réussie !' };
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      
      // Handle validation errors
      const errData = err.response?.data;
      if (errData?.validationErrors) {
        // Format validation errors
        const errorMessages = Object.values(errData.validationErrors).join(', ');
        return { success: false, message: errorMessages };
      }
      
      // Handle other errors
      const errorMessage = errData?.message || errData?.error || 'Erreur lors de l\'inscription';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};