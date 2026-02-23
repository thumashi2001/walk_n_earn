const WeeklyLeaderboard = require("../models/weeklyLeaderboard");
const mongoose = require("mongoose");

/**
 * Helper: Get current week start (Monday)
 */
const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) - 6 (Sat)

  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
};