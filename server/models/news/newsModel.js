const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

module.exports= mongoose.model("News", newsSchema);
