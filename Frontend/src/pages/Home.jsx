import { useEffect, useState } from "react";

function Home() {
  const user = JSON.parse(localStorage.getItem("walknEarnUser"));

  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [tripStarted, setTripStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setLocation({
          lat: 6.9060,
          lng: 79.9707,
        });
      }
    );
  }, []);

  const handleGetEstimate = async () => {
    setMessage("Getting estimate...");

    try {
      const res = await fetch("http://localhost:5050/api/walking/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          startLocation: {
            lat: location.lat,
            lng: location.lng,
            address: "Current",
          },
          endLocation: {
            lat: location.lat + 0.002,
            lng: location.lng + 0.002,
            address: destination,
          },
        }),
      });

      const data = await res.json();

      setEstimate(data.estimate);
      setTripId(data.trip._id);
      setMessage("Estimate ready");
    } catch {
      setMessage("Error");
    }
  };

  const handleStart = () => {
    setTripStarted(true);
    setMessage("Trip started 🚶");
  };

  const handleEnd = async () => {
    setMessage("Ending trip...");

    try {
      const res = await fetch(
        `http://localhost:5050/api/walking/trips/${tripId}/end`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endLocation: {
              lat: location.lat + 0.001,
              lng: location.lng + 0.001,
              address: "End",
            },
          }),
        }
      );

      const data = await res.json();

      setResult(data.actual);
      setMessage("Trip completed 🎉");
    } catch {
      setMessage("Failed to end trip");
    }
  };

  return (
    <div>
      <h2>Hi 👋</h2>
      <p>{user?.fullName}</p>

      <input
        placeholder="Enter destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginTop: "20px",
        }}
      />

      <button
        onClick={handleGetEstimate}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          background: "#edaf5e",
          border: "none",
          fontWeight: "700",
        }}
      >
        Get Estimate
      </button>

      {estimate && !tripStarted && (
        <div style={{ marginTop: "20px" }}>
          <p>Distance: {estimate.distanceKm} km</p>
          <p>CO₂: {estimate.co2SavedKg}</p>
          <p>Points: {estimate.points}</p>

          <button
            onClick={handleStart}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: "green",
              color: "#fff",
              border: "none",
            }}
          >
            Start Trip
          </button>
        </div>
      )}

      {tripStarted && !result && (
        <button
          onClick={handleEnd}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "red",
            color: "#fff",
            border: "none",
          }}
        >
          End Trip
        </button>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h4>Result 🎉</h4>
          <p>Distance: {result.distanceKm} km</p>
          <p>CO₂ Saved: {result.co2SavedKg}</p>
          <p>Points Earned: {result.points}</p>
        </div>
      )}

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default Home;