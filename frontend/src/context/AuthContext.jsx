import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY_LOGGED = 'hz_logged_in';
const SESSION_KEY_ROLE   = 'hz_user_role';

export const AuthProvider = ({ children }) => {
  // Restore session from sessionStorage on mount
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY_LOGGED) === 'true'; }
    catch { return false; }
  });

  const [userRole, setUserRole] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY_ROLE) || null; }
    catch { return null; }
  });

  // Persist to sessionStorage whenever auth state changes
  useEffect(() => {
    try {
      if (isLoggedIn) {
        sessionStorage.setItem(SESSION_KEY_LOGGED, 'true');
      } else {
        sessionStorage.removeItem(SESSION_KEY_LOGGED);
      }
    } catch { /* private browsing — silently ignore */ }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      if (userRole) {
        sessionStorage.setItem(SESSION_KEY_ROLE, userRole);
      } else {
        sessionStorage.removeItem(SESSION_KEY_ROLE);
      }
    } catch { /* private browsing — silently ignore */ }
  }, [userRole]);

  /** Clears all auth state and sessionStorage, redirecting handled by route guard */
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    try {
      sessionStorage.removeItem(SESSION_KEY_LOGGED);
      sessionStorage.removeItem(SESSION_KEY_ROLE);
    } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
