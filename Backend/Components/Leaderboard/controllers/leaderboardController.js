const WeeklyLeaderboard = require("../models/weeklyLeaderboard");
const mongoose = require("mongoose");

/**
 * Helper: Get current week range (Monday → Sunday)
 */
const getWeekRange = () => {
  const now = new Date();
  const current = new Date(now);

  const day = current.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);

  const weekStart = new Date(current.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
};

/**
 * CREATE / UPDATE WEEKLY LEADERBOARD
 * (Equivalent to SQL ON DUPLICATE KEY UPDATE)
 */
const updateWeeklyLeaderboard = async (
  userId,
  points,
  distance,
  emission
) => {
  const { weekStart, weekEnd } = getWeekRange();

  await WeeklyLeaderboard.findOneAndUpdate(
    {
      user_id: new mongoose.Types.ObjectId(userId),
      week_start: weekStart,
    },
    {
      $inc: {
        weekly_points: points,
        weekly_distance: distance,
        weekly_emission: emission,
      },
      $setOnInsert: {
        week_end: weekEnd,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
};

/**
 * GET TOP 10 THIS WEEK
 */
const getTop10 = async (req, res) => {
  try {
    const { weekStart } = getWeekRange();

    const leaderboard = await WeeklyLeaderboard.aggregate([
      { $match: { week_start: weekStart } },
      { $sort: { weekly_points: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$user._id",
          name: "$user.name",
          weekly_points: 1,
          weekly_distance: 1,
          weekly_emission: 1,
        },
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch leaderboard",
      error: err.message,
    });
  }
};

/**
 * GET SPECIFIC USER RANK
 */
const getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;
    const { weekStart } = getWeekRange();

    const allUsers = await WeeklyLeaderboard.find({
      week_start: weekStart,
    }).sort({ weekly_points: -1 });

    const index = allUsers.findIndex(
      (u) => u.user_id.toString() === userId
    );

    if (index === -1) {
      return res.status(404).json({
        message: "User not found in leaderboard",
      });
    }

    res.status(200).json({
      userId,
      rank: index + 1,
      weekly_points: allUsers[index].weekly_points,
      weekly_distance: allUsers[index].weekly_distance,
      weekly_emission: allUsers[index].weekly_emission,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user rank",
      error: err.message,
    });
  }
};

/**
 * ADMIN: MANUAL UPDATE POINTS
 */
const adminUpdateWeeklyPoints = async (req, res) => {
  try {
    const { userId, weekStart, newPoints } = req.body;

    const updated = await WeeklyLeaderboard.findOneAndUpdate(
      {
        user_id: userId,
        week_start: new Date(weekStart),
      },
      {
        $set: { weekly_points: newPoints },
      },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Record not found" });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update leaderboard",
      error: err.message,
    });
  }
};

/**
 * DELETE WEEK RECORD
 */
const deleteWeeklyRecord = async (req, res) => {
  try {
    const { userId, weekStart } = req.body;

    await WeeklyLeaderboard.findOneAndDelete({
      user_id: userId,
      week_start: new Date(weekStart),
    });

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete record",
      error: err.message,
    });
  }
};

module.exports = {
  updateWeeklyLeaderboard,
  getTop10,
  getUserRank,
  adminUpdateWeeklyPoints,
  deleteWeeklyRecord,
};