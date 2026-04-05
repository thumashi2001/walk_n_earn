import axios from "axios";
import API from "./api";

export const AUTH_TOKEN_KEY = "token";
export const AUTH_ROLE_KEY = "role";

/**
 * @param {{ email: string; password: string }} credentials
 */
export async function login(credentials) {
  const { data } = await API.post("/login", credentials);
  return data;
}

/**
 * @param {{ fullName: string; email: string; password: string }} payload
 */
export async function register(payload) {
  const { data } = await API.post("/login/register", payload);
  return data;
}

export function persistSession({ token, role }) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (role) localStorage.setItem(AUTH_ROLE_KEY, role);
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
}

/**
 * @param {unknown} err
 * @param {{ actionFallback?: string }} [options]
 */
export function getAuthErrorMessage(
  err,
  { actionFallback = "Something went wrong. Please try again." } = {}
) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    const msg = data?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
    if (Array.isArray(msg)) return msg.filter(Boolean).join(", ");
    if (!err.response) {
      return "Unable to reach the server. Check that the backend is running and try again.";
    }
    return actionFallback;
  }
  return actionFallback;
}
