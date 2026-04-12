import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // --- CRITICAL CHANGES START ---
      // 1. Save token and role so RoleLanding (in App.jsx) can see them
      localStorage.setItem("token", data.token); 
      localStorage.setItem("role", data.user.role || "user");

      // 2. Update your Context state
      login(data.user);
      
      setLoading(false);
      
      // 3. Navigate to "/" - RoleLanding will then pick up the token 
      // and decide to show <Admin /> or <Dashboard /> (or <Walking />)
      navigate("/"); 
      // --- CRITICAL CHANGES END ---

    } catch (error) {
      setMessage("Something went wrong while logging in");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f1e6",
        padding: "24px 16px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                border: "none",
                background: "#eee",
                borderRadius: "10px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              ← Home
            </button>

            <span style={{ fontWeight: "700" }}>Walk n Earn</span>
          </div>

          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <div
              style={{
                width: "68px",
                height: "68px",
                margin: "0 auto 14px auto",
                borderRadius: "20px",
                backgroundColor: "#edaf5e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🚶
            </div>

            <h1 style={{ margin: 0, fontSize: "28px", color: "#222" }}>
              Welcome Back
            </h1>
            <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
              Login and continue your walking journey
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: "1px solid #ddd",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: "1px solid #ddd",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: "#edaf5e",
                color: "#222",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "12px",
                textAlign: "center",
                color: "red",
                fontSize: "14px",
              }}
            >
              {message}
            </p>
          )}

          <p style={{ marginTop: "14px", textAlign: "center", fontSize: "14px" }}>
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#edaf5e",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;