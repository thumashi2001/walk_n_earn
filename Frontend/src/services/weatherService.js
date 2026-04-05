import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api/weather";

/**
 * Logic to get browser coordinates, fetch weather from the backend,
 * and perform reverse geocoding to get the location name.
 */
export const getLiveWeatherDetails = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // 1. Fetch weather from your backend (existing functionality)
          const weatherResponse = await axios.get(`${API_BASE_URL}/current`, {
            params: { lat: latitude, lon: longitude },
          });

          // 2. Fetch location name via Reverse Geocoding (new functionality)
          let locationName = "Unknown Location";
          try {
            const geoResponse = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            // Extract the most relevant name (city, town, or village)
            locationName = 
              geoResponse.data.address.city || 
              geoResponse.data.address.town || 
              geoResponse.data.address.village || 
              "Local Area";
          } catch (geoErr) {
            console.error("Geocoding failed, using default name.");
          }

          // 3. Merge and resolve
          resolve({
            ...weatherResponse.data.currentWeather,
            locationName: locationName // Now available in your UI
          });

        } catch (error) {
          const msg =
            error.response?.data?.message ||
            "Failed to fetch weather from server.";
          reject(new Error(msg));
        }
      },
      (geoError) => {
        const msg =
          geoError.code === 1
            ? "Location permission denied."
            : "Could not determine your location.";
        reject(new Error(msg));
      }
    );
  });
};