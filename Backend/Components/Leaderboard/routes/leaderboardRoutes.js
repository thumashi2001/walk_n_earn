const express = require("express");
const router = express.Router();

const {
  getTop10,
  getUserRank,
} = require("../controllers/leaderboardController");

router.get("/top10", getTop10);
router.get("/rank/:userId", getUserRank);

module.exports = router;