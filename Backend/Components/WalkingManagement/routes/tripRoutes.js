const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTripsByUser,
  updateTrip,
  deleteTrip,
  endTrip,
} = require("../controllers/tripController");

router.post("/trips", createTrip);
router.get("/trips", getTripsByUser);
router.put("/trips/:id", updateTrip);
router.delete("/trips/:id", deleteTrip);
router.put("/trips/:id/end", endTrip);

module.exports = router;