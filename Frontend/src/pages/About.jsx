import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          background: "#edaf5e",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>About Walk n Earn</h2>
        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Walk n Earn is a simple system that encourages people to walk instead
          of using vehicles. By walking, users can reduce carbon emissions and
          earn reward points.
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Our Idea</h3>
        <p style={{ fontSize: "14px", color: "#555" }}>
          We aim to promote eco-friendly transportation and healthier lifestyles
          by rewarding users for walking.
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "10px",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#222",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default About;