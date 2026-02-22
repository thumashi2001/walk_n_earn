const mongoose = require("mongoose");

const pointTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Trip",
    },

    distanceKm: { type: Number, required: true },

    co2SavedKg: { type: Number, required: true },

    pointsEarned: { type: Number, required: true },

    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PointTransaction", pointTransactionSchema);