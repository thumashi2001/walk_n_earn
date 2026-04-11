const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/authMiddleware");
const adminMiddleware = require("../../../middleware/adminMiddleware");

const {
  registerUser,
  loginUser,
  getUserById,
  getCurrentUser,
  listUsers,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/", authMiddleware, adminMiddleware, listUsers);
router.get("/:id", getUserById);

module.exports = router;