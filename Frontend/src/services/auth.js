import axios from "axios";

export const AUTH_TOKEN_KEY = "token";
export const AUTH_ROLE_KEY = "role";

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
