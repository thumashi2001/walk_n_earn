const axios = require("axios");
const { getWalkingDistanceKm } = require("../Components/WalkingManagement/services/osrmService");

jest.mock("axios");

describe("osrmService getWalkingDistanceKm", () => {
  it("returns km from OSRM when response is Ok", async () => {
    axios.get.mockResolvedValue({
      data: { code: "Ok", routes: [{ distance: 2500 }] },
    });
    const km = await getWalkingDistanceKm(1, 2, 1.001, 2.001);
    expect(km).toBe(2.5);
    expect(axios.get).toHaveBeenCalled();
  });

  it("falls back to haversine when OSRM fails", async () => {
    axios.get.mockRejectedValue(new Error("network"));
    const km = await getWalkingDistanceKm(40.7, -74, 40.71, -74.01);
    expect(typeof km).toBe("number");
    expect(km).toBeGreaterThan(0);
  });
});
