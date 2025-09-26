const imagekit = require("../../config/imageKit");
const MediaReport = require("../../models/mediaReport/mediaReportModel.js");

// 🟢 Get All Media Reports (sorted by sno)
exports.getAllMediaReports = async (req, res) => {
  try {
    const mediaReports = await MediaReport.find().sort({ sno: 1 });
    res.status(200).json({ success: true, mediaReports });
  } catch (error) {
    console.error("Error fetching media reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch media reports" });
  }
};

// 🟢 Create New Media Report
exports.createMediaReport = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    const { files } = req;

    if (!title || !description || !files?.icon) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Optional: Basic URL format validation
    if (url && !/^https?:\/\/.+/.test(url)) {
      return res.status(400).json({ success: false, message: "Invalid URL format" });
    }

    const iconFile = files.icon;

    const uploaded = await imagekit.upload({
      file: iconFile.data.toString("base64"),
      fileName: `mediaReport_${Date.now()}.jpg`,
      folder: "/mediaReports",
    });

    const total = await MediaReport.countDocuments();
    const newMediaReport = await MediaReport.create({
      title,
      description,
      iconUrl: uploaded.url,
      sno: total + 1,
      url, // ✅ Save url
    });

    res.status(201).json({ success: true, mediaReport: newMediaReport });
  } catch (error) {
    console.error("Create media report error:", error);
    res.status(500).json({ success: false, message: "Failed to create media report" });
  }
};

// 🟡 Update Media Report
exports.updateMediaReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, sno, url } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (sno) updateData.sno = sno;
    if (url) updateData.url = url;

    if (req.files?.icon) {
      const uploaded = await imagekit.upload({
        file: req.files.icon.data.toString("base64"),
        fileName: `mediaReport_${Date.now()}.jpg`,
        folder: "/mediaReports",
      });
      updateData.iconUrl = uploaded.url;
    }

    const updated = await MediaReport.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ success: true, mediaReport: updated });
  } catch (error) {
    console.error("Update media report error:", error);
    res.status(500).json({ success: false, message: "Failed to update media report" });
  }
};

// 🔴 Delete Media Report
exports.deleteMediaReport = async (req, res) => {
  try {
    const { id } = req.params;
    await MediaReport.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Media report deleted successfully" });
  } catch (error) {
    console.error("Delete media report error:", error);
    res.status(500).json({ success: false, message: "Failed to delete media report" });
  }
};
