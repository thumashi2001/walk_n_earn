const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../User/models/User");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    //Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Password" });

    //Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //Send response with token
    res.json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error});
  }
};

//Register user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    //Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create user
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role: role || "user", //default user
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
