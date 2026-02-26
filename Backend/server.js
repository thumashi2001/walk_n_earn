const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();
const walkingTripRoutes = require("./Components/WalkingManagement/routes/tripRoutes");
const walkingPointsRoutes = require("./Components/WalkingManagement/routes/pointsRoutes");
const loginRoutes = require("./Components/Login/loginRoutes");
const userRoutes = require("./Components/User/routes/userRoutes");
const leaderboardRoutes = require("./Components/Leaderboard/routes/leaderboardRoutes");
const swaggerDocument = require("./config/swagger");

const path = require("path");
const app = express();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Walk n Earn API",
      version: "1.0.0",
    },
  },
  apis: ["Components/**/routes/*.js"], 
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
app.use("/api/leaderboard", leaderboardRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
