function AppAbout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(237,175,94,0.2) 0%, rgba(255,255,255,1) 100%)",
          borderRadius: "22px",
          padding: "22px",
          border: "1px solid #eee",
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
          About
        </p>

        <h1 style={{ margin: 0, fontSize: "32px", color: "#d56a00" }}>
          Walk n Earn
        </h1>

        <p style={{ marginTop: "10px", color: "#555", lineHeight: "1.7" }}>
          Walk n Earn encourages people to walk instead of using vehicles for
          short distances. This helps reduce pollution, improve health, and earn
          rewards at the same time.
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "18px",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginTop: 0 }}>What you can do</h3>

        <p style={{ color: "#555", lineHeight: "1.7" }}>
          • Track walking trips  
          • Earn reward points  
          • Reduce CO₂ emissions  
          • Compete with others (leaderboard coming soon)
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "18px",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Future features</h3>

        <p style={{ color: "#555", lineHeight: "1.7" }}>
          Rewards redemption, leaderboard rankings, and admin management tools
          will be added by the team.
        </p>
      </div>
    </div>
  );
}

export default AppAbout;