"use client";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "@/utils/api";
import { io } from "socket.io-client";

export const AuthContext = createContext();
const socket = io("http://localhost:5000", { transports: ["websocket"] });

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthToken(data.token);
      socket.emit("userOnline", data.user.id);
      router.push("/chat");
    } catch (error) {
      alert("Login failed");
    }
  };

  const register = async (credentials) => {
    try {
      const { data } = await api.post("/auth/register", credentials);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthToken(data.token);
      router.push("/login");
    } catch (error) {
      alert("Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setAuthToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
