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

      login(data.user);
      setLoading(false);
      navigate("/app/walk");
    } catch (error) {
      setMessage("Something went wrong while logging in");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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

      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 16px auto",
            borderRadius: "20px",
            backgroundColor: "#edaf5e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
          }}
        >
          🚶
        </div>

        <h1 style={{ margin: 0, fontSize: "30px", color: "#222" }}>
          Walk n Earn
        </h1>
        <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
          Login and start your walking journey
        </p>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
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
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #ddd",
              fontSize: "16px",
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
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: "#edaf5e",
            color: "#222",
            fontSize: "16px",
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
            marginTop: "10px",
            textAlign: "center",
            color: "red",
          }}
        >
          {message}
        </p>
      )}

      <p style={{ marginTop: "10px", textAlign: "center" }}>
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
  );
}

export default Login;