const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    tag: {
      type: String, // e.g. "HOT DEAL", optional
    },
    image: {
      type: String,
      required: true,
    },
    sno: {
  type: Number,
  required: true,
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
