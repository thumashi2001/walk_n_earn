/**
 * Utility to get current browser coordinates.
 */
export const getCurrentCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (geoError) => {
        const msg =
          geoError.code === 1
            ? "Location permission denied."
            : "Could not determine your location.";
        reject(new Error(msg));
      }
    );
  });
};