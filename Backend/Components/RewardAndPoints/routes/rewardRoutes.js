const express = require("express");
const router = express.Router();
const controller = require("../controllers/rewardController");

router.post("/", controller.createReward);
router.get("/", controller.getRewards);
router.put("/:id", controller.updateReward);
router.delete("/:id", controller.deleteReward);
router.post("/redeem", controller.redeemReward);

module.exports = router;