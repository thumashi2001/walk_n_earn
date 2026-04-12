const express = require("express");
const router = express.Router();
const controller = require("../controllers/rewardController");
const authMiddleware = require("../../../middleware/authMiddleware");
const adminMiddleware = require("../../../middleware/adminMiddleware");

router.post("/", authMiddleware, adminMiddleware, controller.createReward);
router.get("/", controller.getRewards);
router.put("/:id", authMiddleware, adminMiddleware, controller.updateReward);
router.delete("/:id", authMiddleware, adminMiddleware, controller.deleteReward);
router.post("/redeem", authMiddleware, controller.redeemReward);

module.exports = router;