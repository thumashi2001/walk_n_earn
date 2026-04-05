const express = require("express");
const router = express.Router();
const getHealthAdviceForCurrentWeather = require("../controllers/userHealthAdviceController");

router.get("/current", getHealthAdviceForCurrentWeather);

module.exports = router;
