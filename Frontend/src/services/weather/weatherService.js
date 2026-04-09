import axios from "axios"; // Keep standard axios only for external 3rd party calls
import API from "../api";   // Use your API instance for your own backend
import { getCurrentCoordinates } from "../../utils/geo";

const ENDPOINT = "/weather/current";

export const getLiveWeatherDetails = async () => {
  try {
    // 1. Get coordinates from our shared utility
    const { latitude, longitude } = await getCurrentCoordinates();

    // 2. Fetch weather from YOUR backend using centralized API
    const weatherResponse = await API.get(ENDPOINT, {
      params: { lat: latitude, lon: longitude },
    });

    // 3. Fetch location name via Reverse Geocoding 
    // We use standard 'axios' here because this is an external API, not our backend
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
      locationName: locationName,
    };
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch weather from server.";
    throw new Error(msg);
  }
};