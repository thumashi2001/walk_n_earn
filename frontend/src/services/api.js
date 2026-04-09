import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://localhost:5050/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.log("[API request]", req.method?.toUpperCase(), req.baseURL + req.url, {
      hasToken: Boolean(token),
    });
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
  (res) => {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.log("[API response]", res.config?.url, res.status, res.data);
    }
    return res;
  },
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

export function getFriendlyApiError(
  err,
  { fallback = "Something went wrong. Please try again." } = {}
) {
  const status = err?.response?.status;
  if (status === 401 || status === 403) return "Unauthorized access.";
  if (status >= 500) return "Server error. Please try again later.";
  const msg = err?.response?.data?.message;
  if (typeof msg === "string" && msg.trim()) return msg;
  return fallback;
}

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