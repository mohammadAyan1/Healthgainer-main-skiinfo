const DistributorshipForm = require("../models/DistributorshipForm");

// Create
exports.createDistributorshipForm = async (req, res) => {
  try {
    const form = new DistributorshipForm(req.body);
    
    await form.save();
    res.status(201).json({ message: "Form created ✅", form });
  } catch (error) {
    console.error("Error creating form:", error.message);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// Read all
exports.getAllForms = async (req, res) => {
  try {
    const forms = await DistributorshipForm.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error.message);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// Read by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await DistributorshipForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found ❌" });
    }
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error.message);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// Update by ID
exports.updateFormById = async (req, res) => {
  try {
    const form = await DistributorshipForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!form) {
      return res.status(404).json({ error: "Form not found ❌" });
    }
    res.status(200).json({ message: "Form updated ✅", form });
  } catch (error) {
    console.error("Error updating form:", error.message);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// Delete by ID
exports.deleteFormById = async (req, res) => {
  try {
    const form = await DistributorshipForm.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found ❌" });
    }
    res.status(200).json({ message: "Form deleted ✅" });
  } catch (error) {
    console.error("Error deleting form:", error.message);
    res.status(500).json({ error: "Server error ❌" });
  }
};
