const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const walkingTripRoutes = require("./Components/WalkingManagement/routes/tripRoutes");
const walkingPointsRoutes = require("./Components/WalkingManagement/routes/pointsRoutes");
const loginRoutes = require("./Components/Login/loginRoutes");
const userRoutes = require("./Components/User/routes/userRoutes");

// Import weather/health Advice component
const healthAdviceRoutes = require("./Components/Weather/admin/routes/healthAdviceRoutes");

// User side weather route component
const weatherUserRoutes = require("./Components/Weather/user/routes/weatherRoutes");
const userHealthAdviceRoutes = require("./Components/Weather/user/routes/userHealthAdviceRoutes");

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
app.use("/api/walking", walkingPointsRoutes);
app.use("/api/users", userRoutes);

// weather/health route
app.use("/api/admin/health-advice", healthAdviceRoutes);

// User weather routes
app.use("/api/weather", weatherUserRoutes);
app.use("/api/user/health-advice", userHealthAdviceRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
