import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

function redirectToLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  const path = window.location.pathname || "";
  if (!path.endsWith("/login")) {
    window.location.assign("/login");
  }
}

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data?.message;
    const noToken =
      status === 400 &&
      typeof msg === "string" &&
      msg.toLowerCase().includes("no token");

    if (status === 401 || noToken) {
      redirectToLogin();
    }

    return Promise.reject(err);
  }
);

export async function getCurrentUser() {
  function normalizeUser(raw) {
    if (!raw) return null;
    return {
      ...raw,
      totalDistance: raw.totalDistance ?? raw.totalDistanceKm ?? 0,
      totalCO2Saved: raw.totalCO2Saved ?? raw.totalCo2SavedKg ?? 0,
    };
  }

  function tryGetUserIdFromToken() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "";
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      return payload?.id || payload?._id || payload?.userId || payload?.sub || "";
    } catch {
      return "";
    }
  }

  try {
    const { data } = await API.get("/users/me");
    return normalizeUser(data?.user ?? data ?? null);
  } catch (err) {
    if (err?.response?.status !== 404) throw err;
    const userId = tryGetUserIdFromToken();
    if (!userId) throw err;
    const { data } = await API.get(`/users/${userId}`);
    return normalizeUser(data?.user ?? data ?? null);
  }
}

export default API;