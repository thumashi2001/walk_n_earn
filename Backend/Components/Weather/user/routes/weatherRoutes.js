// routes/weatherRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCurrentWeather,
} = require("../controllers/currentWeatherController");

router.get("/current", getCurrentWeather);

module.exports = router;
