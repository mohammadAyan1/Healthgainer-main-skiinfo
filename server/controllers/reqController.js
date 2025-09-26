const Req = require("../models/reqCallBackModel");

exports.createReq = async (req, res) => {
  try {
    const { name, message, email, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // if (!message && !phone) {
    //   return res.status(400).json({ message: 'At least one field (email or phone) is required' });
    // }
    // Create a new contact instance
    const newReq = new Req({
      name,
      message,
      email,
      phone,
    });

    // Save the contact to the database
    await newReq.save();

    return res.status(201).json({
      message: "Req created successfully.",
      success: true,
      req: newReq,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getAllReq = async (req, res) => {
  try {
    // Fetch all contacts
    const req = await Req.find().sort({ createdAt: -1 });
    return res.status(200).json(req);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.updateReq = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, email, phone } = req.body;

    // Check if contact exists
    const req = await Req.findById(id);
    if (!req) {
      return res.status(404).json({ message: "ReqCall not found" });
    }

    // Update contact fields
    req.name = name || req.name;
    req.message = message || req.message;
    req.email = email || req.email;
    req.phone = phone || req.phone;

    // Save updated contact to the database
    await req.save();

    return res.status(200).json({
      message: "Contact updated successfully.",
      success: true,
      req: req,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.deleteReq = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if contact exists
    const request = await Req.findById(id);
    if (!req) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Delete contact from database
    await Req.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Contact deleted successfully.",
      success: true,
      req: request,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
