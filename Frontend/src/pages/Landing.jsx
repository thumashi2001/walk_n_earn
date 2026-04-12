import { Link } from "react-router-dom";
import walkingGif from "../assets/walking.gif";

function Landing() {
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
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "22px",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "22px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#8a4b00" }}>
            Walk n Earn
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link to="/about" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                About
              </button>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#edaf5e",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Login
              </button>
            </Link>
          </div>
        </div>

        <div
          className="landing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "22px",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(237,175,94,1) 0%, rgba(255,242,223,1) 100%)",
              borderRadius: "30px",
              padding: "34px",
              position: "relative",
              overflow: "hidden",
              minHeight: "500px",
              boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "7px 12px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.7)",
                fontSize: "12px",
                fontWeight: "700",
                color: "#a85b00",
                marginBottom: "16px",
              }}
            >
              Eco Friendly Walking Platform
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "52px",
                lineHeight: "1.05",
                color: "#d56a00",
                letterSpacing: "-1px",
                maxWidth: "520px",
              }}
            >
              Walk smarter.
              <br />
              Earn rewards.
            </h1>

            <p
              style={{
                marginTop: "16px",
                fontSize: "16px",
                lineHeight: "1.75",
                color: "#444",
                maxWidth: "520px",
              }}
            >
              Walk to your destination, reduce carbon emissions, stay active,
              and collect points for choosing a better way to travel.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "22px",
              }}
            >
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "14px 18px",
                    borderRadius: "14px",
                    border: "none",
                    background: "#222",
                    color: "#fff",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Create Account
                </button>
              </Link>

              <Link to="/login" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "14px 18px",
                    borderRadius: "14px",
                    border: "1px solid #ddd",
                    background: "#fff",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Login
                </button>
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
                }}
              >
                🌱 Save CO₂
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
                }}
              >
                🏆 Earn Points
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
                }}
              >
                🚶 Walk More
              </div>
            </div>

            <img
              src={walkingGif}
              alt="Walking animation"
              style={{
                position: "absolute",
                right: "18px",
                bottom: "0",
                width: "210px",
                maxWidth: "34%",
                objectFit: "contain",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "22px" }}>
                How it works
              </h3>
              <p style={{ margin: "8px 0", color: "#555", lineHeight: "1.7" }}>
                1. Create an account and log in
              </p>
              <p style={{ margin: "8px 0", color: "#555", lineHeight: "1.7" }}>
                2. Search your destination
              </p>
              <p style={{ margin: "8px 0", color: "#555", lineHeight: "1.7" }}>
                3. Get distance, CO₂ and points estimate
              </p>
              <p style={{ margin: "8px 0", color: "#555", lineHeight: "1.7" }}>
                4. Start and end the trip to earn rewards
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "22px" }}>
                Why use it?
              </h3>
              <p style={{ margin: 0, color: "#555", lineHeight: "1.7" }}>
                Walk n Earn encourages healthier travel habits while helping
                reduce short vehicle trips and pollution in urban areas.
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "22px" }}>
                Ready to begin?
              </h3>
              <p style={{ margin: 0, color: "#555", lineHeight: "1.7" }}>
                Sign up now and turn your daily walks into something meaningful.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 900px) {
            .landing-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Landing;