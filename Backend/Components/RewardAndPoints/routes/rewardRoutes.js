const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

const controller = require("../controllers/rewardController");
const authMiddleware = require("../../../middleware/authMiddleware");
const adminMiddleware = require("../../../middleware/adminMiddleware");

/* ----------------------------------------------------------
   Validation error handler
---------------------------------------------------------- */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

/* ----------------------------------------------------------
   CREATE reward  –  Admin only
---------------------------------------------------------- */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    body("title")
      .notEmpty().withMessage("Title is required")
      .trim(),
    body("pointsRequired")
      .notEmpty().withMessage("pointsRequired is required")
      .isInt({ min: 1 }).withMessage("pointsRequired must be a positive integer"),
    body("quantity")
      .optional()
      .isInt({ min: 0 }).withMessage("quantity must be a non-negative integer"),
    body("isActive")
      .optional()
      .isBoolean().withMessage("isActive must be a boolean"),
  ],
  validate,
  controller.createReward
);

/* ----------------------------------------------------------
   READ all rewards  –  Public (admin use / seed verification)
---------------------------------------------------------- */
router.get("/", controller.getRewards);

/* ----------------------------------------------------------
   READ active rewards  –  Public (user-facing store)
---------------------------------------------------------- */
router.get("/active", controller.getActiveRewards);

/* ----------------------------------------------------------
   READ current user's redemption history  –  Auth required
---------------------------------------------------------- */
router.get("/my-redemptions", authMiddleware, controller.getUserRedemptions);

/* ----------------------------------------------------------
   UPDATE reward  –  Admin only
---------------------------------------------------------- */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [
    param("id").isMongoId().withMessage("Invalid Reward ID"),
    body("pointsRequired")
      .optional()
      .isInt({ min: 1 }).withMessage("pointsRequired must be a positive integer"),
    body("quantity")
      .optional()
      .isInt({ min: 0 }).withMessage("quantity must be a non-negative integer"),
    body("isActive")
      .optional()
      .isBoolean().withMessage("isActive must be a boolean"),
  ],
  validate,
  controller.updateReward
);

/* ----------------------------------------------------------
   DELETE reward  –  Admin only
---------------------------------------------------------- */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [param("id").isMongoId().withMessage("Invalid Reward ID")],
  validate,
  controller.deleteReward
);

/* ----------------------------------------------------------
   REDEEM reward  –  Auth required (user only, enforced in controller)
---------------------------------------------------------- */
router.post(
  "/redeem",
  authMiddleware,
  [
    body("rewardId")
      .notEmpty().withMessage("rewardId is required")
      .isMongoId().withMessage("rewardId must be a valid Mongo ID"),
  ],
  validate,
  controller.redeemReward
);

module.exports = router;