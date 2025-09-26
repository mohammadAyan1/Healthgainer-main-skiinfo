const mongoose = require("mongoose");

const mediaReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconUrl: { type: String, required: true ,default:"https://ik.imagekit.io/ch0wxnp882/mediaReports/mediaReport_1751558238415_yqIEQZW30.jpg"},
    sno: { type: Number, default: 0 }, // for sorting
    url: { type: String }, // URL of the media report
  },
  { timestamps: true }
);

module.exports =  mongoose.model("MediaReport", mediaReportSchema);
