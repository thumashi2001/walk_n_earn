const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

const {
  updateWeeklyLeaderboard,
  getTop10,
  getUserRank,
  adminUpdateWeeklyPoints,
  deleteWeeklyRecord,
} = require("../controllers/leaderboardController");

/* -------------------------------------------------------
   🔎 Validation Error Handler Middleware
------------------------------------------------------- */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

/* -------------------------------------------------------
   CREATE or UPDATE (User activity)
------------------------------------------------------- */
router.post(
  "/",
  [
    body("userId")
      .notEmpty()
      .withMessage("User ID is required")
      .isMongoId()
      .withMessage("Invalid User ID"),

    body("points")
      .notEmpty()
      .withMessage("Points are required")
      .isNumeric()
      .withMessage("Points must be a number"),

    body("distance")
      .notEmpty()
      .withMessage("Distance is required")
      .isNumeric()
      .withMessage("Distance must be a number"),

    body("emission")
      .notEmpty()
      .withMessage("Emission is required")
      .isNumeric()
      .withMessage("Emission must be a number"),
  ],
  validate,
  async (req, res) => {
    try {
      const { userId, points, distance, emission } = req.body;

      const result = await updateWeeklyLeaderboard(
        userId,
        points,
        distance,
        emission
      );

      res.status(201).json({
        success: true,
        message: "Leaderboard updated successfully",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/* -------------------------------------------------------
   READ - Top 10
------------------------------------------------------- */
router.get("/top", getTop10);

/* -------------------------------------------------------
   READ - Specific User Rank
------------------------------------------------------- */
router.get(
  "/rank/:userId",
  [
    param("userId")
      .isMongoId()
      .withMessage("Invalid User ID"),
  ],
  validate,
  getUserRank
);

/* -------------------------------------------------------
   UPDATE (Admin Manual Update)
------------------------------------------------------- */
router.put(
  "/:id",
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid Leaderboard Record ID"),

    body("newPoints")
      .notEmpty()
      .withMessage("New points value is required")
      .isNumeric()
      .withMessage("New points must be a number"),
  ],
  validate,
  adminUpdateWeeklyPoints
);

/* -------------------------------------------------------
   DELETE Leaderboard Record
------------------------------------------------------- */
router.delete(
  "/:id",
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid Leaderboard Record ID"),
  ],
  validate,
  deleteWeeklyRecord
);

module.exports = router;