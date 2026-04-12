const { haversineKm } = require("../Components/WalkingManagement/utils/distanceUtils");

describe("haversineKm", () => {
  it("returns 0 for identical coordinates", () => {
    expect(haversineKm(40.7128, -74.006, 40.7128, -74.006)).toBe(0);
  });

  it("computes a known short distance (NYC blocks order of magnitude)", () => {
    const km = haversineKm(40.758, -73.9855, 40.7484, -73.9857);
    expect(km).toBeGreaterThan(0.5);
    expect(km).toBeLessThan(2);
  });

  it("returns a number rounded to three decimals", () => {
    const km = haversineKm(51.5074, -0.1278, 48.8566, 2.3522);
    expect(String(km)).toMatch(/^\d+(\.\d{1,3})?$/);
  });
});
