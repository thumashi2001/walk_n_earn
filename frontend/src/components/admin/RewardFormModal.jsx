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
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reward-form-title"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#fffefb] shadow-2xl shadow-stone-400/30 ring-1 ring-stone-200/90"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-gradient-to-r from-amber-50/90 to-white/95 px-6 py-4 backdrop-blur-sm">
              <h2
                id="reward-form-title"
                className="text-lg font-semibold text-stone-900"
              >
                {isEdit ? "Edit reward" : "Add reward"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {error && (
                <div className="rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 ring-1 ring-red-100">
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
                  className={`mt-1.5 min-h-[88px] w-full resize-y rounded-2xl border border-stone-200 bg-[#fffefb] px-4 py-3 text-stone-900 shadow-inner shadow-stone-100/80 outline-none transition placeholder:text-stone-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200/60`}
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

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 ring-1 ring-stone-100">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-stone-700">
                  Active (visible on public rewards page)
                </span>
              </label>

              <div className="flex flex-col-reverse gap-2 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-amber-900/20 transition hover:from-amber-700 hover:to-amber-900 disabled:opacity-60"
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
