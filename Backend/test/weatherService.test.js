process.env.OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "test-owm-key";

const axios = require("axios");
const { fetchCurrentWeather } = require("../Components/Weather/user/services/weatherService");

jest.mock("axios");

describe("weatherService fetchCurrentWeather", () => {
  it("throws when lat or lon missing", async () => {
    await expect(fetchCurrentWeather()).rejects.toThrow(/Latitude and Longitude required/);
  });

  it("maps OpenWeather response", async () => {
    axios.get.mockResolvedValue({
      data: {
        main: { temp: 10, feels_like: 9, humidity: 60 },
        wind: { speed: 2 },
        weather: [{ main: "Rain", description: "light rain", icon: "10d" }],
        sys: { sunrise: 1, sunset: 2 },
      },
    });
    const out = await fetchCurrentWeather("6.9", "79.8");
    expect(out.temperature).toBe(10);
    expect(out.weather_condition).toBe("Rain");
    expect(out.wind_speed).toBeCloseTo(7.2, 5);
  });
});
