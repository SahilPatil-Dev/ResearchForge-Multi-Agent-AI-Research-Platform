import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "../lib/api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  register: (
    email: string,
    fullName: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(
    null
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadUser = async () => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser =
        await api.getMe();

      setUser(currentUser);
    } catch {
      localStorage.removeItem(
        "access_token"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const data =
      await api.login(
        email,
        password
      );

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    const currentUser =
      await api.getMe();

    setUser(currentUser);
  };

  const register = async (
    email: string,
    fullName: string,
    password: string
  ) => {
    await api.register({
      email,
      full_name: fullName,
      password,
    });
  };

  const logout = () => {
    localStorage.removeItem(
      "access_token"
    );

    setUser(null);
  };

  const refreshUser = async () => {
    const currentUser =
      await api.getMe();

    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated:
          Boolean(user),
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}