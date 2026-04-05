const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        image: { type: String, default: "" },
        storeName: { type: String, default: "" },
        pointsRequired: { type: Number, required: true },
        quantity: { type: Number, default: 0},
        isActive: { type: Boolean, default: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);