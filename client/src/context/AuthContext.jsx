import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user safely on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Corrupted user data. Clearing storage.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOGIN
  const login = async (formData) => {
    try {
      const { data } = await API.post("/auth/login", formData);

      // Save token
      localStorage.setItem("token", data.token);

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        hasVoted: data.hasVoted,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Try again.",
      };
    }
  };

  // ✅ REGISTER
  const register = async (formData) => {
    try {
      await API.post("/auth/register", formData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Registration failed.",
      };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}