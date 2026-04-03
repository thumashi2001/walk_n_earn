import { useNavigate } from "react-router-dom";
import teamGif from "../assets/team.gif";

function About() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Mahinda Rajapaksha",
      role: "Frontend Wizard",
      desc: "Makes buttons look good and somehow fixes bugs by refreshing twice.",
    },
    {
      name: "Ranil Wickramasinghe",
      role: "Backend Boss",
      desc: "Talks to databases nicely and keeps APIs from getting angry.",
    },
    {
      name: "Anura Kumara",
      role: "Map Master",
      desc: "Knows every road, marker, and random coordinate in the project.",
    },
    {
      name: "Laal Kantha",
      role: "Presentation Hero",
      desc: "Explains everything confidently even when the internet is slow.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingTop: "8px",
        paddingBottom: "10px",
      }}
    >
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
          background:
            "linear-gradient(180deg, rgba(237,175,94,1) 0%, rgba(255,242,223,1) 100%)",
          borderRadius: "26px",
          padding: "22px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.7)",
            fontSize: "12px",
            fontWeight: "700",
            marginBottom: "14px",
          }}
        >
          Meet Our Team
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            lineHeight: "1.15",
            color: "#222",
          }}
        >
          About Walk n Earn
        </h1>

        <p
          style={{
            marginTop: "12px",
            marginBottom: "14px",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#333",
            maxWidth: "250px",
          }}
        >
          Walk n Earn is a simple idea to encourage walking, reduce carbon
          emissions, and reward users for making eco-friendly travel choices.
        </p>

        <img
          src={teamGif}
          alt="Team animation"
          style={{
            position: "absolute",
            right: "-4px",
            bottom: "0",
            width: "130px",
            maxWidth: "35%",
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "20px",
          padding: "18px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Our Idea</h3>
        <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6", margin: 0 }}>
          Our goal is to promote eco-friendly transportation and healthier
          lifestyles by rewarding users for walking instead of using vehicles
          for short trips.
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "20px",
          padding: "18px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>Team Members</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {teamMembers.map((member, index) => (
            <div
              key={index}
              style={{
                background: "#fafafa",
                border: "1px solid #eee",
                borderRadius: "16px",
                padding: "14px",
              }}
            >
              <h4 style={{ margin: "0 0 6px 0", color: "#222" }}>{member.name}</h4>
              <p
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#edaf5e",
                }}
              >
                {member.role}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#666",
                  lineHeight: "1.5",
                }}
              >
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "20px",
          padding: "18px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Why We Built This</h3>
        <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6", margin: 0 }}>
          We wanted to create a small but meaningful app that mixes technology,
          sustainability, and rewards in a simple and user-friendly way.
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "4px",
          padding: "14px",
          borderRadius: "14px",
          border: "none",
          backgroundColor: "#222",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default About;