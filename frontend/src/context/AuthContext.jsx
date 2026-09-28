// ─────────────────────────────────────────────────────────────
// src/context/AuthContext.jsx — Global authentication state
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useCallback } from 'react';
import { saveAuth, clearAuth, getToken, getUser } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken);
  const [user, setUser] = useState(getUser);

  const login = useCallback((newToken, newUser) => {
    saveAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
