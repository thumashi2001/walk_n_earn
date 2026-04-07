import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteRewardAdmin } from "../../services/rewards";
import { getAuthErrorMessage } from "../../services/auth";

export default function DeleteRewardModal({ open, reward, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open, reward]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleDelete() {
    if (!reward?._id) return;
    setError("");
    setDeleting(true);
    try {
      await deleteRewardAdmin(reward._id);
      onDeleted?.();
      onClose();
    } catch (err) {
      setError(
        getAuthErrorMessage(err, {
          actionFallback: "Could not delete reward.",
        })
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && reward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-gradient-to-b from-stone-900/45 to-stone-900/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-reward-title"
            className="relative w-full max-w-md rounded-3xl border border-white/80 bg-gradient-to-b from-[#fffefb] to-[#FFA500]/10 p-6 shadow-[0_25px_60px_-15px_rgba(28,25,23,0.25)] ring-1 ring-stone-200/70"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              id="delete-reward-title"
              className="text-lg font-semibold text-stone-900"
            >
              Delete reward?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              This will permanently remove{" "}
              <span className="font-semibold text-stone-800">
                {reward.title}
              </span>
              . This action cannot be undone.
            </p>
            {error && (
              <p className="mt-4 rounded-2xl border border-red-200/80 bg-gradient-to-b from-red-50/95 to-red-50/70 px-4 py-3 text-sm text-red-800 shadow-sm ring-1 ring-red-100">
                {error}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/50 px-5 py-2.5 text-sm font-semibold text-stone-700 shadow-md shadow-stone-300/20 transition-all duration-300 hover:-translate-y-px hover:bg-stone-50 hover:shadow-lg active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-2xl bg-gradient-to-b from-red-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/25 transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
