require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Components/User/models/User");
const PointTransaction = require("./Components/WalkingManagement/models/PointTransaction");
const { updateWeeklyLeaderboard } = require("./Components/Leaderboard/controllers/leaderboardController");

// Deterministic pseudo-random so results are reproducible
function seededRandom(i) {
  return ((Math.sin(i * 9301 + 49297) % 1) + 1) % 1; // 0-1
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    const users = await User.find({ role: "user" });
    console.log(`Found ${users.length} regular users.\n`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // Each user gets 2-4 "trips" this week for a realistic leaderboard
      const tripCount = 2 + Math.floor(seededRandom(i) * 3); // 2-4

      for (let t = 0; t < tripCount; t++) {
        const distanceKm = +(1.5 + seededRandom(i * 100 + t) * 6).toFixed(2); // 1.5-7.5 km
        const co2SavedKg = +(distanceKm * 0.21).toFixed(3);
        const pointsEarned = Math.round(co2SavedKg * 10);

        await PointTransaction.create({
          userId:      user._id,
          tripId:      new mongoose.Types.ObjectId(),
          distanceKm,
          co2SavedKg,
          pointsEarned,
          note: `Seed trip ${t + 1}`,
        });

        await updateWeeklyLeaderboard(user._id, pointsEarned, distanceKm, co2SavedKg);
      }

      console.log(`  +  ${user.fullName}: ${tripCount} trips seeded`);
    }

    console.log("\nPoint transactions & weekly leaderboard updated!");
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));