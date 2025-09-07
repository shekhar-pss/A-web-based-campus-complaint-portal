import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save token in localStorage
  const saveToken = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Register
  const register = async (formData) => {
    const { data } = await axios.post(`${API_URL}/auth/register`, formData);
    saveToken(data.token);
    setUser(data);
  };

  // Login
  const login = async (formData) => {
    const { data } = await axios.post(`${API_URL}/auth/login`, formData);
    saveToken(data.token);
    setUser(data);
  };

  // Get Profile
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/profile`);
      setUser(data);
    } catch (error) {
      console.error("Profile fetch failed:", error.response?.data?.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // On mount: check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
