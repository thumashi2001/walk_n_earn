const { fetchCurrentWeather } = require("../services/weatherService");

const getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const currentWeather = await fetchCurrentWeather(lat, lon);

    res.json({ currentWeather });
  } catch (error) {
    console.error("Error fetching current weather:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCurrentWeather };
