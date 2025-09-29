const imagekit = require("../../config/imageKit.js");
const Feature = require("../../models/why-choose/featureModel.js");


exports.createFeature = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.files?.image) {
      return res.status(400).json({ success: false, message: "Image required" });
    }

    const upload = await imagekit.upload({
      file: req.files.image.data.toString("base64"),
      fileName: `why_feature_${Date.now()}.jpg`,
      folder: "/whychooseus",
    });

    const feature = await Feature.create({
      title,
      description,
      imageUrl: upload.url,
    });

    res.status(201).json({ success: true, feature });
  } catch (err) {
    console.error("Create feature error:", err);
    res.status(500).json({ success: false, message: "Failed to create feature" });
  }
};

exports.getAllFeatures = async (req, res) => {
  const features = await Feature.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, features });
};

exports.updateFeature = async (req, res) => {
    
  try {
    
    const { id } = req.params;
    const { title, description } = req.body;
    const updateData = { title, description };

    if (req.files?.image) {
      const upload = await imagekit.upload({
        file: req.files.image.data.toString("base64"),
        fileName: `why_feature_${Date.now()}.jpg`,
        folder: "/whychooseus",
      });
      updateData.imageUrl = upload.url;
    }
    const updated = await Feature.findByIdAndUpdate(id, updateData, { new: true });
    
    res.status(200).json({ success: true, feature: updated });
  } catch (err) {
    console.error("Update feature error:", err);
    res.status(500).json({ success: false, message: "Failed to update feature" });
  }
};

exports.deleteFeature = async (req, res) => {
  await Feature.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Feature deleted" });
};
