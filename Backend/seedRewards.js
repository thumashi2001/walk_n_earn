/**
 * seedRewards.js
 *
 * Seeds 5 reward items into the database.
 * SAFE: skips any reward whose title already exists — no data is deleted.
 *
 * Usage:  node seedRewards.js
 *    or:  npm run seed:rewards
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Reward = require("./Components/RewardAndPoints/models/Reward");

const rewards = [
  {
    title: "Free Coffee Voucher",
    description: "Redeem for a free coffee at any partner café.",
    pointsRequired: 500,
    quantity: 50,
    isActive: true,
  },
  {
    title: "Rs. 100 Bus Pass Top-Up",
    description: "Get Rs. 100 added to your transit card.",
    pointsRequired: 800,
    quantity: 30,
    isActive: true,
  },
  {
    title: "Eco Water Bottle",
    description: "Branded reusable water bottle — walk green, drink green.",
    pointsRequired: 1200,
    quantity: 20,
    isActive: true,
  },
  {
    title: "10% Off at GreenMart",
    description: "Discount coupon valid on your next in-store purchase.",
    pointsRequired: 600,
    quantity: 100,
    isActive: true,
  },
  {
    title: "Movie Ticket Voucher",
    description: "One free regular-screen movie ticket at participating cinemas.",
    pointsRequired: 1500,
    quantity: 15,
    isActive: true,
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    let created = 0;
    let skipped = 0;

    for (const r of rewards) {
      const exists = await Reward.findOne({ title: r.title });
      if (exists) {
        console.log(`  ↷  Skipping existing reward: "${r.title}"`);
        skipped++;
        continue;
      }
      await Reward.create(r);
      console.log(`  ✓  Created reward: "${r.title}" (${r.pointsRequired} pts)`);
      created++;
    }

    console.log(`\nDone — ${created} created, ${skipped} skipped.`);
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));
