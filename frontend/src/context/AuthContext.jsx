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

  const [userData, setUserData] = useState(() => {
    try { 
      const saved = sessionStorage.getItem('hz_user_data');
      return saved ? JSON.parse(saved) : null;
    }
    catch { return null; }
  });

  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const saved = sessionStorage.getItem('hz_applied_jobs');
      return saved ? JSON.parse(saved) : [];
    }
    catch { return []; }
  });

  // Persist to sessionStorage whenever auth state changes
  useEffect(() => {
    try {
      if (isLoggedIn) {
        sessionStorage.setItem(SESSION_KEY_LOGGED, 'true');
      } else {
        sessionStorage.removeItem(SESSION_KEY_LOGGED);
        sessionStorage.removeItem('hz_user_data');
        sessionStorage.removeItem('hz_applied_jobs');
      }
    } catch { /* private browsing */ }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      if (userRole) {
        sessionStorage.setItem(SESSION_KEY_ROLE, userRole);
      } else {
        sessionStorage.removeItem(SESSION_KEY_ROLE);
      }
    } catch { /* private browsing */ }
  }, [userRole]);

  useEffect(() => {
    try {
      if (userData) {
        sessionStorage.setItem('hz_user_data', JSON.stringify(userData));
      }
    } catch { /* private browsing */ }
  }, [userData]);

  useEffect(() => {
    try {
      sessionStorage.setItem('hz_applied_jobs', JSON.stringify(appliedJobs));
    } catch { /* private browsing */ }
  }, [appliedJobs]);

  const applyToJob = (job) => {
    setAppliedJobs(prev => {
      if (prev.find(j => j.id === job.id)) return prev;
      return [...prev, { 
        ...job, 
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Under Review'
      }];
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
    setAppliedJobs([]);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, setIsLoggedIn, 
      userRole, setUserRole, 
      userData, setUserData, 
      appliedJobs, applyToJob,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
