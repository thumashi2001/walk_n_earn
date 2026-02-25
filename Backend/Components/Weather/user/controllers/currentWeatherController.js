const axios = require("axios");
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude required" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data || !data.main) {
      return res.status(500).json({ message: "Weather data not found" });
    }

    // Convert wind speed from m/s to km/h
    const windSpeedKmH = data.wind.speed * 3.6;

    res.json({
      currentWeather: {
        temperature: data.main.temp, // °C
        feels_like: data.main.feels_like,
        humidity: data.main.humidity, // %
        wind_speed: windSpeedKmH, // km/h
        uv_index: null, // free plan doesn't provide UV
        weather_condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      },
    });
  } catch (error) {
    console.error("Error fetching current weather:", error.message);
    res.status(500).json({ message: "Failed to fetch current weather" });
  }
};

module.exports = { getCurrentWeather };
