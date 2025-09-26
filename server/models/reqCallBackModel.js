const mongoose = require("mongoose");

const reqCallBackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

const ReqCallBack = mongoose.model("ReqCallBack", reqCallBackSchema);
module.exports = ReqCallBack;
