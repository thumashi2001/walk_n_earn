import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AUTH_ROLE_KEY,
  AUTH_TOKEN_KEY,
  getAuthErrorMessage,
} from "../services/auth";
import { fetchRewardsList } from "../services/rewards";
import RewardFormModal from "../components/admin/RewardFormModal";
import DeleteRewardModal from "../components/admin/DeleteRewardModal";
import { getRewardImageUrl } from "../utils/rewardImages";

function isAdminSession() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const role = localStorage.getItem(AUTH_ROLE_KEY);
  return Boolean(token && role === "admin");
}

function hasToken() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}

export default function Admin() {
  if (!hasToken()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdminSession()) {
    return <Navigate to="/rewards" replace />;
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [flash, setFlash] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [deletingReward, setDeletingReward] = useState(null);

  const loadRewards = useCallback(async () => {
    setListError("");
    try {
      const data = await fetchRewardsList();
      setRewards(data);
    } catch (err) {
      setListError(
        getAuthErrorMessage(err, {
          actionFallback: "Could not load rewards.",
        })
      );
      setRewards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  function openCreate() {
    setEditingReward(null);
    setFormOpen(true);
  }

  function openEdit(r) {
    setEditingReward(r);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingReward(null);
  }

  function onSaved() {
    setFlash({ type: "ok", text: "Reward saved successfully." });
    window.setTimeout(() => setFlash(null), 4000);
    loadRewards();
  }

  function onDeleted() {
    setFlash({ type: "ok", text: "Reward deleted." });
    window.setTimeout(() => setFlash(null), 4000);
    loadRewards();
  }

  const activeCount = rewards.filter((r) => r.isActive !== false).length;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-stone-100 bg-white/95 px-6 py-8 shadow-lg shadow-stone-200/60 ring-1 ring-stone-100 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Rewards dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm text-stone-600">
              Manage catalog items, stock, and visibility for the public rewards
              page.
            </p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="shrink-0 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-900/25 transition hover:from-amber-700 hover:to-amber-900"
          >
            + Add reward
          </motion.button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-amber-50/90 px-4 py-3 ring-1 ring-amber-200/50">
            <p className="text-xs font-medium text-amber-900/70">Total rewards</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-amber-950">
              {rewards.length}
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 px-4 py-3 ring-1 ring-stone-200/80">
            <p className="text-xs font-medium text-stone-500">Active</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-stone-900">
              {activeCount}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl bg-stone-50/90 px-4 py-3 ring-1 ring-stone-200/60 sm:col-span-1">
            <p className="text-xs font-medium text-stone-500">Inactive</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-stone-700">
              {rewards.length - activeCount}
            </p>
          </div>
        </div>
      </header>

      {flash?.type === "ok" && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-900 ring-1 ring-emerald-100"
          role="status"
        >
          {flash.text}
        </motion.div>
      )}

      <section className="overflow-hidden rounded-3xl border border-stone-100 bg-white/95 shadow-lg shadow-stone-200/50 ring-1 ring-stone-100">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-amber-200 border-t-amber-700" />
            <p className="text-sm text-stone-600">Loading rewards…</p>
          </div>
        )}

        {!loading && listError && (
          <div className="p-6 text-center text-sm text-red-800">{listError}</div>
        )}

        {!loading && !listError && rewards.length === 0 && (
          <div className="p-10 text-center text-sm text-stone-600">
            No rewards yet. Click{" "}
            <span className="font-semibold text-stone-800">Add reward</span> to
            create one.
          </div>
        )}

        {!loading && !listError && rewards.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200/80 bg-gradient-to-r from-amber-50/50 to-transparent">
                  <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                    Image
                  </th>
                  <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                    Reward
                  </th>
                  <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                    Points
                  </th>
                  <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                    Qty
                  </th>
                  <th className="px-4 py-3 font-semibold text-stone-700 sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-700 sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rewards.map((r) => (
                  <tr
                    key={r._id}
                    className="transition-colors hover:bg-amber-50/30"
                  >
                    <td className="px-4 py-3 sm:px-6">
                      <div className="h-14 w-20 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/80">
                        <img
                          src={getRewardImageUrl(r)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="max-w-[220px] px-4 py-3 sm:px-6">
                      <p className="font-semibold text-stone-900">{r.title}</p>
                      {r.storeName && (
                        <p className="mt-0.5 text-xs text-amber-900/70">
                          {r.storeName}
                        </p>
                      )}
                      {r.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-stone-500">
                          {r.description}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums text-stone-800 sm:px-6">
                      {r.pointsRequired}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-stone-700 sm:px-6">
                      {r.quantity ?? "—"}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          r.isActive !== false
                            ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/60"
                            : "bg-stone-200/80 text-stone-600 ring-1 ring-stone-300/50"
                        }`}
                      >
                        {r.isActive !== false ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right sm:px-6">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="mr-2 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200/80 transition hover:bg-amber-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingReward(r)}
                        className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200/80 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <RewardFormModal
        open={formOpen}
        reward={editingReward}
        onClose={closeForm}
        onSaved={onSaved}
      />
      <DeleteRewardModal
        open={Boolean(deletingReward)}
        reward={deletingReward}
        onClose={() => setDeletingReward(null)}
        onDeleted={onDeleted}
      />
    </div>
  );
}
