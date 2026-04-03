import { Link } from "react-router-dom";

function Landing() {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "30px",
        paddingBottom: "30px",
      }}
    >
      <div>
        <div
          style={{
            background: "#edaf5e",
            borderRadius: "24px",
            padding: "24px",
            color: "#222",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "32px", lineHeight: "1.2" }}>
            Walk n Earn
          </h1>
          <p style={{ marginTop: "10px", fontSize: "15px", lineHeight: "1.5" }}>
            Walk to your destination, reduce CO₂, and earn points for helping the environment.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "18px",
            padding: "18px",
            marginBottom: "14px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "10px" }}>How it works</h3>
          <p style={{ margin: "8px 0", fontSize: "14px", color: "#555" }}>
            1. Log in and select your destination
          </p>
          <p style={{ margin: "8px 0", fontSize: "14px", color: "#555" }}>
            2. Get a walking estimate with points and CO₂ savings
          </p>
          <p style={{ margin: "8px 0", fontSize: "14px", color: "#555" }}>
            3. Start and end your trip
          </p>
          <p style={{ margin: "8px 0", fontSize: "14px", color: "#555" }}>
            4. Earn points and track your walking history
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "18px",
            padding: "18px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Why use it?</h3>
          <p style={{ margin: "8px 0", fontSize: "14px", color: "#555" }}>
            Save fuel, reduce pollution, stay active, and earn rewards.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button
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
            Login
          </button>
        </Link>

        <Link to="/signup" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              color: "#222",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;