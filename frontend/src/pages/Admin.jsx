import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AUTH_ROLE_KEY,
  AUTH_TOKEN_KEY,
  clearSession,
  getAuthErrorMessage,
} from "../services/auth";
import { fetchRewardsList } from "../services/rewards";
import API, { getFriendlyApiError } from "../services/api";
import RewardFormModal from "../components/admin/RewardFormModal";
import DeleteRewardModal from "../components/admin/DeleteRewardModal";
import { getRewardImageUrl } from "../utils/rewardImages";
import RedemptionTable from "../components/RedemptionTable";
import UserTable from "../components/UserTable";

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
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [redemptions, setRedemptions] = useState([]);
  const [redemptionsLoading, setRedemptionsLoading] = useState(true);
  const [redemptionsError, setRedemptionsError] = useState("");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
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

  useEffect(() => {
    let mounted = true;

    async function loadRedemptions() {
      setRedemptionsError("");
      setRedemptionsLoading(true);
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        // eslint-disable-next-line no-console
        console.log("[Admin] token?", Boolean(token));
        const res = await API.get("/rewards/redemptions", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        // eslint-disable-next-line no-console
        console.log("[Admin] redemptions response", res.data);
        const rows = Array.isArray(res.data) ? res.data : [];
        if (mounted) setRedemptions(rows);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[Admin] redemptions error", err);
        if (mounted) {
          setRedemptionsError(
            getFriendlyApiError(err, {
              fallback: "Could not load redemption history.",
            })
          );
          setRedemptions([]);
        }
      } finally {
        if (mounted) setRedemptionsLoading(false);
      }
    }

    async function loadUsers() {
      setUsersError("");
      setUsersLoading(true);
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const res = await API.get("/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        // eslint-disable-next-line no-console
        console.log("[Admin] users response", res.data);
        const rows = Array.isArray(res.data) ? res.data : [];
        if (mounted) setUsers(rows);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[Admin] users error", err);
        if (mounted) {
          setUsersError(
            getFriendlyApiError(err, {
              fallback: "Could not load users.",
            })
          );
          setUsers([]);
        }
      } finally {
        if (mounted) setUsersLoading(false);
      }
    }

    loadRedemptions();
    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

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

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  const activeCount = rewards.filter((r) => r.isActive !== false).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-white/98 via-white/95 to-[#FFA500]/12 px-5 py-7 shadow-xl shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/20 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl sm:px-8 sm:py-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5F1F]">
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={openCreate}
              className="shrink-0 rounded-2xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF7518]/35 transition-all duration-300 hover:from-[#FF7518] hover:via-[#FF5F1F] hover:to-[#FF5F1F] hover:shadow-xl"
            >
              + Add reward
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={handleLogout}
              className="shrink-0 rounded-2xl border border-[#FF7518]/35 bg-white px-5 py-3 text-sm font-semibold text-[#7a2b00] shadow-md shadow-[#FF7518]/10 transition-all duration-300 hover:bg-[#FFA500]/10 hover:shadow-lg"
            >
              Logout
            </motion.button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#FFA500]/18 to-[#FF7518]/12 px-4 py-3 shadow-md shadow-[#FF7518]/10 ring-1 ring-[#FFA500]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-xs font-medium text-[#a33a00]/75">Total rewards</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[#7a2b00]">
              {rewards.length}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-100/80 bg-gradient-to-br from-white to-stone-50/40 px-4 py-3 shadow-md shadow-stone-300/20 ring-1 ring-stone-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-xs font-medium text-stone-500">Active</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-stone-900">
              {activeCount}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl bg-gradient-to-br from-stone-50/95 to-stone-100/50 px-4 py-3 shadow-md shadow-stone-400/10 ring-1 ring-stone-200/55 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:col-span-1">
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
          className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/95 to-emerald-50/70 px-4 py-3 text-sm font-medium text-emerald-900 shadow-md shadow-emerald-900/10 ring-1 ring-emerald-100"
          role="status"
        >
          {flash.text}
        </motion.div>
      )}

      <section className="overflow-hidden rounded-3xl border border-stone-200/40 bg-gradient-to-b from-white/98 to-[#FFA500]/10 shadow-xl shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/15 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#FFA500]/30 border-t-[#FF5F1F]" />
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
                <tr className="border-b border-stone-200/80 bg-gradient-to-r from-[#FFA500]/16 via-[#FF7518]/8 to-transparent">
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
                    className="transition-colors duration-200 ease-out hover:bg-gradient-to-r hover:from-[#FFA500]/14 hover:to-transparent"
                  >
                    <td className="px-4 py-3 sm:px-6">
                      <div className="h-14 w-20 overflow-hidden rounded-xl bg-stone-100 shadow-sm ring-1 ring-stone-200/80 transition-transform duration-300 ease-out hover:scale-105 hover:shadow-md">
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
                        <p className="mt-0.5 text-xs text-[#a33a00]/75">
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
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-shadow duration-200 ${
                          r.isActive !== false
                            ? "bg-gradient-to-b from-emerald-100 to-emerald-50/90 text-emerald-900 ring-1 ring-emerald-200/60"
                            : "bg-gradient-to-b from-stone-200/90 to-stone-100/80 text-stone-600 ring-1 ring-stone-300/50"
                        }`}
                      >
                        {r.isActive !== false ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right sm:px-6">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="mr-2 rounded-xl bg-gradient-to-b from-white to-[#FFA500]/12 px-3 py-1.5 text-xs font-semibold text-[#7a2b00] shadow-sm ring-1 ring-[#FFA500]/35 transition-all duration-200 hover:-translate-y-px hover:bg-[#FFA500]/15 hover:shadow-md active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingReward(r)}
                        className="rounded-xl bg-gradient-to-b from-white to-red-50/20 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-red-200/80 transition-all duration-200 hover:-translate-y-px hover:bg-red-50 hover:shadow-md active:scale-95"
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

      <RedemptionTable
        rows={redemptions}
        loading={redemptionsLoading}
        error={redemptionsError}
      />

      <UserTable users={users} loading={usersLoading} error={usersError} />

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
