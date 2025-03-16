import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }
};

// Check and set token only in the browser
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);
}
