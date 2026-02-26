const express = require("express");
const router = express.Router();

// Import controller
const {
  createHealthAdvice,
  getAllHealthAdvices,
  getHealthAdviceById,
  updateHealthAdvice,
  deleteHealthAdvice,
} = require("../controllers/healthAdviceController");

// Create new health advice
router.post("/", createHealthAdvice);

// Get all health advices
router.get("/", getAllHealthAdvices);

// Get single health advice by ID
router.get("/:id", getHealthAdviceById);

// Update health advice by ID
router.put("/:id", updateHealthAdvice);

// Delete health advice by ID
router.delete("/:id", deleteHealthAdvice);

module.exports = router;
