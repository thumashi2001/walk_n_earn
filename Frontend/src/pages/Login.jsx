import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5050/api/users/login", {
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

      localStorage.setItem("walknEarnUser", JSON.stringify(data.user));
      setMessage("Login successful");
      setLoading(false);

      navigate("/home");
    } catch (error) {
      setMessage("Something went wrong while logging in");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            color: "#222",
          }}
        >
          Walk n Earn
        </h1>
        <p
          style={{
            marginTop: "8px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          Walk more, earn more, save CO₂.
        </p>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
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
            border: "none",
            borderRadius: "14px",
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
            marginTop: "16px",
            fontSize: "14px",
            color: message.toLowerCase().includes("successful") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}

      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#555",
        }}
      >
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