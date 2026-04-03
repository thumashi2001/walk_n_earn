import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const destinations = {
  "Kahanthota Road": {
    lat: 6.9097,
    lng: 79.9729,
    address: "Kahanthota Road",
  },
  Maharagama: {
    lat: 6.848,
    lng: 79.926,
    address: "Maharagama",
  },
  "SLIIT Campus Malabe": {
    lat: 6.9147,
    lng: 79.9729,
    address: "SLIIT Campus Malabe",
  },
  Nugegoda: {
    lat: 6.865,
    lng: 79.8997,
    address: "Nugegoda",
  },
};

function Home() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("walknEarnUser"));

  const [user, setUser] = useState(savedUser);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [tripStarted, setTripStarted] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [trips, setTrips] = useState([]);

  const loadTrips = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch(
        `http://localhost:5050/api/walking/trips?userId=${user._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setTrips(data);
      }
    } catch (error) {
      console.log("Failed to load trips");
    }
  };

  useEffect(() => {
    if (!savedUser) {
      navigate("/");
      return;
    }

    if (!navigator.geolocation) {
      setMessage("Using default location");
      setLocation({ lat: 6.906, lng: 79.9707, address: "Malabe" });
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "Current Location",
          });
        },
        () => {
          setMessage("Using default location");
          setLocation({ lat: 6.906, lng: 79.9707, address: "Malabe" });
        }
      );
    }

    loadTrips();
  }, [navigate]);

  const handleEstimate = async () => {
    if (!location || !selectedDestination) {
      setMessage("Please choose a destination");
      return;
    }

    setMessage("Getting estimate...");
    setEstimate(null);
    setTripId(null);
    setTripStarted(false);
    setFinalResult(null);

    try {
      const endLocation = destinations[selectedDestination];

      const response = await fetch("http://localhost:5050/api/walking/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          startLocation: {
            lat: location.lat,
            lng: location.lng,
            address: location.address || "Current Location",
          },
          endLocation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to get estimate");
        return;
      }

      setEstimate(data.estimate);
      setTripId(data.trip._id);
      setMessage("Estimate ready");
      loadTrips();
    } catch (error) {
      setMessage("Something went wrong while getting estimate");
    }
  };

  const handleStartTrip = () => {
    setTripStarted(true);
    setMessage("Trip started");
  };

  const handleEndTrip = async () => {
    if (!tripId || !location) {
      setMessage("Trip or location missing");
      return;
    }

    setMessage("Ending trip...");

    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const finalLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "Final Location",
          };

          const response = await fetch(
            `http://localhost:5050/api/walking/trips/${tripId}/end`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                endLocation: finalLocation,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setMessage(data.message || "Failed to end trip");
            return;
          }

          setFinalResult(data.actual);
          setMessage("Trip completed successfully");
          setTripStarted(false);

          const updatedUser = {
            ...user,
            totalPoints: (user.totalPoints || 0) + data.actual.points,
            totalCo2SavedKg:
              (user.totalCo2SavedKg || 0) + data.actual.co2SavedKg,
            totalDistanceKm:
              (user.totalDistanceKm || 0) + data.actual.distanceKm,
          };

          localStorage.setItem("walknEarnUser", JSON.stringify(updatedUser));
          setUser(updatedUser);
          loadTrips();
        },
        async () => {
          const fallbackFinalLocation = {
            lat: location.lat + 0.001,
            lng: location.lng + 0.001,
            address: "Final Location",
          };

          const response = await fetch(
            `http://localhost:5050/api/walking/trips/${tripId}/end`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                endLocation: fallbackFinalLocation,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setMessage(data.message || "Failed to end trip");
            return;
          }

          setFinalResult(data.actual);
          setMessage("Trip completed successfully");
          setTripStarted(false);

          const updatedUser = {
            ...user,
            totalPoints: (user.totalPoints || 0) + data.actual.points,
            totalCo2SavedKg:
              (user.totalCo2SavedKg || 0) + data.actual.co2SavedKg,
            totalDistanceKm:
              (user.totalDistanceKm || 0) + data.actual.distanceKm,
          };

          localStorage.setItem("walknEarnUser", JSON.stringify(updatedUser));
          setUser(updatedUser);
          loadTrips();
        }
      );
    } catch (error) {
      setMessage("Something went wrong while ending trip");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("walknEarnUser");
    navigate("/");
  };

  const destinationData = selectedDestination
    ? destinations[selectedDestination]
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div
        style={{
          background: "#edaf5e",
          borderRadius: "18px",
          padding: "16px",
          color: "#222",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Walk n Earn</h2>
            <p style={{ margin: "6px 0 0 0", fontSize: "14px" }}>
              Hi, {user?.fullName}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "#fff",
              borderRadius: "10px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginTop: "12px", fontSize: "14px" }}>
          <p style={{ margin: "4px 0" }}>Points: {user?.totalPoints || 0}</p>
          <p style={{ margin: "4px 0" }}>
            CO₂ Saved: {Number(user?.totalCo2SavedKg || 0).toFixed(3)} kg
          </p>
        </div>
      </div>

      {message && (
        <div
          style={{
            background: "#f5f5f5",
            padding: "12px",
            borderRadius: "12px",
            fontSize: "14px",
          }}
        >
          {message}
        </div>
      )}

      {location && (
        <div
          style={{
            borderRadius: "18px",
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            style={{ height: "320px", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[location.lat, location.lng]}>
              <Popup>Current location</Popup>
            </Marker>

            {destinationData && (
              <Marker position={[destinationData.lat, destinationData.lng]}>
                <Popup>{destinationData.address}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "18px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            fontSize: "16px",
            boxSizing: "border-box",
            marginBottom: "10px",
          }}
        >
          <option value="">Select destination</option>
          {Object.keys(destinations).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          onClick={handleEstimate}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#edaf5e",
            color: "#222",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Get Estimate
        </button>

        {estimate && (
          <div
            style={{
              marginTop: "14px",
              padding: "14px",
              borderRadius: "14px",
              background: "#fff4e3",
              border: "1px solid #f1d2a5",
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Estimate</h4>
            <p style={{ margin: "6px 0" }}>Distance: {estimate.distanceKm} km</p>
            <p style={{ margin: "6px 0" }}>CO₂ Saved: {estimate.co2SavedKg} kg</p>
            <p style={{ margin: "6px 0" }}>Points: {estimate.points}</p>

            {!tripStarted && !finalResult && (
              <button
                onClick={handleStartTrip}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#222",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Start Trip
              </button>
            )}
          </div>
        )}

        {tripStarted && (
          <button
            onClick={handleEndTrip}
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#d9534f",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            End Trip
          </button>
        )}

        {finalResult && (
          <div
            style={{
              marginTop: "14px",
              padding: "14px",
              borderRadius: "14px",
              background: "#eefaf0",
              border: "1px solid #cde8d1",
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Trip Result</h4>
            <p style={{ margin: "6px 0" }}>
              Actual Distance: {finalResult.distanceKm} km
            </p>
            <p style={{ margin: "6px 0" }}>
              Actual CO₂ Saved: {finalResult.co2SavedKg} kg
            </p>
            <p style={{ margin: "6px 0" }}>
              Points Earned: {finalResult.points}
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "18px",
          padding: "16px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Trip History</h3>

        {trips.length === 0 ? (
          <p style={{ color: "#666", fontSize: "14px" }}>No trips yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {trips.slice(0, 5).map((trip) => (
              <div
                key={trip._id}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  background: "#f8f8f8",
                  border: "1px solid #eee",
                }}
              >
                <p style={{ margin: "0 0 6px 0", fontWeight: "600" }}>
                  {trip.startLocation?.address || "Start"} →{" "}
                  {trip.endLocation?.address || "End"}
                </p>
                <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                  Status: {trip.status}
                </p>
                <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                  Estimated: {trip.estimatedDistanceKm} km
                </p>
                <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                  Actual: {trip.actualDistanceKm} km
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;