const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    price: { type: Number, required: true, min: 0 },
    inventory: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
