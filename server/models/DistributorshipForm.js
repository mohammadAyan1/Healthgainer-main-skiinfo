const mongoose = require("mongoose");

const DistributorshipFormSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    positionDistrict: {
      type: Boolean,
      default: false,
    },
    positionZonal: {
      type: Boolean,
      default: false,
    },
    districtName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    pinCode: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    pan: {
      type: String,
      required: true,
      trim: true,
    },
    aadhar: {
      type: String,
      required: true,
      trim: true,
    },
    occupation: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 150,
    },
    startDate: {
      type: Date,
      required: true,
    },
    agentDuration: {
      type: String,
      enum: ["Within 1 Week", "2 Weeks", "3 Weeks", "4 Weeks"],
      required: true,
    },
    signDate: {
      type: Date,
      required: true,
    },
    signature: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DistributorshipForm",
  DistributorshipFormSchema
);
