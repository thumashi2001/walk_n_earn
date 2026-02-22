const axios = require("axios");

// OSRM expects lng,lat order
const getWalkingDistanceKm = async (startLat, startLng, endLat, endLng) => {
  const url =
    `https://router.project-osrm.org/route/v1/foot/` +
    `${startLng},${startLat};${endLng},${endLat}?overview=false`;

  const response = await axios.get(url);

  if (!response.data || response.data.code !== "Ok" || !response.data.routes?.length) {
    throw new Error("OSRM routing failed");
  }

  const meters = response.data.routes[0].distance;
  const km = meters / 1000;
  return Number(km.toFixed(3));
};

module.exports = { getWalkingDistanceKm };