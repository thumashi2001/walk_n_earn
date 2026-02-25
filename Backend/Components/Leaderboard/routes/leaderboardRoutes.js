const express = require("express");
const router = express.Router();

const {
  updateWeeklyLeaderboard,
  getTop10,
  getUserRank,
  adminUpdateWeeklyPoints,
  deleteWeeklyRecord,
} = require("../controllers/leaderboardController");

//CREATE / UPDATE (User activity update)
router.post("/update", async (req, res) => {
  try {
    const { userId, points, distance, emission } = req.body;

    await updateWeeklyLeaderboard(userId, points, distance, emission);

    res.status(200).json({ message: "Leaderboard updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update leaderboard",
      error: err.message,
    });
  }
});

//READ - Top 10
router.get("/top10", getTop10);

//READ - Specific user rank
router.get("/rank/:userId", getUserRank);

//UPDATE - Admin manual update
router.put("/admin/update", adminUpdateWeeklyPoints);

//DELETE - Delete weekly record
router.delete("/delete", deleteWeeklyRecord);

module.exports = router;  