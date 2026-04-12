const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      validate: {
        validator(v) {
          return typeof v === "string" && /^https?:\/\//i.test(v.trim());
        },
        message: "Image URL must start with http:// or https://",
      },
    },
    /** Legacy field; copied into imageUrl in pre-validate when imageUrl is empty. */
    image: { type: String, default: "" },
    storeName: { type: String, default: "" },
    pointsRequired: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Runs before schema validators so legacy `image` can populate `imageUrl` first.
// Mongoose 8+ / 9: do not use `next()` — callback-style hooks were removed; sync hooks only.
rewardSchema.pre("validate", function () {
  const trimmed = this.imageUrl && String(this.imageUrl).trim();
  if (!trimmed) {
    const legacy = this.image && String(this.image).trim();
    if (legacy && /^https?:\/\//i.test(legacy)) {
      this.imageUrl = legacy;
    }
  }
});

module.exports = mongoose.model("Reward", rewardSchema);
