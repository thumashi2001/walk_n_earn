import { Link } from "react-router-dom";
import walkingGif from "../assets/walking.gif";

function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f1e6",
        padding: "18px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "24px",
            padding: "16px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
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
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "20px",
          }}
          className="landing-grid"
        >
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(237,175,94,1) 0%, rgba(255,242,223,1) 100%)",
              borderRadius: "28px",
              padding: "28px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              minHeight: "420px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#c06b00",
              }}
            >
              Eco Friendly Walking Platform
            </p>

            <h1
              style={{
                marginTop: "14px",
                marginBottom: "12px",
                fontSize: "52px",
                lineHeight: "1.05",
                color: "#d56a00",
              }}
            >
              Walk more.
              <br />
              Earn more.
            </h1>

            <p
              style={{
                maxWidth: "460px",
                fontSize: "16px",
                color: "#444",
                lineHeight: "1.7",
                marginBottom: "18px",
              }}
            >
              Walk to your destination, reduce CO₂ emissions, stay healthy, and
              collect points for choosing eco-friendly travel.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "14px 18px",
                    borderRadius: "14px",
                    border: "none",
                    backgroundColor: "#222",
                    color: "#fff",
                    fontSize: "15px",
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
                    backgroundColor: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Login
                </button>
              </Link>
            </div>

            <img
              src={walkingGif}
              alt="Walking animation"
              style={{
                position: "absolute",
                right: "10px",
                bottom: "0",
                width: "190px",
                maxWidth: "36%",
                objectFit: "contain",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "22px",
                padding: "20px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>How it works</h3>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.7" }}>
                1. Sign in and search your destination
                <br />
                2. Get a walking estimate with CO₂ savings
                <br />
                3. Start and end your trip
                <br />
                4. Earn points and track history
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "22px",
                padding: "20px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Why use it?</h3>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.7" }}>
                Walk n Earn encourages eco-friendly travel and rewards users for
                walking instead of using vehicles for short trips.
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "22px",
                padding: "20px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Ready to start?</h3>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.7" }}>
                Join now and turn every walk into points.
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