import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchTop10, fetchUserRank } from "../api/leaderboardApi";
import { useAuth } from "./AuthContext";

const LeaderboardContext = createContext(null);

export function LeaderboardProvider({ children }) {
  const { user } = useAuth();
  const [top10, setTop10] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchTop10();
      setTop10(data);

      if (user?._id) {
        try {
          const { data: rankData } = await fetchUserRank(user._id);
          setUserRank(rankData);
        } catch {
          // User may not have walked this week — not a fatal error
          setUserRank(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadLeaderboard();
  }, [user, loadLeaderboard]);

  return (
    <LeaderboardContext.Provider
      value={{ top10, userRank, loading, error, refresh: loadLeaderboard }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const ctx = useContext(LeaderboardContext);
  if (!ctx) throw new Error("useLeaderboard must be used inside <LeaderboardProvider>");
  return ctx;
}
