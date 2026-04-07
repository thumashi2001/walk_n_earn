const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

const {
  createLeaderboardEntry,
  getAllRecords,
  getTop10,
  getUserRank,
  adminUpdateWeeklyPoints,
  deleteWeeklyRecord,
  notifyTop5,
} = require("../controllers/leaderboardController");

const authMiddleware  = require("../../../middleware/authMiddleware");
const adminMiddleware = require("../../../middleware/adminMiddleware");

/* -------------------------------------------------------
   Validation error handler
------------------------------------------------------- */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

/* ═══════════════════════════════════════════════════════
   CREATE — Admin creates a weekly leaderboard entry
   POST /api/leaderboard
═══════════════════════════════════════════════════════ */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    body("userId")
      .notEmpty().withMessage("userId is required")
      .isMongoId().withMessage("userId must be a valid Mongo ID"),
    body("points")
      .optional()
      .isNumeric().withMessage("points must be a number"),
    body("distance")
      .optional()
      .isNumeric().withMessage("distance must be a number"),
    body("emission")
      .optional()
      .isNumeric().withMessage("emission must be a number"),
  ],
  validate,
  createLeaderboardEntry
);

/* ═══════════════════════════════════════════════════════
   READ — Admin gets ALL records for the current week
   GET /api/leaderboard
═══════════════════════════════════════════════════════ */
router.get("/", authMiddleware, adminMiddleware, getAllRecords);

/* ═══════════════════════════════════════════════════════
   READ — Public top 10 for the current week
   GET /api/leaderboard/top
═══════════════════════════════════════════════════════ */
router.get("/top", getTop10);

/* ═══════════════════════════════════════════════════════
   READ — Specific user's rank
   GET /api/leaderboard/rank/:userId
═══════════════════════════════════════════════════════ */
router.get(
  "/rank/:userId",
  [
    param("userId").isMongoId().withMessage("Invalid User ID"),
  ],
  validate,
  getUserRank
);

/* ═══════════════════════════════════════════════════════
   UPDATE — Admin corrects a record by its _id
   PUT /api/leaderboard/:id
   Body: { newPoints?, newDistance?, newEmission? }
═══════════════════════════════════════════════════════ */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [
    param("id").isMongoId().withMessage("Invalid record ID"),
    body("newPoints")
      .optional()
      .isNumeric().withMessage("newPoints must be a number"),
    body("newDistance")
      .optional()
      .isNumeric().withMessage("newDistance must be a number"),
    body("newEmission")
      .optional()
      .isNumeric().withMessage("newEmission must be a number"),
  ],
  validate,
  adminUpdateWeeklyPoints
);

/* ═══════════════════════════════════════════════════════
   DELETE — Admin removes a record by its _id
   DELETE /api/leaderboard/:id
═══════════════════════════════════════════════════════ */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [
    param("id").isMongoId().withMessage("Invalid record ID"),
  ],
  validate,
  deleteWeeklyRecord
);

/* ═══════════════════════════════════════════════════════
   NOTIFY — Admin sends Top-5 congratulatory emails
   POST /api/leaderboard/notify-top5
═══════════════════════════════════════════════════════ */
router.post("/notify-top5", authMiddleware, adminMiddleware, notifyTop5);

module.exports = router;