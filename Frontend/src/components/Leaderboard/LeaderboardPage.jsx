import { useState } from "react";
import { useLeaderboard } from "../../context/LeaderboardContext";
import { useAuth } from "../../context/AuthContext";
import { notifyTop5 } from "../../api/leaderboardApi";
import LoadingSpinner from "../shared/LoadingSpinner";
import Toast from "../shared/Toast";

const MEDALS = ["🥇", "🥈", "🥉"];

function RankBadge({ rank }) {
  if (rank <= 3) return <span className="text-xl">{MEDALS[rank - 1]}</span>;
  return <span className="text-base font-semibold text-gray-500">#{rank}</span>;
}

function StatCard({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-green-600">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function LeaderboardPage() {
  const { top10, userRank, loading, error, refresh } = useLeaderboard();
  const { user } = useAuth();
  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState(null);

  const handleNotifyTop5 = async () => {
    if (!window.confirm("Send congratulatory emails to this week's Top 5 walkers?")) return;
    setNotifying(true);
    setNotifyResult(null);
    try {
      const { data } = await notifyTop5();
      setNotifyResult({ type: "success", message: data.message });
    } catch (err) {
      setNotifyResult({
        type: "error",
        message: err.response?.data?.message || "Failed to send notifications.",
      });
    } finally {
      setNotifying(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading leaderboard…" />;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🏆 Weekly Leaderboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Top walkers this week (Mon – Sun)</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Admin: Notify Top 5 Button */}
      {user?.role === "admin" && (
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={handleNotifyTop5}
            disabled={notifying}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            {notifying ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>📧 Notify Top 5 Walkers</>
            )}
          </button>
          {notifyResult && (
            <span
              className={`text-sm font-medium ${
                notifyResult.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {notifyResult.message}
            </span>
          )}
        </div>
      )}

      {/* Error toast */}
      {error && <Toast type="error" message={error} onClose={() => {}} />}

      {/* Your rank card */}
      {userRank ? (
        <div className="mb-6 p-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white shadow-md">
          <p className="text-sm font-medium opacity-80 mb-3">Your rank this week</p>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-extrabold">#{userRank.rank}</p>
              <p className="text-xs opacity-75 mt-0.5">Rank</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userRank.weekly_points}</p>
              <p className="text-xs opacity-75 mt-0.5">Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userRank.weekly_distance?.toFixed(1)} km</p>
              <p className="text-xs opacity-75 mt-0.5">Distance</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userRank.weekly_emission?.toFixed(2)} kg</p>
              <p className="text-xs opacity-75 mt-0.5">CO₂ Saved</p>
            </div>
          </div>
        </div>
      ) : (
        user && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
            You haven't logged any walks this week yet. Start walking to appear on the leaderboard!
          </div>
        )
      )}

      {/* Leaderboard table */}
      {top10.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🚶</p>
          <p className="font-medium">No data for this week yet.</p>
          <p className="text-sm mt-1">Come back after someone starts walking!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Rank
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Walker
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Points
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  Distance
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  CO₂ Saved
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {top10.map((entry, idx) => {
                const isMe = user?._id === entry.userId?.toString();
                return (
                  <tr
                    key={entry._id || idx}
                    className={`transition-colors ${
                      isMe ? "bg-green-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-4 px-4 w-16">
                      <RankBadge rank={idx + 1} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                          {(entry.name || "U")[0].toUpperCase()}
                        </div>
                        <span className={`font-medium ${isMe ? "text-green-700" : "text-gray-800"}`}>
                          {entry.name || "Anonymous"}
                          {isMe && (
                            <span className="ml-2 text-xs font-normal text-green-400">(You)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-800">
                      {entry.weekly_points.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-500 hidden sm:table-cell">
                      {entry.weekly_distance?.toFixed(2)} km
                    </td>
                    <td className="py-4 px-4 text-right text-gray-500 hidden md:table-cell">
                      {entry.weekly_emission?.toFixed(3)} kg
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
