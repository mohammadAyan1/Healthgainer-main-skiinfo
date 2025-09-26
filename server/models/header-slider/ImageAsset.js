const mongoose = require("mongoose");

const imageAssetSchema = new mongoose.Schema(
  {
    sno: {
      type: Number,
      // required: true,
    },
    url: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      default: "upload",
    },
    type: {
      type: String,
      enum: ["mobile", "desktop"],
      default: "desktop",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImageAsset", imageAssetSchema);
