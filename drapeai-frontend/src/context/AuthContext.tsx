import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfo, LoginRequest, RegisterRequest } from '../types/auth';
import { authApi } from '../services/api';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('drapeai_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('drapeai_token');
    const savedUser = localStorage.getItem('drapeai_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('drapeai_token');
        localStorage.removeItem('drapeai_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    const userInfo: UserInfo = { name: response.name, email: response.email };
    setToken(response.token);
    setUser(userInfo);
    localStorage.setItem('drapeai_token', response.token);
    localStorage.setItem('drapeai_user', JSON.stringify(userInfo));
  };

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    const userInfo: UserInfo = { name: response.name, email: response.email };
    setToken(response.token);
    setUser(userInfo);
    localStorage.setItem('drapeai_token', response.token);
    localStorage.setItem('drapeai_user', JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('drapeai_token');
    localStorage.removeItem('drapeai_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
