import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true on mount while we check localStorage

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted storage — clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Called after a successful login API response.
   * Saves token + user to state and localStorage.
   */
  const login = useCallback((tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem('authToken', tokenValue);
    localStorage.setItem('authUser', JSON.stringify(userData));
  }, []);

  /**
   * Clears all auth state and localStorage.
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }, []);

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for convenient access
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
