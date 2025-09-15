'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session token in localStorage
    const token = localStorage.getItem('sessionToken');
    if (token) {
      setSessionToken(token);
      // In a real app, you would validate the token with the server here
      // For now, we'll just set it
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    setSessionToken(token);
    localStorage.setItem('sessionToken', token);
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('sessionToken');
  };

  const isAuthenticated = !!sessionToken;

  return (
    <AuthContext.Provider value={{
      user,
      sessionToken,
      login,
      logout,
      isAuthenticated,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}