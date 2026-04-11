import axios from "axios";
import API from "./api";

/** @returns {Promise<any[]>} */
export async function fetchRewardsList() {
  const { data } = await API.get("/rewards");
  return Array.isArray(data) ? data : [];
}

/**
 * @param {Record<string, unknown>} payload
 */
export async function createRewardAdmin(payload) {
  const { data } = await API.post("/rewards", payload);
  return data;
}

/**
 * @param {string} id
 * @param {Record<string, unknown>} payload
 */
export async function updateRewardAdmin(id, payload) {
  const { data } = await API.put(`/rewards/${encodeURIComponent(String(id))}`, payload);
  return data;
}

/**
 * @param {string} id
 */
export async function deleteRewardAdmin(id) {
  const { data } = await API.delete(`/rewards/${id}`);
  return data;
}

/**
 * @param {string} rewardId
 */
export async function redeemReward(rewardId) {
  const { data } = await API.post("/rewards/redeem", { rewardId });
  return data;
}

/**
 * User-facing copy for redeem failures. Returns null when global handler (e.g. redirect) applies.
 * @param {unknown} err
 */
export function getRedeemErrorMessage(err) {
  if (!axios.isAxiosError(err) || !err.response) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  const { status, data } = err.response;
  const raw = typeof data?.message === "string" ? data.message : "";

  if (status === 401) {
    return null;
  }

  if (
    status === 400 &&
    typeof raw === "string" &&
    raw.toLowerCase().includes("no token")
  ) {
    return null;
  }

  const lower = raw.toLowerCase();

  if (lower.includes("not enough points")) {
    return "You don't have enough points for this reward yet. Keep walking!";
  }
  if (lower.includes("out of stock")) {
    return "This reward is out of stock right now. Check back later.";
  }
  if (lower.includes("only users can redeem")) {
    return "Only regular member accounts can redeem rewards.";
  }
  if (lower.includes("not found")) {
    return "This reward is no longer available.";
  }
  if (raw.trim()) {
    return raw;
  }

  return "We couldn't complete this redemption. Please try again.";
}
