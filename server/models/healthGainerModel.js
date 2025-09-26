const mongoose = require("mongoose");

const healthGainerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  description: String,
  ingredients: [String],
  howToUse: String,
  benefits: [String],
  prohibitions: [String],
  faq: [
    {
      question: String,
      answer: String,
    },
  ],
});

const HealthGainer = mongoose.model("HealthGainer", healthGainerSchema);

module.exports = HealthGainer;
