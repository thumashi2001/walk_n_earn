import axios from "axios";
import { getCurrentCoordinates } from "../../utils/geo";

const API_BASE_URL = "http://localhost:5050/api/user/health-advice";

export const getMatchingHealthAdvice = async () => {
  try {
    // 1. Get coordinates from the shared utility
    const { latitude, longitude } = await getCurrentCoordinates();

    // 2. Fetch advice from your specific backend endpoint
    const response = await axios.get(`${API_BASE_URL}/current`, {
      params: { lat: latitude, lon: longitude },
    });

    // Returns matchingAdvice array from your backend controller
    return response.data.matchingAdvice || [];
  } catch (error) {
    const msg = error.response?.data?.message || "Could not load health tips.";
    throw new Error(msg);
  }
};
