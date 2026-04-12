const {
  validateHealthAdviceRequest,
} = require("../Components/Weather/admin/validators/healthAdviceValidator");

const validBase = () => ({
  title: "Stay hydrated",
  advice: "Drink water regularly.",
  category: "Temperature",
  severity: "Normal",
  priority: 2,
  trigger: {
    parameter: "Temperature",
    conditionType: "RANGE",
    range: { min: 30, max: 40 },
  },
});

describe("validateHealthAdviceRequest", () => {
  it("returns no errors for a valid payload", () => {
    expect(validateHealthAdviceRequest(validBase())).toEqual([]);
  });

  it("requires title and advice", () => {
    const data = { ...validBase(), title: "   ", advice: "" };
    const errors = validateHealthAdviceRequest(data);
    expect(errors).toContain("Title is required.");
    expect(errors).toContain("Advice is required.");
  });

  it("rejects invalid category", () => {
    const errors = validateHealthAdviceRequest({
      ...validBase(),
      category: "Invalid",
    });
    expect(errors.some((e) => e.includes("Category must be one of"))).toBe(true);
  });

  it("requires WeatherCondition to use EXACT and a valid exactValue", () => {
    const errors = validateHealthAdviceRequest({
      ...validBase(),
      trigger: {
        parameter: "WeatherCondition",
        conditionType: "RANGE",
        range: { min: 0, max: 1 },
      },
    });
    expect(errors).toContain("WeatherCondition must use EXACT conditionType.");
  });

  it("validates timeStart format", () => {
    const errors = validateHealthAdviceRequest({
      ...validBase(),
      timeStart: "9:30",
    });
    expect(errors).toContain("timeStart must be in HH:mm format.");
  });
});
