const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    type: {
      type: String,
      enum: ["marketing", "seo", "poster"],
      required: true,
    },
    inputs: { type: mongoose.Schema.Types.Mixed, default: {} },
    output: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ["draft", "active", "completed"], default: "draft" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
