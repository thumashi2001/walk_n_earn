import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createRewardAdmin, updateRewardAdmin } from "../../services/rewards";
import { getAuthErrorMessage } from "../../services/auth";
import { authInputClassName, authLabelClassName } from "../auth/authFieldStyles";

const emptyForm = () => ({
  title: "",
  description: "",
  image: "",
  storeName: "",
  pointsRequired: "",
  quantity: "0",
  isActive: true,
});

function rewardToForm(reward) {
  if (!reward) return emptyForm();
  return {
    title: reward.title ?? "",
    description: reward.description ?? "",
    image: reward.image ?? "",
    storeName: reward.storeName ?? "",
    pointsRequired: String(reward.pointsRequired ?? ""),
    quantity: String(reward.quantity ?? 0),
    isActive: reward.isActive !== false,
  };
}

export default function RewardFormModal({ open, reward, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(reward?._id);

  useEffect(() => {
    if (open) {
      setForm(rewardToForm(reward));
      setError("");
    }
  }, [open, reward]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const points = Number(form.pointsRequired);
    const qty = Number(form.quantity);
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!Number.isFinite(points) || points < 0) {
      setError("Points required must be a valid number (0 or greater).");
      return;
    }
    if (!Number.isFinite(qty) || qty < 0) {
      setError("Quantity must be a valid number (0 or greater).");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      image: form.image.trim() || "",
      storeName: form.storeName.trim() || "",
      pointsRequired: points,
      quantity: qty,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateRewardAdmin(reward._id, payload);
      } else {
        await createRewardAdmin(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(
        getAuthErrorMessage(err, {
          actionFallback: isEdit
            ? "Could not update reward."
            : "Could not create reward.",
        })
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass = `${authInputClassName} pl-4`;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-gradient-to-b from-stone-900/45 to-stone-900/55 backdrop-blur-md transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reward-form-title"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/80 bg-gradient-to-b from-[#fffefb] to-[#FFA500]/10 shadow-[0_25px_60px_-15px_rgba(28,25,23,0.25)] ring-1 ring-stone-200/70"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100/80 bg-gradient-to-r from-[#FFA500]/14 via-white/90 to-[#FF7518]/10 px-6 py-4 shadow-sm shadow-stone-200/30 backdrop-blur-md">
              <h2
                id="reward-form-title"
                className="text-lg font-semibold text-stone-900"
              >
                {isEdit ? "Edit reward" : "Add reward"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-stone-500 transition-all duration-200 hover:bg-stone-100 hover:text-stone-800 active:scale-95"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {error && (
                <div className="rounded-2xl border border-red-200/80 bg-gradient-to-b from-red-50/95 to-red-50/70 px-4 py-3 text-sm text-red-800 shadow-sm shadow-red-900/5 ring-1 ring-red-100">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="rw-title" className={authLabelClassName}>
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  id="rw-title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                  placeholder="e.g. Chocolate muffin voucher"
                />
              </div>

              <div>
                <label htmlFor="rw-desc" className={authLabelClassName}>
                  Description
                </label>
                <textarea
                  id="rw-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className={`mt-1.5 min-h-[88px] w-full resize-y rounded-2xl border border-stone-200/90 bg-[#fffefb] px-4 py-3 text-stone-900 shadow-inner shadow-stone-200/30 outline-none transition-all duration-300 placeholder:text-stone-400 hover:border-[#FFA500]/70 focus:border-[#FF7518] focus:shadow-lg focus:shadow-[#FFA500]/20 focus:ring-2 focus:ring-[#FF7518]/35`}
                  placeholder="Short sentence for users"
                />
              </div>

              <div>
                <label htmlFor="rw-store" className={authLabelClassName}>
                  Store name
                </label>
                <input
                  id="rw-store"
                  value={form.storeName}
                  onChange={(e) => update("storeName", e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                  placeholder="Partner store name"
                />
              </div>

              <div>
                <label htmlFor="rw-image" className={authLabelClassName}>
                  Image URL
                </label>
                <input
                  id="rw-image"
                  type="text"
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                  placeholder="https://…"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="rw-points" className={authLabelClassName}>
                    Points <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="rw-points"
                    type="number"
                    min={0}
                    value={form.pointsRequired}
                    onChange={(e) => update("pointsRequired", e.target.value)}
                    className={`mt-1.5 ${inputClass}`}
                  />
                </div>
                <div>
                  <label htmlFor="rw-qty" className={authLabelClassName}>
                    Quantity
                  </label>
                  <input
                    id="rw-qty"
                    type="number"
                    min={0}
                    value={form.quantity}
                    onChange={(e) => update("quantity", e.target.value)}
                    className={`mt-1.5 ${inputClass}`}
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-200/80 bg-gradient-to-r from-white/90 to-[#FFA500]/10 px-4 py-3 shadow-sm ring-1 ring-stone-100 transition-all duration-300 hover:border-[#FFA500]/45 hover:shadow-md">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-[#FF5F1F] focus:ring-[#FF7518]"
                />
                <span className="text-sm font-medium text-stone-700">
                  Active (visible on public rewards page)
                </span>
              </label>

              <div className="flex flex-col-reverse gap-2 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/50 px-5 py-3 text-sm font-semibold text-stone-700 shadow-md shadow-stone-300/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-stone-50 hover:shadow-lg active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF7518]/30 transition-all duration-300 hover:from-[#FF7518] hover:via-[#FF5F1F] hover:to-[#FF5F1F] hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
                >
                  {saving ? "Saving…" : isEdit ? "Save changes" : "Create reward"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
