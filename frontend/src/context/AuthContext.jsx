import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/api';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: 'stryper_token',
  user: 'stryper_user',
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    const user = localStorage.getItem(STORAGE_KEYS.user);

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setUserRole(parsedUser.role);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    }
    setLoading(false);
  }, []);

  const register = async (email, password, role, captchaToken) => {
    try {
      const response = await auth.register({ email, password, role, captchaToken });
      const { token, user } = response.data;

      // Auto-login: store token and user just like login does
      if (token && user) {
        localStorage.setItem(STORAGE_KEYS.token, token);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        setUserData(user);
        setUserRole(user.role);
        setIsLoggedIn(true);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Update userData in context + localStorage (used after profile fetch)
  const updateUserData = (updates) => {
    setUserData(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (email, password) => {
    try {
      const response = await auth.login({ email, password });
      const { token, user } = response.data;

      // Store token and user in localStorage
      localStorage.setItem(STORAGE_KEYS.token, token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));

      // Update auth state
      setUserData(user);
      setUserRole(user.role);
      setIsLoggedIn(true);

      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (e) {
      // Ignore errors on logout
    }

    // Clear localStorage and state
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
  };

  const getMe = async () => {
    try {
      const response = await auth.getMe();
      const user = response.data.user;
      setUserData(user);
      return user;
    } catch (error) {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        userData,
        loading,
        register,
        login,
        logout,
        getMe,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
