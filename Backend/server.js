const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const walkingTripRoutes = require("./Components/WalkingManagement/routes/tripRoutes");
const loginRoutes = require("./Components/Login/loginRoutes");

const app = express();

app.get("/api/health", (req, res) => {
  res.status(200).json({
    app: "Walk n Earn",
    status: "OK",
    time: new Date().toISOString(),
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Actual Routes
app.use("/api/login", loginRoutes);
app.use("/api/walking", walkingTripRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
