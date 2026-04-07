import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import FormAlert from "./auth/FormAlert";
import { redeemReward, getRedeemErrorMessage } from "../services/rewards";
import { getRewardImageUrl } from "../utils/rewardImages";

const SUCCESS_COPY =
  "Reward redeemed successfully 🎉 Check your email for the voucher";

function RewardImage({ src, title }) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#fffefb] via-[#FFA500]/14 to-[#FF7518]/12">
      {showImg ? (
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#FF5F1F]/30"
          aria-hidden
        >
          <svg
            className="h-14 w-14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008H12V8.25z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function RewardCard({ reward, onRedeemed }) {
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const submitLock = useRef(false);

  const imageUrl = useMemo(() => getRewardImageUrl(reward), [reward]);

  const quantity =
    typeof reward.quantity === "number" ? reward.quantity : null;
  const inStock = quantity === null || quantity > 0;

  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => setSuccess(false), 6000);
    return () => window.clearTimeout(t);
  }, [success]);

  async function handleRedeem() {
    if (submitLock.current || redeeming || !inStock) return;
    submitLock.current = true;
    setError("");
    setSuccess(false);
    setRedeeming(true);
    try {
      await redeemReward(reward._id);
      setSuccess(true);
      onRedeemed?.();
    } catch (err) {
      const message = getRedeemErrorMessage(err);
      if (message) setError(message);
    } finally {
      setRedeeming(false);
      submitLock.current = false;
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -8,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-b from-white/98 to-[#FFA500]/10 shadow-lg shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/20 backdrop-blur-sm transition-shadow duration-500 ease-out hover:shadow-2xl hover:shadow-[#FF5F1F]/20"
    >
      <div className="relative">
        <RewardImage src={imageUrl} title={reward.title} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/20 via-stone-900/5 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col bg-gradient-to-b from-white/95 via-white to-[#FFA500]/8 px-5 pb-5 pt-4">
        <h2 className="text-xl font-semibold leading-snug tracking-tight text-stone-900">
          {reward.title}
        </h2>

        {reward.description?.trim() ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
            {reward.description.trim()}
          </p>
        ) : (
          <p className="mt-2 text-sm italic leading-relaxed text-stone-400">
            Redeem this reward with your walking points.
          </p>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#FFA500]/18 to-[#FF7518]/12 px-3 py-3 shadow-sm shadow-[#FF7518]/10 ring-1 ring-[#FFA500]/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
            <dt className="text-xs font-medium uppercase tracking-wide text-[#a33a00]/75">
              Points
            </dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-[#7a2b00]">
              {reward.pointsRequired}
            </dd>
          </div>
          <div className="rounded-2xl border border-stone-100/80 bg-gradient-to-br from-white to-stone-50/50 px-3 py-3 shadow-sm shadow-stone-300/15 ring-1 ring-stone-200/60 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
            <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Available
            </dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-stone-900">
              {quantity === null ? "—" : quantity}
            </dd>
            {quantity !== null && quantity === 0 && (
              <p className="mt-1 text-[11px] font-medium text-red-700">
                Out of stock
              </p>
            )}
          </div>
        </dl>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3"
          >
            <FormAlert variant="success" role="status">
              {SUCCESS_COPY}
            </FormAlert>
          </motion.div>
        )}

        {error && (
          <div className="mt-3">
            <FormAlert variant="error">{error}</FormAlert>
          </div>
        )}

        <div className="mt-auto pt-5">
          <motion.button
            type="button"
            layout
            whileHover={{
              scale: inStock && !redeeming ? 1.02 : 1,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
            whileTap={{
              scale: inStock && !redeeming ? 0.97 : 1,
              transition: { duration: 0.15 },
            }}
            disabled={!inStock || redeeming}
            onClick={handleRedeem}
            aria-busy={redeeming}
            className="w-full rounded-2xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF7518]/30 transition-all duration-300 ease-out hover:from-[#FF7518] hover:via-[#FF5F1F] hover:to-[#FF5F1F] hover:shadow-xl hover:shadow-[#FF5F1F]/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {redeeming ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden
                />
                Redeeming...
              </span>
            ) : (
              "Redeem"
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
