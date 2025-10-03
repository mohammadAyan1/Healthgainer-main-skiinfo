const mongoose = require("mongoose");
const type = require("mongoose/lib/schema/operators/type");

const userModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      default: "",
      unique: true,
    },

    mobileNumber: {
      type: String,
      default: "",
      unique: false,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    lastLogin: { type: Date, default: null },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
