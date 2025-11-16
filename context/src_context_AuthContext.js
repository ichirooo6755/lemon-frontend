import React, { createContext, useContext, useState } from 'react';
import { apiAuth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const isAuthenticated = !!token;

  const login = async (email, password) => {
    const res = await apiAuth.login(email, password);
    const accessToken = res.token || res.access_token;
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    if (res.user) setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    await apiAuth.register(name, email, password);
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
