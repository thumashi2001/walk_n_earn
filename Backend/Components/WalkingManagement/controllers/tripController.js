const Trip = require("../models/Trip");

const createTrip = async (req, res) => {
  try {
    const { userId, startLocation, endLocation, estimatedDistanceKm } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!startLocation?.lat || !startLocation?.lng) {
      return res.status(400).json({ message: "startLocation lat and lng are required" });
    }
    if (!endLocation?.lat || !endLocation?.lng) {
      return res.status(400).json({ message: "endLocation lat and lng are required" });
    }

    const trip = await Trip.create({
      userId,
      startLocation,
      endLocation,
      estimatedDistanceKm: estimatedDistanceKm || 0,
      status: "active",
    });

    return res.status(201).json(trip);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create trip", error: err.message });
  }
};

module.exports = { createTrip };