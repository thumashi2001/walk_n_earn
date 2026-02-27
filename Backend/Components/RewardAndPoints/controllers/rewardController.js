const Reward = require("../models/Reward");
const Redemption = require("../models/Redemption");
const User = require("../../User/models/User");
const { sendVoucherEmail } = require("../../../utils/emailService");

//Create STORE ADMIN ONLY
exports.createReward = async (req, res) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Read USERS AND ADMIN BOTH
exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update STORE ADMIN ONLY
exports.updateReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!reward)
      return res.status(404).json({ message: "Reward not found" });

    res.json(reward);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete STORE ADMIN ONLY
exports.deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);

    if (!reward)
      return res.status(404).json({ message: "Reward not found" });

    res.json({ message: "Reward deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Redeem
exports.redeemReward = async (req, res) => {
  try {

    // Only normal users can redeem
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can redeem rewards" });
    }

    const { rewardId } = req.body;

    const user = await User.findById(req.user._id);
    const reward = await Reward.findById(rewardId);

    if (!user || !reward)
      return res.status(404).json({ message: "Not Found" });

    if (user.totalPoints < reward.pointsRequired)
      return res.status(400).json({ message: "Not Enough Points" });

    if (reward.quantity <= 0)
      return res.status(400).json({ message: "Out of stock" });

    // Deduct points & quantity
    user.totalPoints -= reward.pointsRequired;
    reward.quantity -= 1;

    await user.save();
    await reward.save();

    //Generate voucher code
    const voucherCode = "VOUCHER-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    const redemption = await Redemption.create({
      userId: user._id,
      rewardId: reward._id,
      pointsUsed: reward.pointsRequired,
      voucherCode
    });

    //Send email
    try {
      await sendVoucherEmail(user.email, voucherCode, reward.title);
    } catch (err) {
      console.log("Email sending failed:", err.message);
    }

    res.json({
      message: "Redeemed Successfully. Voucher sent to email!",
      redemption
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};