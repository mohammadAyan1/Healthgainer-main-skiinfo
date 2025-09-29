
const imagekit = require("../../config/imageKit");
const Supplement = require("../../models/supplement/supplementModel.js");

// 🟢 Get All supplements (sorted by sno)
exports.getAllSupplements = async (req, res) => {
  try {
    const supplements = await Supplement.find().sort({ sno: 1 });
    res.status(200).json({ success: true, supplements });
  } catch (error) {
    console.error("Error fetching supplements:", error);
    res.status(500).json({ success: false, message: "Failed to fetch supplements" });
  }
};

// 🟢 Create New supplement
exports.createSupplement = async (req, res) => {
  
  try {
    const { title, description } = req.body;
    const { files } = req;
    

    if (!title || !description ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const iconFile = files.icon;

    const uploaded = await imagekit.upload({
      file: iconFile.data.toString("base64"),
      fileName: `supplement_${Date.now()}.jpg`,
      folder: "/supplements",
    });
    

    const total = await Supplement.countDocuments();
    const newSupplement = await Supplement.create({
      title,
      description,
      iconUrl: uploaded.url,
      sno: total + 1,
    });

    res.status(201).json({ success: true, supplement: newSupplement });
  } catch (error) {
    console.error("Create supplement error:", error);
    res.status(500).json({ success: false, message: "Failed to create supplement" });
  }
};

// 🟡 Update supplement
exports.updateSupplement = async (req, res) => {
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
        fileName: `supplement_${Date.now()}.jpg`,
        folder: "/supplements",
      });
      updateData.iconUrl = uploaded.url;
    }

    const updated = await Supplement.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ success: true, supplement: updated });
  } catch (error) {
    console.error("Update supplement error:", error);
    res.status(500).json({ success: false, message: "Failed to update supplement" });
  }
};

// 🔴 Delete supplement
exports.deleteSupplement = async (req, res) => {
  try {
    const { id } = req.params;
    await Supplement.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "supplement deleted successfully" });
  } catch (error) {
    console.error("Delete supplement error:", error);
    res.status(500).json({ success: false, message: "Failed to delete supplement" });
  }
};
