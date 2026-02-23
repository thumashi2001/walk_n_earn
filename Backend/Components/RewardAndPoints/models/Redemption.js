const mongoose = require("mongoose");

const redemptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rewardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reward",
            required: true
        },
        pointsUsed: { type: Number, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Redemption", redemptionSchema);