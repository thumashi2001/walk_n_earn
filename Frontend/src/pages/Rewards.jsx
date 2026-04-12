import { useCallback, useEffect, useState } from "react";
import RewardCard from "../components/RewardCard";
import API from "../services/api";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchRewards = useCallback(async () => {
    setFetchError("");
    try {
      const res = await API.get("/rewards");
      const list = Array.isArray(res.data) ? res.data : [];
      setRewards(list.filter((r) => r.isActive !== false));
    } catch (err) {
      console.error("Error fetching rewards", err);
      setFetchError(
        err.response?.data?.message ||
          "Could not load rewards. Check the server and try again."
      );
      setRewards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
      <header className="rounded-3xl border border-white/60 bg-gradient-to-b from-white/95 via-white/90 to-[#FFA500]/12 px-5 py-8 text-center shadow-xl shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/20 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-[#FF5F1F]/20 sm:px-10 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5F1F]">
          Rewards
        </p>
        <h1 className="mt-3 bg-gradient-to-r from-[#5f2100] via-[#FF7518] to-[#FF5F1F] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Collect your rewards
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
          Redeem your walking points for vouchers and perks from partner stores.
        </p>
      </header>

      <section className="rounded-3xl border border-stone-200/40 bg-gradient-to-b from-white/95 to-[#FFA500]/12 p-5 shadow-xl shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/15 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl sm:p-8">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#FFA500]/30 border-t-[#FF5F1F]" />
            <p className="text-sm font-medium text-stone-600">
              Loading rewards…
            </p>
          </div>
        )}

        {!loading && fetchError && (
          <div className="rounded-2xl border border-red-200/80 bg-gradient-to-b from-red-50/95 to-red-50/70 px-4 py-4 text-center text-sm text-red-800 shadow-md shadow-red-900/5 ring-1 ring-red-100">
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && rewards.length === 0 && (
          <p className="py-16 text-center text-sm text-stone-600">
            No rewards available yet. Check back soon.
          </p>
        )}

        {!loading && !fetchError && rewards.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {rewards.map((reward) => (
              <RewardCard
                key={reward._id}
                reward={reward}
                onRedeemed={fetchRewards}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
