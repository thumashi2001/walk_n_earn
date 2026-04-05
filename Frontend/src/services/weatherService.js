import axios from "axios";
import { getCurrentCoordinates } from "../utils/geo";

const API_BASE_URL = "http://localhost:5050/api/weather";

export const getLiveWeatherDetails = async () => {
  try {
    // 1. Get coordinates from our shared utility
    const { latitude, longitude } = await getCurrentCoordinates();

    // 2. Fetch weather from your backend (Existing logic)
    const weatherResponse = await axios.get(`${API_BASE_URL}/current`, {
      params: { lat: latitude, lon: longitude },
    });

    // 3. Fetch location name via Reverse Geocoding (Existing logic)
    let locationName = "Unknown Location";
    try {
      const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      locationName = 
        geoResponse.data.address.city || 
        geoResponse.data.address.town || 
        geoResponse.data.address.village || 
        "Local Area";
    } catch (geoErr) {
      console.error("Geocoding failed, using default name.");
    }

    // 4. Merge and return
    return {
      ...weatherResponse.data.currentWeather,
      locationName: locationName 
    };

  } catch (error) {
    // Preserving your specific error handling logic
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch weather from server.";
    throw new Error(msg);
  }
};