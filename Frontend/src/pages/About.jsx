import { useNavigate } from "react-router-dom";
import teamGif from "../assets/team.gif";

function About() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f1e6",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              border: "none",
              background: "#eee",
              borderRadius: "10px",
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            ← Home
          </button>

          <h2 style={{ margin: 0 }}>About</h2>
        </div>

        {/* MAIN CARD */}
        <div
          style={{
            background: "#fff",
            borderRadius: "28px",
            padding: "30px",
            border: "1px solid #eee",
            boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginTop: 0, color: "#d56a00" }}>
            Walk n Earn 🚶
          </h1>

          <p style={{ color: "#555", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
            Walk n Earn is a simple system that encourages people to walk instead
            of using vehicles. By walking, users reduce carbon emissions and
            earn points as rewards.
          </p>

          <img
            src={teamGif}
            alt="Team"
            style={{
              marginTop: "20px",
              width: "200px",
              maxWidth: "100%",
            }}
          />
        </div>

        {/* TEAM */}
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid #eee",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Our Team</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            {[
              "Mahinda DevOps",
              "Ranil UI Designer",
              "Gotabaya Backend",
              "Sajith Tester",
            ].map((name) => (
              <div
                key={name}
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  background: "#f8f8f8",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;