jest.mock("../Components/Weather/user/services/weatherService", () => ({
  fetchCurrentWeather: jest.fn(),
}));

const { fetchCurrentWeather } = require("../Components/Weather/user/services/weatherService");
const { getCurrentWeather } = require("../Components/Weather/user/controllers/currentWeatherController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("currentWeatherController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("returns currentWeather payload", async () => {
    fetchCurrentWeather.mockResolvedValue({ temperature: 20, weather_condition: "Clear" });
    const res = mockRes();
    await getCurrentWeather({ query: { lat: "1", lon: "2" } }, res);
    expect(fetchCurrentWeather).toHaveBeenCalledWith("1", "2");
    expect(res.json).toHaveBeenCalledWith({
      currentWeather: { temperature: 20, weather_condition: "Clear" },
    });
  });

  it("maps service errors to 500", async () => {
    fetchCurrentWeather.mockRejectedValue(new Error("boom"));
    const res = mockRes();
    await getCurrentWeather({ query: { lat: "1", lon: "2" } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "boom" });
  });
});
