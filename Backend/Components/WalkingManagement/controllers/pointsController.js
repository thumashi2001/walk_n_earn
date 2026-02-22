const PointTransaction = require("../models/PointTransaction");

// Simple formula for assignment:
// Assume 1 km by car = 0.2 kg CO2 saved when walking (custom, easy to explain)
// Points = co2SavedKg * 10 (also easy to explain)
const calcCO2SavedKg = (distanceKm) => distanceKm * 0.2;
const calcPoints = (co2SavedKg) => Math.round(co2SavedKg * 10);

const createPointsFromTrip = async (req, res) => {
  try {
    const { userId, tripId, distanceKm } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!tripId) return res.status(400).json({ message: "tripId is required" });
    if (distanceKm === undefined) return res.status(400).json({ message: "distanceKm is required" });

    const dist = Number(distanceKm);
    if (Number.isNaN(dist) || dist <= 0) {
      return res.status(400).json({ message: "distanceKm must be a positive number" });
    }

    const co2SavedKg = Number(calcCO2SavedKg(dist).toFixed(3));
    const pointsEarned = calcPoints(co2SavedKg);

    const tx = await PointTransaction.create({
      userId,
      tripId,
      distanceKm: dist,
      co2SavedKg,
      pointsEarned,
      note: "Earned by walking trip",
    });

    return res.status(201).json(tx);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create points", error: err.message });
  }
};

const getPointsByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId query param is required" });

    const list = await PointTransaction.find({ userId }).sort({ createdAt: -1 });

    const totals = list.reduce(
      (acc, item) => {
        acc.totalDistanceKm += item.distanceKm;
        acc.totalCo2SavedKg += item.co2SavedKg;
        acc.totalPoints += item.pointsEarned;
        return acc;
      },
      { totalDistanceKm: 0, totalCo2SavedKg: 0, totalPoints: 0 }
    );

    totals.totalDistanceKm = Number(totals.totalDistanceKm.toFixed(3));
    totals.totalCo2SavedKg = Number(totals.totalCo2SavedKg.toFixed(3));

    return res.status(200).json({ totals, transactions: list });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch points", error: err.message });
  }
};

const updatePointTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedUpdates = ["note"];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const tx = await PointTransaction.findByIdAndUpdate(id, updates, { new: true });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    return res.status(200).json(tx);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update transaction", error: err.message });
  }
};

const deletePointTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const tx = await PointTransaction.findByIdAndDelete(id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    return res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete transaction", error: err.message });
  }
};

module.exports = {
  createPointsFromTrip,
  getPointsByUser,
  updatePointTransaction,
  deletePointTransaction,
};