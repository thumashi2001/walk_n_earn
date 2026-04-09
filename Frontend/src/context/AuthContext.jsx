import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authError, setAuthError] = useState(null);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const { data } = await api.post("/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || "Login failed. Please try again.");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // Call after a successful redemption so the points badge in the Navbar updates.
  const refreshUser = useCallback((updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, authError, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
