import axios from "axios";

const publicApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const privateApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Public endpoints
export const registerUser = (userData) =>
  publicApi.post("/users/register", userData);
export const loginUser = (credentials) =>
  publicApi.post("/users/login", credentials);

export const addStock = (payload) => privateApi.post("/stocks", payload);
export const sellStock = (payload) => privateApi.put("/stocks/sell", payload);

// Protected endpoints
export const fetchStocks = () => privateApi.get("/stocks");
export const fetchRealTimeStocks = (query) =>
  privateApi.get(`/stocks/realtime?ticker=${query}`);
export const searchStock = (query) =>
  privateApi.get(`/stocks/search?keyword=${query}`);

export default privateApi;
