const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getUserById,
  getCurrentUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/:id", getUserById);

module.exports = router;