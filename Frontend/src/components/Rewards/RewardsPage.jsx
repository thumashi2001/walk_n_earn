import { useState } from "react";
import { useReward } from "../../context/RewardContext";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../shared/LoadingSpinner";
import Toast from "../shared/Toast";

/* ────────────────────────────────────────────────────────────
   RewardCard
──────────────────────────────────────────────────────────── */
function RewardCard({ reward, onRedeem, redeemingId, alreadyRedeemed }) {
  const { user } = useAuth();
  const isRedeeming = redeemingId === reward._id;
  const outOfStock = reward.quantity <= 0;
  const canAfford = (user?.totalPoints ?? 0) >= reward.pointsRequired;
  const shortfall = reward.pointsRequired - (user?.totalPoints ?? 0);

  let buttonLabel = "Redeem Now";
  let buttonDisabled = false;
  let buttonClass =
    "w-full py-2.5 rounded-xl font-semibold text-sm transition-all ";

  if (alreadyRedeemed) {
    buttonLabel = "✓ Already Redeemed";
    buttonDisabled = true;
    buttonClass += "bg-gray-100 text-gray-400 cursor-not-allowed";
  } else if (outOfStock) {
    buttonLabel = "Out of Stock";
    buttonDisabled = true;
    buttonClass += "bg-gray-100 text-gray-400 cursor-not-allowed";
  } else if (!canAfford) {
    buttonLabel = `Need ${shortfall} more points`;
    buttonDisabled = true;
    buttonClass += "bg-red-50 text-red-400 cursor-not-allowed";
  } else if (isRedeeming) {
    buttonLabel = "Redeeming…";
    buttonDisabled = true;
    buttonClass += "bg-green-300 text-white cursor-wait";
  } else {
    buttonClass += "bg-green-500 hover:bg-green-600 active:scale-95 text-white cursor-pointer";
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {/* Card body */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-800 text-base leading-tight">{reward.title}</h3>
          {outOfStock ? (
            <span className="flex-shrink-0 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
              Out of stock
            </span>
          ) : reward.quantity <= 5 ? (
            <span className="flex-shrink-0 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
              Only {reward.quantity} left
            </span>
          ) : null}
        </div>
        {reward.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{reward.description}</p>
        )}
        <div className="flex items-center gap-1.5 text-green-600 font-bold">
          <span className="text-yellow-500">⭐</span>
          <span>{reward.pointsRequired.toLocaleString()} points</span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button disabled={buttonDisabled} onClick={() => onRedeem(reward._id)} className={buttonClass}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Confirm Modal
──────────────────────────────────────────────────────────── */
function ConfirmModal({ reward, onConfirm, onCancel }) {
  const { user } = useAuth();
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm Redemption</h3>
        <p className="text-sm text-gray-500 mb-4">
          Redeem{" "}
          <span className="font-semibold text-gray-700">"{reward.title}"</span> for{" "}
          <span className="font-semibold text-green-600">
            {reward.pointsRequired} points
          </span>
          ?
          <br />
          Your balance will drop to{" "}
          <span className="font-semibold">
            {(user?.totalPoints ?? 0) - reward.pointsRequired} pts
          </span>
          . A voucher will be emailed to{" "}
          <span className="font-semibold">{user?.email}</span>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
          >
            Confirm &amp; Redeem
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   RewardsPage
──────────────────────────────────────────────────────────── */
export default function RewardsPage() {
  const { rewards, redemptions, loading, redeemingId, error, successMessage, redeem, clearMessages } =
    useReward();
  const { user } = useAuth();
  const [pendingReward, setPendingReward] = useState(null);

  const redeemedIds = new Set(
    redemptions.map((r) => (r.rewardId?._id ?? r.rewardId)?.toString())
  );

  const handleRedeemClick = (rewardId) => {
    const found = rewards.find((r) => r._id === rewardId);
    if (found) setPendingReward(found);
  };

  const handleConfirm = async () => {
    if (!pendingReward) return;
    const id = pendingReward._id;
    setPendingReward(null);
    await redeem(id);
  };

  if (loading) return <LoadingSpinner label="Loading rewards…" />;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Notifications */}
      {(error || successMessage) && (
        <Toast
          type={error ? "error" : "success"}
          message={error || successMessage}
          onClose={clearMessages}
        />
      )}

      {/* Confirm modal */}
      {pendingReward && (
        <ConfirmModal
          reward={pendingReward}
          onConfirm={handleConfirm}
          onCancel={() => setPendingReward(null)}
        />
      )}

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🎁 Rewards Store</h1>
        <p className="text-sm text-gray-500 mt-1">
          You have{" "}
          <span className="font-semibold text-green-600">
            {(user?.totalPoints ?? 0).toLocaleString()} points
          </span>{" "}
          available to spend.
        </p>
      </div>

      {/* Reward cards */}
      {rewards.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎁</p>
          <p className="font-medium">No rewards available right now.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((reward) => (
            <RewardCard
              key={reward._id}
              reward={reward}
              onRedeem={handleRedeemClick}
              redeemingId={redeemingId}
              alreadyRedeemed={redeemedIds.has(reward._id?.toString())}
            />
          ))}
        </div>
      )}

      {/* Redemption history */}
      {redemptions.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Redemption History</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Reward
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase">
                    Points Used
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase">
                    Voucher Code
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {redemptions.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {r.rewardId?.title ?? "Reward"}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{r.pointsUsed}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded text-xs tracking-wide">
                        {r.voucherCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400 text-xs hidden sm:table-cell">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
