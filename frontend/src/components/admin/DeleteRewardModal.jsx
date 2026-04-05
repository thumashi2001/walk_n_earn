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
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-reward-title"
            className="relative w-full max-w-md rounded-3xl bg-[#fffefb] p-6 shadow-2xl shadow-stone-400/30 ring-1 ring-stone-200/90"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
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
              <p className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 ring-1 ring-red-100">
                {error}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 disabled:opacity-60"
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
