const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUserById, getAllUsers } = require("../controllers/userController");
const authMiddleware  = require("../../../middleware/authMiddleware");
const adminMiddleware = require("../../../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.get("/:id", getUserById);

module.exports = router;