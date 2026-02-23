require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Components/User/models/User");
const PointTransaction = require("./models/PointTransaction");
const { updateWeeklyLeaderboard } = require("./Components/Leaderboard/controllers/leaderboardController");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    const users = await User.find();

    const distances = [3.5, 5.2, 2.1, 7.0, 4.3]; // km for each user

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const distanceKm = distances[i];

      const co2SavedKg = +(distanceKm * 0.2).toFixed(3);
      const pointsEarned = Math.round(co2SavedKg * 10);

      // Create point transaction
      await PointTransaction.create({
        userId: user._id,
        tripId: mongoose.Types.ObjectId(),
        distanceKm,
        co2SavedKg,
        pointsEarned,
        note: "Test trip",
      });

      // Update weekly leaderboard
      await updateWeeklyLeaderboard(user._id, pointsEarned, distanceKm, co2SavedKg);
    }

    console.log("Point transactions & leaderboard updated!");
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));