const mongoose = require("mongoose");

const weeklyLeaderboardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  week_start: {
    type: Date,
    required: true,
  },
  week_end: {
    type: Date,
    required: true,
  },
  weekly_points: {
    type: Number,
    default: 0,
  },
  weekly_distance: {
    type: Number,
    default: 0,
  },
  weekly_emission: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

weeklyLeaderboardSchema.index({ user_id: 1, week_start: 1 }, { unique: true });

module.exports = mongoose.model("WeeklyLeaderboard", weeklyLeaderboardSchema);