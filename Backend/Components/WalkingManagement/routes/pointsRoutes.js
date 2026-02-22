const express = require("express");
const router = express.Router();

const {
  createPointsFromTrip,
  getPointsByUser,
  updatePointTransaction,
  deletePointTransaction,
} = require("../controllers/pointsController");

router.post("/points", createPointsFromTrip);
router.get("/points", getPointsByUser);
router.put("/points/:id", updatePointTransaction);
router.delete("/points/:id", deletePointTransaction);

module.exports = router;