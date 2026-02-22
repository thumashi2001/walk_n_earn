const express = require("express");
const router = express.Router();
const { createTrip } = require("../controllers/tripController");

router.post("/trips", createTrip);

module.exports = router;