import api from "./axiosConfig";

export const fetchActiveRewards = () => api.get("/rewards/active");

export const redeemReward = (rewardId) =>
  api.post("/rewards/redeem", { rewardId });

export const fetchMyRedemptions = () => api.get("/rewards/my-redemptions");
