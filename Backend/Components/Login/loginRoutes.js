const express = require("express");
const { loginUser } = require("./loginController");
const { validateLogin } = require("./loginMiddleware");

const router = express.Router();

router.post("/", validateLogin, loginUser);

module.exports = router;
