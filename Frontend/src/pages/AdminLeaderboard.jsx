import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../config";

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  fontSize: "12px",
  color: "#8a4b00",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

/* ─── Create Modal ─────────────────────────────────── */
function CreateModal({ users, onClose, onCreated }) {
  const [userId, setUserId] = useState(users.length ? users[0]._id : "");
  const [points, setPoints] = useState("");
  const [distance, setDistance] = useState("");
  const [emission, setEmission] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErr("Please select a walker");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      await onCreated({
        userId,
        points: parseFloat(points) || 0,
        distance: parseFloat(distance) || 0,
        emission: parseFloat(emission) || 0,
      });
    } catch (ex) {
      setErr(ex.message || "Failed to create");
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.35)",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "#d56a00" }}>
          ➕ Create Leaderboard Entry
        </h2>
        {err && (
          <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>⚠ {err}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Walker</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ ...inputStyle, background: "#fff" }}
            >
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Distance (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>CO₂ (kg)</label>
              <input
                type="number"
                value={emission}
                onChange={(e) => setEmission(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "none",
                background: "#edaf5e",
                color: "#222",
                fontWeight: "700",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Edit Modal ───────────────────────────────────── */
function EditModal({ record, onClose, onUpdated }) {
  const [points, setPoints] = useState(String(record.weekly_points ?? ""));
  const [distance, setDistance] = useState(String(record.weekly_distance ?? ""));
  const [emission, setEmission] = useState(String(record.weekly_emission ?? ""));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await onUpdated({
        newPoints: parseFloat(points),
        newDistance: parseFloat(distance),
        newEmission: parseFloat(emission),
      });
    } catch (ex) {
      setErr(ex.message || "Failed to update");
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.35)",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "#d56a00" }}>
          ✏️ Edit Record
        </h2>
        <p style={{ margin: "0 0 16px 0", color: "#666", fontSize: "14px" }}>{record.name}</p>
        {err && (
          <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>⚠ {err}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Distance (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>CO₂ (kg)</label>
              <input
                type="number"
                value={emission}
                onChange={(e) => setEmission(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "none",
                background: "#edaf5e",
                color: "#222",
                fontWeight: "700",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Admin Leaderboard Page ──────────────────── */
function AdminLeaderboard() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notifying, setNotifying] = useState(false);

  const authHeaders = () => {
    const token = localStorage.getItem("walknEarnToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/leaderboard`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setRecords(data.data || []);
    } catch {
      setToast("Failed to load records");
    }
    setLoading(false);
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      /* user list not critical */
    }
  };

  useEffect(() => {
    load();
    loadUsers();
  }, [load]);

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete record for "${record.name}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/leaderboard/${record._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setToast(`Record for "${record.name}" deleted`);
        load();
      } else {
        const d = await res.json();
        setToast(d.message || "Delete failed");
      }
    } catch {
      setToast("Delete failed");
    }
  };

  const handleNotify = async () => {
    if (!window.confirm("Send emails to Top 5 walkers?")) return;
    setNotifying(true);
    try {
      const res = await fetch(`${API_URL}/api/leaderboard/notify-top5`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      setToast(data.message || "Emails sent");
    } catch {
      setToast("Failed to send notifications");
    } finally {
      setNotifying(false);
    }
  };

  const handleCreate = async (body) => {
    const res = await fetch(`${API_URL}/api/leaderboard`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (res.status === 409) {
      const d = await res.json();
      // Record already exists this week — update it instead using PUT field names
      const putRes = await fetch(`${API_URL}/api/leaderboard/${d.existingId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          newPoints: body.points,
          newDistance: body.distance,
          newEmission: body.emission,
        }),
      });
      if (!putRes.ok) {
        const pd = await putRes.json();
        throw new Error(pd.message || "Failed to update existing record");
      }
      setToast("Record updated (entry already existed this week)");
      load();
      return;
    }
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.message || "Failed");
    }
    setToast("Record created");
    load();
  };

  const handleUpdate = async (id, body) => {
    const res = await fetch(`${API_URL}/api/leaderboard/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.message || "Failed");
    }
    setToast("Record updated");
    load();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
        Loading records…
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 100,
            background: "#222",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          }}
        >
          {toast}
          <button
            onClick={() => setToast("")}
            style={{
              marginLeft: "12px",
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Modals */}
      {creating && (
        <CreateModal
          users={users}
          onClose={() => setCreating(false)}
          onCreated={async (body) => {
            await handleCreate(body);
            setCreating(false);
          }}
        />
      )}
      {editing && (
        <EditModal
          record={editing}
          onClose={() => setEditing(null)}
          onUpdated={async (body) => {
            await handleUpdate(editing._id, body);
            setEditing(null);
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(237,175,94,0.18) 0%, rgba(255,255,255,1) 100%)",
          borderRadius: "22px",
          padding: "22px",
          border: "1px solid #eee",
          marginBottom: "18px",
        }}
      >
        <p
          style={{
            margin: "0 0 8px 0",
            fontSize: "12px",
            fontWeight: "700",
            color: "#c06b00",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Admin
        </p>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#d56a00" }}>
          🛠 Leaderboard Management
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#666" }}>
          Current week — {records.length} record{records.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
        <button
          onClick={handleNotify}
          disabled={notifying}
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#edaf5e",
            color: "#222",
            fontWeight: "700",
            cursor: notifying ? "not-allowed" : "pointer",
            opacity: notifying ? 0.6 : 1,
          }}
        >
          {notifying ? "Sending…" : "📧 Notify Top 5"}
        </button>
        <button
          onClick={() => setCreating(true)}
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#222",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ➕ Create Entry
        </button>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
          <p style={{ fontSize: "40px", marginBottom: "12px" }}>📋</p>
          <p style={{ fontWeight: "600" }}>No records for this week.</p>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid #eee",
            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#faf6f0", borderBottom: "1px solid #eee" }}>
                  {["#", "Walker", "Email", "Points", "Distance", "CO₂ Saved", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 14px",
                          textAlign: "left",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#8a4b00",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={r._id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td style={{ padding: "12px 14px", fontWeight: "600", color: "#999" }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "#f8e2c1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "12px",
                            color: "#8a4b00",
                          }}
                        >
                          {(r.name || "?")[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: "600", color: "#333" }}>
                          {r.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#666", fontSize: "12px" }}>
                      {r.email || "—"}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: "600" }}>
                      {r.weekly_points?.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#666" }}>
                      {r.weekly_distance?.toFixed(2)} km
                    </td>
                    <td style={{ padding: "12px 14px", color: "#666" }}>
                      {r.weekly_emission?.toFixed(3)} kg
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => setEditing(r)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#fee2e2",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
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

export default AdminLeaderboard;
