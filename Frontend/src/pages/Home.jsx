import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Home() {
  const user = JSON.parse(localStorage.getItem("walknEarnUser"));

  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage("Using default location");
      setLocation({ lat: 6.906, lng: 79.9707 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setMessage("Using default location");
        setLocation({ lat: 6.906, lng: 79.9707 });
      }
    );
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "6px" }}>Hi 👋</h2>
      <p style={{ marginTop: 0, color: "#666" }}>{user?.fullName}</p>

      {message && (
        <p style={{ fontSize: "14px", color: "#666" }}>{message}</p>
      )}

      {location && (
        <div
          style={{
            marginTop: "16px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={16}
            style={{ height: "320px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {!location && <p>Loading map...</p>}
    </div>
  );
}

export default Home;