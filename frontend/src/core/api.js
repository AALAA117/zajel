import axios from "axios";

export const ADDRESS = "http://localhost:8000";
const api = axios.create({
  baseURL: ADDRESS,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("authTokens")}`,
  },
});

export default api;
