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
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="rounded-3xl bg-white/90 px-6 py-10 text-center shadow-lg shadow-stone-200/70 ring-1 ring-stone-100 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">
          Rewards
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Collect your rewards
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-stone-600 sm:text-base">
          Redeem your walking points for vouchers and perks from partner stores.
        </p>
      </header>

      <section className="rounded-3xl bg-gradient-to-b from-white/95 to-amber-50/30 p-6 shadow-lg shadow-stone-200/60 ring-1 ring-stone-100 sm:p-8">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-amber-200 border-t-amber-700" />
            <p className="text-sm font-medium text-stone-600">
              Loading rewards…
            </p>
          </div>
        )}

        {!loading && fetchError && (
          <div className="rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-4 text-center text-sm text-red-800 ring-1 ring-red-100">
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && rewards.length === 0 && (
          <p className="py-16 text-center text-sm text-stone-600">
            No rewards available yet. Check back soon.
          </p>
        )}

        {!loading && !fetchError && rewards.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
