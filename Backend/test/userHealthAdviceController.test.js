jest.mock("../Components/Weather/user/services/weatherService", () => ({
  fetchCurrentWeather: jest.fn(),
}));
jest.mock("../Components/Weather/admin/models/HealthAdvice", () => ({
  find: jest.fn(),
}));

const { fetchCurrentWeather } = require("../Components/Weather/user/services/weatherService");
const HealthAdvice = require("../Components/Weather/admin/models/HealthAdvice");
const getHealthAdviceForCurrentWeather = require("../Components/Weather/user/controllers/userHealthAdviceController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("userHealthAdviceController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires lat and lon", async () => {
    const res = mockRes();
    await getHealthAdviceForCurrentWeather({ query: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns matching advice for temperature trigger", async () => {
    fetchCurrentWeather.mockResolvedValue({
      temperature: 28,
      humidity: 50,
      wind_speed: 10,
      weather_condition: "Clear",
    });
    HealthAdvice.find.mockResolvedValue([
      {
        _id: "a1",
        active: true,
        priority: 1,
        trigger: {
          parameter: "Temperature",
          conditionType: "RANGE",
          range: { min: 20, max: 30 },
        },
      },
    ]);
    const res = mockRes();
    await getHealthAdviceForCurrentWeather({ query: { lat: "1", lon: "2" } }, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        count: 1,
        matchingAdvice: expect.arrayContaining([expect.objectContaining({ _id: "a1" })]),
      })
    );
  });
});
