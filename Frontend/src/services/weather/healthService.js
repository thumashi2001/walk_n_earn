import API from "../api"; // Import your centralized instance
import { getCurrentCoordinates } from "../../utils/geo";

// Path relative to baseURL: "http://localhost:5050/api"
const ENDPOINT = "/user/health-advice/current";

export const getMatchingHealthAdvice = async () => {
  try {
    // 1. Get coordinates from the shared utility
    const { latitude, longitude } = await getCurrentCoordinates();

    // 2. Fetch advice using centralized API instance
    // Token and Base URL are handled automatically
    const response = await API.get(ENDPOINT, {
      params: { lat: latitude, lon: longitude },
    });

    // Returns matchingAdvice array from your backend controller
    return response.data.matchingAdvice || [];
  } catch (error) {
    const msg = error.response?.data?.message || "Could not load health tips.";
    throw new Error(msg);
  }
};