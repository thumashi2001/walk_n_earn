const Reward = require("../models/Reward");
const Redemption = require("../models/Redemption");
const User = require("../../User/models/User");

//Create
exports.createReward = async (req, res) => {
    const reward = await Reward.create(req.body);
    res.json(reward);
};

//Read
exports.getRewards = async (req, res) => {
    const rewards = await Reward.find();
    res.json(rewards);
};

//Update
exports.updateReward = async (req, res) => {
    const reward = await Reward.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(reward);
};

//Delete
exports.deleteReward = async (req, res) => {
    await Reward.findByIdAndDelete(req.params.id);
    res.json({ message: "Reward deleted" });
};

//Redeem
exports.redeemReward = async (req, res) => {
    const { userId, rewardId } = req.body;

    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);

    if (!user || !reward)
        return res.status(404).json({ message: "Not Found" });

    if (user.totalPoints < reward.pointsRequired)
        return res.status(400).json({ message: "Not Enough Points" });

    if (reward.quantity <= 0)
        return res.status(400).json({ message: "Out of stock" });

    user.totalPoints -= reward.pointsRequired;
    reward.quantity -=1;

    await user.save();
    await reward.save();

    const redemption = await Redemption.create({
        userId,
        rewardId,
        pointsUsed: reward.pointsRequired
    });

    res.json({ message: "Redeemed Successfully", redemption });
};