const HealthAdvice = require("../../admin/models/HealthAdvice"); // Adjust path
const { fetchCurrentWeather } = require("../services/weatherService"); // your existing service

// Get Health Advice for Current Weather

const getHealthAdviceForCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude are required" });
    }

    // 1. Fetch current weather using the existing service
    const currentWeather = await fetchCurrentWeather(lat, lon);

    // 2. Fetch active health advices from MongoDB
    const advices = await HealthAdvice.find({ active: true });

    // 3. Filter advices that match the current weather
    const matchingAdvice = advices.filter((advice) => {
      const trigger = advice.trigger;

      switch (trigger.parameter) {
        case "Temperature": {
          const min = trigger.range?.min ?? -Infinity;
          const max = trigger.range?.max ?? Infinity;
          return (
            currentWeather.temperature >= min &&
            currentWeather.temperature <= max
          );
        }
        case "WeatherCondition":
          return trigger.exactValue === currentWeather.weather_condition;
        case "Humidity": {
          const min = trigger.range?.min ?? -Infinity;
          const max = trigger.range?.max ?? Infinity;
          return (
            currentWeather.humidity >= min && currentWeather.humidity <= max
          );
        }
        case "Wind": {
          const min = trigger.range?.min ?? -Infinity;
          const max = trigger.range?.max ?? Infinity;
          return (
            currentWeather.wind_speed >= min && currentWeather.wind_speed <= max
          );
        }
      }
    });

    // 4. Send response
    res.json({
      success: true,
      currentWeather,
      matchingAdvice,
      count: matchingAdvice.length,
    });
  } catch (error) {
    console.error("Error fetching health advice:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch health advice" });
  }
};


module.exports = getHealthAdviceForCurrentWeather;
