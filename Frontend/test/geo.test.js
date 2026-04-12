import { getCurrentCoordinates } from "../src/utils/geo";

describe("getCurrentCoordinates", () => {
  let originalGeolocation;

  beforeEach(() => {
    originalGeolocation = global.navigator.geolocation;
  });

  afterEach(() => {
    if (originalGeolocation === undefined) {
      delete global.navigator.geolocation;
    } else {
      global.navigator.geolocation = originalGeolocation;
    }
  });

  it("rejects when geolocation is unavailable", async () => {
    delete global.navigator.geolocation;
    await expect(getCurrentCoordinates()).rejects.toThrow(
      "Geolocation is not supported by your browser."
    );
  });

  it("resolves with latitude and longitude", async () => {
    global.navigator.geolocation = {
      getCurrentPosition(success) {
        success({
          coords: { latitude: 1.23, longitude: 4.56 },
        });
      },
    };
    await expect(getCurrentCoordinates()).resolves.toEqual({
      latitude: 1.23,
      longitude: 4.56,
    });
  });

  it("maps permission denied to a clear message", async () => {
    global.navigator.geolocation = {
      getCurrentPosition(_, error) {
        error({ code: 1 });
      },
    };
    await expect(getCurrentCoordinates()).rejects.toThrow("Location permission denied.");
  });
});
