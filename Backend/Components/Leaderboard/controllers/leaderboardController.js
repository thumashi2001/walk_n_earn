const WeeklyLeaderboard = require("../models/weeklyLeaderboard");
const mongoose = require("mongoose");
const { sendTop5Email } = require("../../../utils/emailService");

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
      returnDocument: "after",
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
          name: "$user.fullName",
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
 * ADMIN: CREATE A LEADERBOARD ENTRY (exact values, no increment)
 */
const createLeaderboardEntry = async (req, res) => {
  try {
    const { userId, points, distance, emission } = req.body;
    const { weekStart, weekEnd } = getWeekRange();

    const exists = await WeeklyLeaderboard.findOne({
      user_id: userId,
      week_start: weekStart,
    });

    if (exists) {
      return res.status(409).json({
        message: "A leaderboard record already exists for this user this week. Use PUT /:id to update it.",
        existingId: exists._id,
      });
    }

    const record = await WeeklyLeaderboard.create({
      user_id: userId,
      week_start: weekStart,
      week_end: weekEnd,
      weekly_points: points || 0,
      weekly_distance: distance || 0,
      weekly_emission: emission || 0,
    });

    res.status(201).json({
      message: "Leaderboard entry created successfully",
      data: record,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create leaderboard entry",
      error: err.message,
    });
  }
};

/**
 * ADMIN: GET ALL LEADERBOARD RECORDS (current week, sorted)
 */
const getAllRecords = async (req, res) => {
  try {
    const { weekStart } = getWeekRange();

    const records = await WeeklyLeaderboard.aggregate([
      { $match: { week_start: weekStart } },
      { $sort: { weekly_points: -1 } },
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
          _id: 1,
          userId: "$user._id",
          name: "$user.fullName",
          email: "$user.email",
          weekly_points: 1,
          weekly_distance: 1,
          weekly_emission: 1,
          week_start: 1,
          week_end: 1,
        },
      },
    ]);

    res.status(200).json({ count: records.length, data: records });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch leaderboard records",
      error: err.message,
    });
  }
};

/**
 * ADMIN: MANUAL UPDATE POINTS (uses record _id from route param)
 */
const adminUpdateWeeklyPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPoints, newDistance, newEmission } = req.body;

    const updateFields = {};
    if (newPoints  !== undefined) updateFields.weekly_points   = newPoints;
    if (newDistance !== undefined) updateFields.weekly_distance = newDistance;
    if (newEmission !== undefined) updateFields.weekly_emission = newEmission;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No update fields provided (newPoints, newDistance, newEmission)" });
    }

    const updated = await WeeklyLeaderboard.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ message: "Leaderboard record updated", data: updated });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update leaderboard",
      error: err.message,
    });
  }
};

/**
 * ADMIN: DELETE A WEEK RECORD BY ID
 */
const deleteWeeklyRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await WeeklyLeaderboard.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ message: "Leaderboard record deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete record",
      error: err.message,
    });
  }
};

/**
 * NOTIFY TOP 5 — Send congratulatory emails to this week's top 5
 */
const notifyTop5 = async (req, res) => {
  try {
    const { weekStart } = getWeekRange();

    const top5 = await WeeklyLeaderboard.aggregate([
      { $match: { week_start: weekStart } },
      { $sort: { weekly_points: -1 } },
      { $limit: 5 },
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
          fullName: "$user.fullName",
          email: "$user.email",
          weekly_points: 1,
        },
      },
    ]);

    if (top5.length === 0) {
      return res.status(404).json({ message: "No leaderboard data for this week." });
    }

    const results = [];
    for (let i = 0; i < top5.length; i++) {
      const u = top5[i];
      const rank = i + 1;
      try {
        await sendTop5Email(u.email, u.fullName, rank, u.weekly_points);
        results.push({ rank, name: u.fullName, email: u.email, status: "sent" });
      } catch (err) {
        results.push({ rank, name: u.fullName, email: u.email, status: "failed", error: err.message });
      }
    }

    res.status(200).json({
      message: `Emails processed for ${top5.length} top users.`,
      results,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to send top-5 notifications",
      error: err.message,
    });
  }
};

module.exports = {
  updateWeeklyLeaderboard,
  createLeaderboardEntry,
  getAllRecords,
  getTop10,
  getUserRank,
  adminUpdateWeeklyPoints,
  deleteWeeklyRecord,
  notifyTop5,
};