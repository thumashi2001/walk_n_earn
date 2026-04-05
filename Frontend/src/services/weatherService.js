import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api/weather";

/**
 * Logic to get browser coordinates and fetch weather from the backend.
 * Encapsulates the external Geolocation API and Axios calls.
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
          const response = await axios.get(`${API_BASE_URL}/current`, {
            params: { lat: latitude, lon: longitude },
          });

          // Extracting the nested object as per your backend controller
          resolve(response.data.currentWeather);
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
      },
    );
  });
};
