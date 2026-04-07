import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchActiveRewards, redeemReward as apiRedeem, fetchMyRedemptions } from "../api/rewardApi";
import { useAuth } from "./AuthContext";

const RewardContext = createContext(null);

export function RewardProvider({ children }) {
  const { user, refreshUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [redeemingId, setRedeemingId] = useState(null); // tracks which rewardId is in-flight
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const calls = [fetchActiveRewards()];
      if (user) calls.push(fetchMyRedemptions());

      const results = await Promise.all(calls);
      setRewards(results[0].data);
      if (results[1]) setRedemptions(results[1].data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load rewards.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const redeem = useCallback(
    async (rewardId) => {
      setRedeemingId(rewardId);
      setError(null);
      setSuccessMessage(null);
      try {
        const { data } = await apiRedeem(rewardId);
        setSuccessMessage("Reward redeemed! Check your email for the voucher code. 🎉");

        // Optimistically update the user's points shown in the Navbar
        const reward = rewards.find((r) => r._id === rewardId);
        if (reward && user) {
          refreshUser({ totalPoints: (user.totalPoints || 0) - reward.pointsRequired });
        }

        // Refresh rewards list and history from server
        await loadData();
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Redemption failed. Please try again.");
        return null;
      } finally {
        setRedeemingId(null);
      }
    },
    [rewards, user, refreshUser, loadData]
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <RewardContext.Provider
      value={{
        rewards,
        redemptions,
        loading,
        redeemingId,
        error,
        successMessage,
        redeem,
        refresh: loadData,
        clearMessages,
      }}
    >
      {children}
    </RewardContext.Provider>
  );
}

export function useReward() {
  const ctx = useContext(RewardContext);
  if (!ctx) throw new Error("useReward must be used inside <RewardProvider>");
  return ctx;
}
