const mongoose = require("mongoose");

const AdvantageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advantage", AdvantageSchema);
