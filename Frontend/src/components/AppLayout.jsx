import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppFooter from "./AppFooter";

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Walk", path: "/app/walk" },
    { label: "Rewards", path: "/app/rewards" },
    { label: "Leaderboard", path: "/app/leaderboard" },
    { label: "Weather", path: "/app/weather" },
    { label: "About", path: "/app/about" },
  ];

  if (user?.role === "admin") {
    navItems.push({ label: "Admin", path: "/app/admin" });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#8a4b00" : "#444",
    fontWeight: isActive ? "700" : "600",
    padding: "10px 14px",
    borderRadius: "12px",
    backgroundColor: isActive ? "#f8e2c1" : "transparent",
    display: "inline-block",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f1e6",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "20px",
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              to="/app/walk"
              style={{
                textDecoration: "none",
                color: "#8a4b00",
                fontWeight: "800",
                fontSize: "22px",
              }}
            >
              Walk n Earn
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-menu-btn"
              style={{
                border: "1px solid #ddd",
                background: "#fff",
                borderRadius: "10px",
                padding: "8px 12px",
                cursor: "pointer",
                display: "none",
              }}
            >
              ☰
            </button>
          </div>

          <nav
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} style={linkStyle}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: "auto",
            }}
          >
            <div
              style={{
                background: "#fff7eb",
                border: "1px solid #f0d8b2",
                borderRadius: "999px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#8a4b00",
              }}
            >
              {user?.fullName}
            </div>

            <button
              onClick={handleLogout}
              style={{
                border: "none",
                background: "#222",
                color: "#fff",
                borderRadius: "12px",
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>

          {menuOpen && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={linkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </header>

        <main
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "24px",
            padding: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            minHeight: "70vh",
          }}
        >
          <Outlet />
          <AppFooter />
        </main>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }

            .mobile-menu-btn {
              display: inline-block !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AppLayout;