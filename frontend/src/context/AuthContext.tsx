import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User | null) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token) {
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.error('Failed to parse saved user', e);
          }
        }
        // Always try to fetch fresh profile if we have a token
        await fetchProfile();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      const userData = response.data.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      // If profile fetch fails, the token might be invalid
      if ((err as any).response?.status === 401) {
        logout();
      }
    }
  };

  const login = (token: string, userData: User | null) => {
    localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      fetchProfile();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
