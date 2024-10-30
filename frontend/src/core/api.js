import axios from "axios";

export const ADDRESS = "localhost:8000";
const api = axios.create({
  baseURL: "http://" + ADDRESS,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
