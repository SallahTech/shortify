import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3002";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export async function login(data: LoginData): Promise<AuthResponse> {
  console.log("Attempting login with:", data);
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Login response status:", response.status);
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Login error:", errorData);
    throw new Error("Login failed");
  }

  return response.json();
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return !!getToken();
}

export function getUser(): { email: string; sub: string } | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      email: payload.email,
      sub: payload.sub,
    };
  } catch (error) {
    return null;
  }
}

// Client-side authentication hook
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; sub: string } | null>(null);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    if (token) {
      setUser(getUser());
    }
  }, []);

  return { isAuthenticated, user };
}
