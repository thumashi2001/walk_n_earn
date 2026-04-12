import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const MEDALS = ["🥇", "🥈", "🥉"];

function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [top10, setTop10] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifying, setNotifying] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/leaderboard/top`);
      const data = await res.json();
      if (res.ok) setTop10(data);
      else setError("Failed to load leaderboard");
    } catch {
      setError("Failed to load leaderboard");
    }
    if (user?._id) {
      try {
        const res = await fetch(`${API_URL}/api/leaderboard/rank/${user._id}`);
        if (res.ok) {
          const data = await res.json();
          setUserRank(data);
        } else {
          setUserRank(null);
        }
      } catch {
        /* user may not have rank yet */
      }
    }
    setLoading(false);
  }, [user?._id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleNotify = async () => {
    if (!window.confirm("Send congratulatory emails to this week's Top 5 walkers?")) return;
    setNotifying(true);
    setNotifyMsg("");
    try {
      const token = localStorage.getItem("walknEarnToken");
      const res = await fetch(`${API_URL}/api/leaderboard/notify-top5`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotifyMsg(data.message || "Emails sent successfully");
      } else {
        setNotifyMsg("Error: " + (data.message || "Failed to send"));
      }
    } catch {
      setNotifyMsg("Failed to send notifications");
    } finally {
      setNotifying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
        Loading leaderboard…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(237,175,94,0.18) 0%, rgba(255,255,255,1) 100%)",
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
          Leaderboard
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "34px", color: "#d56a00" }}>🏆 Weekly Leaderboard</h1>
            <p style={{ margin: "6px 0 0 0", color: "#666" }}>Top walkers this week (Mon – Sun)</p>
          </div>
          <button
            onClick={load}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Admin controls */}
      {user?.role === "admin" && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "18px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
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
            onClick={() => navigate("/app/admin-leaderboard")}
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
            🛠 Manage Leaderboard
          </button>
          {notifyMsg && (
            <span style={{ fontSize: "14px", color: "#666" }}>{notifyMsg}</span>
          )}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fff3cd",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "18px",
            color: "#856404",
          }}
        >
          {error}
        </div>
      )}

      {/* Your rank card */}
      {userRank ? (
        <div
          style={{
            marginBottom: "18px",
            padding: "20px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #edaf5e 0%, #d56a00 100%)",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(213,106,0,0.25)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: "600",
              opacity: 0.85,
            }}
          >
            Your rank this week
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              textAlign: "center",
            }}
          >
            <div>
              <p style={{ fontSize: "28px", fontWeight: "800", margin: 0 }}>#{userRank.rank}</p>
              <p style={{ fontSize: "12px", opacity: 0.75, margin: "4px 0 0 0" }}>Rank</p>
            </div>
            <div>
              <p style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>{userRank.weekly_points}</p>
              <p style={{ fontSize: "12px", opacity: 0.75, margin: "4px 0 0 0" }}>Points</p>
            </div>
            <div>
              <p style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>
                {userRank.weekly_distance?.toFixed(1)} km
              </p>
              <p style={{ fontSize: "12px", opacity: 0.75, margin: "4px 0 0 0" }}>Distance</p>
            </div>
            <div>
              <p style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>
                {userRank.weekly_emission?.toFixed(2)} kg
              </p>
              <p style={{ fontSize: "12px", opacity: 0.75, margin: "4px 0 0 0" }}>CO₂ Saved</p>
            </div>
          </div>
        </div>
      ) : (
        user && (
          <div
            style={{
              marginBottom: "18px",
              padding: "14px",
              borderRadius: "14px",
              background: "#fff4e3",
              border: "1px solid #f1d2a5",
              fontSize: "14px",
              color: "#8a4b00",
            }}
          >
            You haven't logged any walks this week yet. Start walking to appear on the leaderboard!
          </div>
        )
      )}

      {/* Leaderboard table */}
      {top10.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
          <p style={{ fontSize: "40px", marginBottom: "12px" }}>🚶</p>
          <p style={{ fontWeight: "600" }}>No data for this week yet.</p>
          <p style={{ fontSize: "14px", marginTop: "6px" }}>
            Come back after someone starts walking!
          </p>
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#faf6f0", borderBottom: "1px solid #eee" }}>
                {["Rank", "Walker", "Points", "Distance", "CO₂ Saved"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: h === "Rank" || h === "Walker" ? "left" : "right",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#8a4b00",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top10.map((entry, idx) => {
                const isMe = user?._id === entry.userId?.toString();
                return (
                  <tr
                    key={entry._id || idx}
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                      background: isMe ? "#fff7eb" : "transparent",
                    }}
                  >
                    <td style={{ padding: "14px 16px", width: "60px" }}>
                      {idx < 3 ? (
                        <span style={{ fontSize: "20px" }}>{MEDALS[idx]}</span>
                      ) : (
                        <span style={{ fontWeight: "600", color: "#999" }}>#{idx + 1}</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#f8e2c1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "#8a4b00",
                          }}
                        >
                          {(entry.name || "U")[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: "600", color: isMe ? "#d56a00" : "#333" }}>
                          {entry.name || "Anonymous"}
                          {isMe && (
                            <span style={{ marginLeft: "8px", fontSize: "12px", color: "#edaf5e" }}>
                              (You)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {entry.weekly_points?.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#666" }}>
                      {entry.weekly_distance?.toFixed(2)} km
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#666" }}>
                      {entry.weekly_emission?.toFixed(3)} kg
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;