import { Link } from "react-router-dom";
import walkingGif from "../assets/walking.gif";

function Landing() {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "10px",
        paddingBottom: "20px",
      }}
    >
      <div>
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(237,175,94,1) 0%, rgba(255,242,223,1) 100%)",
            borderRadius: "28px",
            padding: "24px",
            color: "#222",
            marginBottom: "18px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
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
            Eco Friendly Walking App
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              lineHeight: "1.15",
              fontWeight: "800",
              letterSpacing: "-0.5px",
            }}
          >
            Walk n Earn
          </h1>

          <p
            style={{
              marginTop: "12px",
              marginBottom: "18px",
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#333",
              maxWidth: "280px",
            }}
          >
            Turn every walk into rewards. Save CO₂, stay healthy, and earn points
            for choosing better travel.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "14px",
                padding: "10px 12px",
                fontSize: "13px",
                fontWeight: "600",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              🌱 Save CO₂
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "14px",
                padding: "10px 12px",
                fontSize: "13px",
                fontWeight: "600",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              🎁 Earn Points
            </div>
          </div>

          <img
            src={walkingGif}
            alt="Walking animation"
            style={{
              position: "absolute",
              right: "-8px",
              bottom: "0",
              width: "130px",
              maxWidth: "35%",
              objectFit: "contain",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🚶</div>
            <h3 style={{ margin: 0, fontSize: "15px" }}>Track Walks</h3>
            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                fontSize: "13px",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              Start a trip, walk to your destination, and end it anytime.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📍</div>
            <h3 style={{ margin: 0, fontSize: "15px" }}>Get Estimates</h3>
            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                fontSize: "13px",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              See walking distance, CO₂ savings, and points before you begin.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🌍</div>
            <h3 style={{ margin: 0, fontSize: "15px" }}>Help Environment</h3>
            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                fontSize: "13px",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              Reduce pollution by replacing short vehicle trips with walking.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🏆</div>
            <h3 style={{ margin: 0, fontSize: "15px" }}>Earn Rewards</h3>
            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                fontSize: "13px",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              Collect points from every trip and use them in future features.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "20px",
            padding: "18px",
            marginBottom: "16px",
            boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "10px", fontSize: "17px" }}>
            How it works
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "14px", color: "#555" }}>
              <strong>1.</strong> Log in and search your destination
            </div>
            <div style={{ fontSize: "14px", color: "#555" }}>
              <strong>2.</strong> Get estimate for distance, CO₂, and points
            </div>
            <div style={{ fontSize: "14px", color: "#555" }}>
              <strong>3.</strong> Start and end your walk
            </div>
            <div style={{ fontSize: "14px", color: "#555" }}>
              <strong>4.</strong> Save carbon and earn rewards
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "16px",
              border: "none",
              backgroundColor: "#edaf5e",
              color: "#222",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(237,175,94,0.35)",
            }}
          >
            Login
          </button>
        </Link>

        <Link to="/signup" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "16px",
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

        <Link to="/about" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: "#222",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            About Us
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;