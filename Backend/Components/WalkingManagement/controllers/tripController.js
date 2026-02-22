const Trip = require("../models/Trip");
const PointTransaction = require("../models/PointTransaction");
const { getWalkingDistanceKm } = require("../services/osrmService");

const createTrip = async (req, res) => {
  try {
    const { userId, startLocation, endLocation, estimatedDistanceKm } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!startLocation?.lat || !startLocation?.lng) {
      return res.status(400).json({ message: "startLocation lat and lng are required" });
    }
    if (!endLocation?.lat || !endLocation?.lng) {
      return res.status(400).json({ message: "endLocation lat and lng are required" });
    }

    // Calculate estimated walking distance using OSRM
    const estimatedDistanceKmAuto = await getWalkingDistanceKm(
    startLocation.lat,
    startLocation.lng,
    endLocation.lat,
    endLocation.lng
    );

    const trip = await Trip.create({
    userId,
    startLocation,
    endLocation,
    estimatedDistanceKm: estimatedDistanceKmAuto,
    status: "active",
    });

    return res.status(201).json(trip);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create trip", error: err.message });
  }
};

const getTripsByUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "userId query param is required" });

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(trips);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch trips", error: err.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedUpdates = [
      "status",
      "endLocation",
      "estimatedDistanceKm",
      "actualDistanceKm",
      "endedAt",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if ((updates.status === "completed" || updates.status === "cancelled") && !updates.endedAt) {
      updates.endedAt = new Date();
    }

    const trip = await Trip.findByIdAndUpdate(id, updates, { new: true });

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    return res.status(200).json(trip);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update trip", error: err.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    return res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete trip", error: err.message });
  }
};
const endTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { endLocation } = req.body;

    if (!endLocation?.lat || !endLocation?.lng) {
      return res.status(400).json({ message: "endLocation lat and lng are required" });
    }

    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.status !== "active") {
      return res.status(400).json({ message: "Trip is not active" });
    }

    // Calculate actual distance using OSRM
    const actualDistanceKm = await getWalkingDistanceKm(
      trip.startLocation.lat,
      trip.startLocation.lng,
      endLocation.lat,
      endLocation.lng
    );

    // Update trip
    trip.endLocation = endLocation;
    trip.actualDistanceKm = actualDistanceKm;
    trip.status = "completed";
    trip.endedAt = new Date();
    await trip.save();

    // Award points (same formula used in pointsController)
    const co2SavedKg = Number((actualDistanceKm * 0.2).toFixed(3));
    const pointsEarned = Math.round(co2SavedKg * 10);

    const tx = await PointTransaction.create({
      userId: trip.userId,
      tripId: trip._id,
      distanceKm: actualDistanceKm,
      co2SavedKg,
      pointsEarned,
      note: "Auto-awarded when trip ended",
    });

    return res.status(200).json({
      message: "Trip completed and points awarded",
      trip,
      pointsTransaction: tx,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to end trip", error: err.message });
  }
};

module.exports = { createTrip, getTripsByUser, updateTrip, deleteTrip, endTrip };