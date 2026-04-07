import { useState, useEffect, useCallback } from "react";
import {
  fetchAllRecords,
  fetchAllUsers,
  createRecord,
  updateRecord,
  deleteRecord,
  notifyTop5,
} from "../../api/leaderboardApi";
import Toast from "../shared/Toast";
import LoadingSpinner from "../shared/LoadingSpinner";

/* ─── small reusable input ─────────────────────────── */
function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );
}

/* ─── Create Modal.. ──────────────────────────────────── */
function CreateModal({ onClose, onCreated }) {
  const [userId, setUserId]     = useState("");
  const [points, setPoints]     = useState("");
  const [distance, setDistance] = useState("");
  const [emission, setEmission] = useState("");
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState("");
  const [users, setUsers]       = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchAllUsers()
      .then(({ data }) => { setUsers(data); if (data.length) setUserId(data[0]._id); })
      .catch(() => setErr("Could not load walker list."))
      .finally(() => setLoadingUsers(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) { setErr("Please select a walker."); return; }
    setSaving(true); setErr("");
    try {
      await createRecord({
        userId,
        points:   parseFloat(points)   || 0,
        distance: parseFloat(distance) || 0,
        emission: parseFloat(emission) || 0,
      });
      onCreated();
    } catch (ex) {
      setErr(ex.response?.data?.message || "Failed to create record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">➕ Create Leaderboard Entry</h2>
        {err && <p className="text-sm text-red-600 mb-3">⚠ {err}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Walker</label>
            {loadingUsers ? (
              <p className="text-sm text-gray-400">Loading walkers…</p>
            ) : (
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Points"   type="number" value={points}   onChange={setPoints}   placeholder="0" />
            <Field label="Distance (km)" type="number" value={distance} onChange={setDistance} placeholder="0" />
            <Field label="CO₂ (kg)" type="number" value={emission} onChange={setEmission} placeholder="0" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm font-semibold bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition-colors">
              {saving ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Edit Modal ────────────────────────────────────── */
function EditModal({ record, onClose, onUpdated }) {
  const [points,   setPoints]   = useState(String(record.weekly_points   ?? ""));
  const [distance, setDistance] = useState(String(record.weekly_distance ?? ""));
  const [emission, setEmission] = useState(String(record.weekly_emission ?? ""));
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      await updateRecord(record._id, {
        newPoints:   parseFloat(points),
        newDistance: parseFloat(distance),
        newEmission: parseFloat(emission),
      });
      onUpdated();
    } catch (ex) {
      setErr(ex.response?.data?.message || "Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">✏️ Edit Record</h2>
        <p className="text-sm text-gray-500 mb-4">{record.name} — <span className="font-mono text-xs">{record._id}</span></p>
        {err && <p className="text-sm text-red-600 mb-3">⚠ {err}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Points"       type="number" value={points}   onChange={setPoints} />
            <Field label="Distance (km)" type="number" value={distance} onChange={setDistance} />
            <Field label="CO₂ (kg)"     type="number" value={emission} onChange={setEmission} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function AdminLeaderboardPage() {
  const [records,    setRecords]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState({ type: "success", message: "" });
  const [creating,   setCreating]   = useState(false);
  const [editing,    setEditing]    = useState(null);   // record being edited
  const [notifying,  setNotifying]  = useState(false);

  const showToast = (type, message) => setToast({ type, message });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchAllRecords();
      setRecords(data.data || []);
    } catch {
      showToast("error", "Failed to load leaderboard records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* DELETE */
  const handleDelete = async (record) => {
    if (!window.confirm(`Delete leaderboard record for "${record.name}"?`)) return;
    try {
      await deleteRecord(record._id);
      showToast("success", `Record for "${record.name}" deleted.`);
      load();
    } catch (ex) {
      showToast("error", ex.response?.data?.message || "Delete failed.");
    }
  };

  /* NOTIFY TOP 5 */
  const handleNotify = async () => {
    if (!window.confirm("Send congratulatory emails to this week's Top 5 walkers?")) return;
    setNotifying(true);
    try {
      const { data } = await notifyTop5();
      showToast("success", data.message);
    } catch (ex) {
      showToast("error", ex.response?.data?.message || "Failed to send notifications.");
    } finally {
      setNotifying(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading records…" />;

  return (
    <div className="max-w-5xl mx-auto">

      {/* Toast */}
      {toast.message && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, message: "" })} />
      )}

      {/* Modals */}
      {creating && (
        <CreateModal
          onClose={() => setCreating(false)}
          onCreated={() => { setCreating(false); showToast("success", "Record created successfully."); load(); }}
        />
      )}
      {editing && (
        <EditModal
          record={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => { setEditing(null); showToast("success", "Record updated successfully."); load(); }}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🛠 Leaderboard Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Current week — {records.length} record{records.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Notify Top 5 */}
          <button
            onClick={handleNotify}
            disabled={notifying}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            {notifying
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Sending…</>
              : "📧 Notify Top 5"}
          </button>

          {/* Create */}
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            ➕ Create Entry
          </button>
        </div>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No records for this week.</p>
          <p className="text-sm mt-1">Run seed scripts or create an entry manually.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["#", "Walker", "Email", "Points", "Distance", "CO₂ Saved", "Actions"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((r, idx) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    {/* Rank */}
                    <td className="py-3 px-4 font-semibold text-gray-500 w-10">
                      {idx + 1}
                    </td>
                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
                          {(r.name || "?")[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{r.name || "—"}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="py-3 px-4 text-gray-500 text-xs">{r.email || "—"}</td>
                    {/* Points */}
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {r.weekly_points?.toLocaleString()}
                    </td>
                    {/* Distance */}
                    <td className="py-3 px-4 text-gray-500">
                      {r.weekly_distance?.toFixed(2)} km
                    </td>
                    {/* CO₂ */}
                    <td className="py-3 px-4 text-gray-500">
                      {r.weekly_emission?.toFixed(3)} kg
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(r)}
                          className="px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
                          className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
