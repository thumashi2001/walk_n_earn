import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const navItem = (to, label) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        onClick={() => setMenuOpen(false)}
        style={{
          textDecoration: "none",
          padding: "10px 14px",
          borderRadius: "12px",
          fontWeight: "600",
          fontSize: "14px",
          background: isActive ? "#edaf5e" : "transparent",
          color: isActive ? "#222" : "#555",
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f1e6",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ fontWeight: "800", fontSize: "20px", color: "#8a4b00" }}>
          Walk n Earn
        </div>

        {/* DESKTOP NAV */}
        <div className="desktop-nav" style={{ display: "flex", gap: "10px" }}>
          {navItem("/app/walk", "Walk")}
          {navItem("/app/rewards", "Rewards")}
          {navItem("/app/leaderboard", "Leaderboard")}
          {navItem("/app/weather", "Weather")}
          {navItem("/app/about", "About")}
          {user?.role === "admin" && navItem("/app/admin", "Admin")}

          <button
            onClick={logout}
            style={{
              border: "none",
              background: "#eee",
              borderRadius: "10px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Logout
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            border: "none",
            background: "#edaf5e",
            borderRadius: "10px",
            padding: "8px 12px",
            cursor: "pointer",
            display: "none",
          }}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            background: "#fff",
            borderBottom: "1px solid #eee",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {navItem("/app/walk", "Walk")}
          {navItem("/app/rewards", "Rewards")}
          {navItem("/app/leaderboard", "Leaderboard")}
          {navItem("/app/weather", "Weather")}
          {navItem("/app/about", "About")}
          {user?.role === "admin" && navItem("/app/admin", "Admin")}

          <button
            onClick={logout}
            style={{
              border: "none",
              background: "#eee",
              borderRadius: "10px",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* CONTENT */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 16px",
        }}
      >
        <Outlet />
      </div>

      {/* RESPONSIVE */}
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }

            .mobile-menu-btn {
              display: block !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AppLayout;