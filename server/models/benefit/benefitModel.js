const mongoose = require("mongoose");

const benefitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconUrl: { type: String, required: true ,default:"https://ik.imagekit.io/ch0wxnp882/benefits/benefit_1751558238415_yqIEQZW30.jpg"},
    sno: { type: Number, default: 0 }, // for sorting
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Benefit", benefitSchema);
