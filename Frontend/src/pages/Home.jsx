import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  const user = JSON.parse(localStorage.getItem("walknEarnUser"));

  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [tripId, setTripId] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage("Using default location");
      setLocation({ lat: 6.906, lng: 79.9707, address: "Malabe" });
      return;
    }

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
  }, []);

  const handleEstimate = async () => {
    if (!location || !selectedDestination) {
      setMessage("Please choose a destination");
      return;
    }

    setMessage("Getting estimate...");
    setEstimate(null);

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
    } catch (error) {
      setMessage("Something went wrong while getting estimate");
    }
  };

  const destinationData = selectedDestination
    ? destinations[selectedDestination]
    : null;

  return (
    <div>
      <h2 style={{ marginBottom: "6px" }}>Hi 👋</h2>
      <p style={{ marginTop: 0, color: "#666" }}>{user?.fullName}</p>

      {message && (
        <p style={{ fontSize: "14px", color: "#666" }}>{message}</p>
      )}

      <div
        style={{
          marginTop: "14px",
          marginBottom: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
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
      </div>

      {estimate && (
        <div
          style={{
            marginBottom: "14px",
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
          <p style={{ margin: "6px 0", fontSize: "12px", color: "#666" }}>
            Trip ID: {tripId}
          </p>
        </div>
      )}

      {location && (
        <div
          style={{
            borderRadius: "16px",
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

      {!location && <p>Loading map...</p>}
    </div>
  );
}

export default Home;