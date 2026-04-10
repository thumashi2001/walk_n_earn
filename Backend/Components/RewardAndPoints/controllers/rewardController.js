const mongoose = require("mongoose");
const Reward = require("../models/Reward");
const Redemption = require("../models/Redemption");
const User = require("../../User/models/User");
const { sendVoucherEmail } = require("../../../utils/emailService");

function normalizeImageUrlFromBody(body) {
  const raw =
    body?.imageUrl != null && String(body.imageUrl).trim() !== ""
      ? body.imageUrl
      : body?.image;
  return raw != null ? String(raw).trim() : "";
}

function isValidHttpUrl(s) {
  return /^https?:\/\//i.test(s);
}

/** Single reward JSON: always expose a usable imageUrl (legacy `image` included). */
function rewardToClient(doc) {
  if (!doc) return doc;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  const merged =
    (o.imageUrl && String(o.imageUrl).trim()) ||
    (o.image && String(o.image).trim()) ||
    "";
  return { ...o, imageUrl: merged };
}

function formatRewardWriteError(error) {
  if (error instanceof mongoose.Error.ValidationError) {
    const first = Object.values(error.errors || {})[0];
    const msg = first?.message || error.message || "Validation failed";
    return { status: 400, message: msg };
  }
  if (error instanceof mongoose.Error.CastError) {
    return { status: 400, message: "Invalid reward id or field value." };
  }
  return { status: 500, message: error.message || "Server error" };
}

//Create STORE ADMIN ONLY
exports.createReward = async (req, res) => {
  try {
    const {
      title,
      description,
      storeName,
      pointsRequired,
      quantity,
      isActive,
    } = req.body || {};

    const titleTrim = String(title ?? "").trim();
    if (!titleTrim) {
      return res.status(400).json({ message: "Title is required." });
    }

    const imageUrl = normalizeImageUrlFromBody(req.body);
    if (!imageUrl || !isValidHttpUrl(imageUrl)) {
      return res.status(400).json({
        message:
          "A valid image URL is required (must start with http:// or https://).",
      });
    }

    const points = Number(pointsRequired);
    const qty = Number(quantity ?? 0);
    if (!Number.isFinite(points) || points < 0) {
      return res.status(400).json({
        message: "Points required must be a valid number (0 or greater).",
      });
    }
    if (!Number.isFinite(qty) || qty < 0) {
      return res.status(400).json({
        message: "Quantity must be a valid number (0 or greater).",
      });
    }

    const reward = await Reward.create({
      title: titleTrim,
      description:
        description != null && String(description).trim() !== ""
          ? String(description).trim()
          : undefined,
      imageUrl,
      storeName: String(storeName ?? "").trim(),
      pointsRequired: points,
      quantity: qty,
      isActive: isActive !== false && isActive !== "false",
    });
    res.status(201).json(rewardToClient(reward));
  } catch (error) {
    const { status, message } = formatRewardWriteError(error);
    res.status(status).json({ message });
  }
};

//Read USERS AND ADMIN BOTH
exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards.map((r) => rewardToClient(r)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update STORE ADMIN ONLY
exports.updateReward = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid reward id." });
    }

    const reward = await Reward.findById(id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    const imageUrl = normalizeImageUrlFromBody(req.body);
    if (!imageUrl || !isValidHttpUrl(imageUrl)) {
      return res.status(400).json({
        message:
          "A valid image URL is required (must start with http:// or https://).",
      });
    }

    const {
      title,
      description,
      storeName,
      pointsRequired,
      quantity,
      isActive,
    } = req.body || {};

    if (title !== undefined) {
      const titleTrim = String(title).trim();
      if (!titleTrim) {
        return res.status(400).json({ message: "Title cannot be empty." });
      }
      reward.title = titleTrim;
    }
    if (description !== undefined) {
      reward.description =
        description === null || String(description).trim() === ""
          ? undefined
          : String(description).trim();
    }
    if (storeName !== undefined) {
      reward.storeName = String(storeName ?? "").trim();
    }
    if (pointsRequired !== undefined) {
      const points = Number(pointsRequired);
      if (!Number.isFinite(points) || points < 0) {
        return res.status(400).json({
          message: "Points required must be a valid number (0 or greater).",
        });
      }
      reward.pointsRequired = points;
    }
    if (quantity !== undefined) {
      const qty = Number(quantity);
      if (!Number.isFinite(qty) || qty < 0) {
        return res.status(400).json({
          message: "Quantity must be a valid number (0 or greater).",
        });
      }
      reward.quantity = qty;
    }
    if (isActive !== undefined) {
      reward.isActive = isActive !== false && isActive !== "false";
    }
    reward.imageUrl = imageUrl;

    await reward.save();
    res.json(rewardToClient(reward));
  } catch (error) {
    const { status, message } = formatRewardWriteError(error);
    res.status(status).json({ message });
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

    let emailSent = false;
    try {
      if (process.env.BREVO_API_KEY?.trim()) {
        await sendVoucherEmail(user.email, voucherCode, reward.title);
        emailSent = true;
      } else {
        console.warn("[redeem] BREVO_API_KEY missing; voucher email skipped");
      }
    } catch (err) {
      console.log("Email sending failed:", err.message);
    }

    res.json({
      message: emailSent
        ? "Redeemed successfully. Voucher sent to your email."
        : "Redeemed successfully. Check your in-app notifications for your code.",
      redemption,
      emailSent,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: view redemption history
exports.getRedemptions = async (req, res) => {
  try {
    const list = await Redemption.find()
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("rewardId", "title");

    const rows = list.map((r) => ({
      _id: r._id,
      userName: r.userId?.fullName ?? "Unknown",
      rewardName: r.rewardId?.title ?? "Unknown",
      pointsUsed: r.pointsUsed,
      createdAt: r.createdAt,
    }));

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};