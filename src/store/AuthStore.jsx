import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'medcode_auth_token';
const USER_KEY = 'medcode_auth_user';

const AuthContext = createContext(null);

let currentToken = localStorage.getItem(TOKEN_KEY);
let onUnauthorized = null;

const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  const isApi = url.includes(API_BASE_URL) || url.startsWith('/api');

  if (isApi && currentToken) {
    const headers = new Headers(init.headers || {});
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }
    init = { ...init, headers };
  }

  const response = await originalFetch(input, init);

  if (isApi && response.status === 401) {
    if (onUnauthorized) onUnauthorized();
  }

  return response;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    currentToken = token;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    onUnauthorized = () => {
      setToken(null);
      setUser(null);
    };
    return () => { onUnauthorized = null; };
  }, []);

  const adminLogin = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await originalFetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return { success: false, error: data.error };
      }
      setToken(data.token);
      setUser(data.user);
      currentToken = data.token;
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ name, email, password, organization, designation }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await originalFetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, organization, designation })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return { success: false, error: data.error, code: data.code };
      }
      return { success: true, requiresVerification: !!data.requiresVerification, email: data.email };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await originalFetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return { success: false, error: data.error, code: data.code, email: data.email };
      }
      setToken(data.token);
      setUser(data.user);
      currentToken = data.token;
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    try {
      const res = await originalFetch(
        `${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`
      );
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      return { success: true, alreadyVerified: !!data.alreadyVerified, email: data.email };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    try {
      await originalFetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!currentToken) return;
    try {
      const res = await originalFetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
  }, []);

  const value = {
    token,
    user,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    adminLogin,
    signup,
    login,
    verifyEmail,
    resendVerification,
    logout,
    refreshUser,
    clearError: () => setError(null),
    apiBase: API_BASE_URL
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
