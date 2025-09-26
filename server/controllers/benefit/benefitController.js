// controllers/benefitController.js
const imagekit = require("../../config/imageKit");
const Benefit = require("../../models/benefit/benefitModel.js");

// 🟢 Get All Benefits (sorted by sno)
exports.getAllBenefits = async (req, res) => {
  try {
    const benefits = await Benefit.find().sort({ sno: 1 });
    res.status(200).json({ success: true, benefits });
  } catch (error) {
    console.error("Error fetching benefits:", error);
    res.status(500).json({ success: false, message: "Failed to fetch benefits" });
  }
};

// 🟢 Create New Benefit
exports.createBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { files } = req;

    if (!title || !description || !files?.icon) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const iconFile = files.icon;

    const uploaded = await imagekit.upload({
      file: iconFile.data.toString("base64"),
      fileName: `benefit_${Date.now()}.jpg`,
      folder: "/benefits",
    });
    // console.log(uploaded)

    const total = await Benefit.countDocuments();
    const newBenefit = await Benefit.create({
      title,
      description,
      iconUrl: uploaded.url,
      sno: total + 1,
    });

    res.status(201).json({ success: true, benefit: newBenefit });
  } catch (error) {
    console.error("Create benefit error:", error);
    res.status(500).json({ success: false, message: "Failed to create benefit" });
  }
};

// 🟡 Update Benefit
exports.updateBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, sno } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (sno) updateData.sno = sno;

    if (req.files?.icon) {
      const uploaded = await imagekit.upload({
        file: req.files.icon.data.toString("base64"),
        fileName: `benefit_${Date.now()}.jpg`,
        folder: "/benefits",
      });
      updateData.iconUrl = uploaded.url;
    }

    const updated = await Benefit.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ success: true, benefit: updated });
  } catch (error) {
    console.error("Update benefit error:", error);
    res.status(500).json({ success: false, message: "Failed to update benefit" });
  }
};

// 🔴 Delete Benefit
exports.deleteBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    await Benefit.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Benefit deleted successfully" });
  } catch (error) {
    console.error("Delete benefit error:", error);
    res.status(500).json({ success: false, message: "Failed to delete benefit" });
  }
};
