require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Components/User/models/User");
const WeeklyLeaderboard = require("./Components/Leaderboard/models/weeklyLeaderboard");

const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("MongoDB Connected");
  const { weekStart, weekEnd } = getWeekRange();

  const u1 = await User.findOne({ email: "softedgeinnovations@gmail.com" });
  const u2 = await User.findOne({ email: "msideshan@gmail.com" });

  if (!u1 || !u2) {
    console.log("ERROR: users not found", { u1: !!u1, u2: !!u2 });
    return mongoose.disconnect();
  }

  // #1 — softedgeinnovations: 100 weekly points
  await WeeklyLeaderboard.findOneAndUpdate(
    { user_id: u1._id, week_start: weekStart },
    {
      $set: { weekly_points: 100, weekly_distance: 48.5, weekly_emission: 10.185 },
      $setOnInsert: { week_end: weekEnd },
    },
    { upsert: true }
  );
  console.log("  #1  Softedge Innovations — 100 weekly pts");

  // #2 — msideshan: 90 weekly points
  await WeeklyLeaderboard.findOneAndUpdate(
    { user_id: u2._id, week_start: weekStart },
    {
      $set: { weekly_points: 90, weekly_distance: 43.2, weekly_emission: 9.072 },
      $setOnInsert: { week_end: weekEnd },
    },
    { upsert: true }
  );
  console.log("  #2  Deshan MSI — 90 weekly pts");

  console.log("\nDone — both users are now #1 and #2 on the leaderboard!");
  mongoose.disconnect();
});
