const express = require("express");
const { loginUser } = require("./loginController");
const { validateLogin } = require("./loginMiddleware");
const { registerUser } = require("./loginController");

const router = express.Router();

router.post("/", validateLogin, loginUser);
router.post("/register", registerUser);

module.exports = router;
