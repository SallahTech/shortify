"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import * as auth from "./auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; sub: string } | null;
  setAuthState: (
    isAuthenticated: boolean,
    user: { email: string; sub: string } | null
  ) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setAuthState: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; sub: string } | null>(null);

  useEffect(() => {
    const token = auth.getToken();
    setIsAuthenticated(!!token);
    if (token) {
      setUser(auth.getUser());
    }
  }, []);

  const setAuthState = (
    isAuth: boolean,
    userData: { email: string; sub: string } | null
  ) => {
    setIsAuthenticated(isAuth);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
