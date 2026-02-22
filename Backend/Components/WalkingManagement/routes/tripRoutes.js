const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTripsByUser,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");

router.post("/trips", createTrip);
router.get("/trips", getTripsByUser);
router.put("/trips/:id", updateTrip);
router.delete("/trips/:id", deleteTrip);

module.exports = router;