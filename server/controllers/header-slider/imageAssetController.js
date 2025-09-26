const ImageAsset = require("../../models/header-slider/ImageAsset");
const imagekit = require("../../config/imageKit");

// CREATE Image (from file OR URL)
exports.createImage = async (req, res) => {
  try {
    const { files } = req;

    const { viewType } = req.body; // default to 'desktop'

    console.log(req.body, "D");

    // Ensure images are uploaded
    if (!files || !files.images) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    const imagesArray = Array.isArray(files.images)
      ? files.images
      : [files.images];

    // Upload all images to ImageKit
    const uploadedImages = await Promise.all(
      imagesArray.map(async (file) => {
        try {
          const uploadResponse = await imagekit.upload({
            file: file.data.toString("base64"), // base64 encoding
            fileName: `slider_${Date.now()}.jpg`,
            folder: "/slider", // 🧠 use a meaningful folder for slider images
          });
          return {
            url: uploadResponse.url,
            origin: "upload", // metadata (optional)
            type: viewType,
          };
        } catch (error) {
          console.error("❌ Failed to upload image:", error);
          throw new Error(
            `Upload failed: ${error.message || JSON.stringify(error)}`
          );
        }
      })
    );

    // Save image URLs in DB
    const savedImages = await ImageAsset.insertMany(uploadedImages);
    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      images: savedImages.map((img) => ({
        _id: img._id,
        url: img.url, // Include image URL
        type: img.type,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt,
      })),
    });
  } catch (error) {
    console.error("🔥 Error uploading images:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

// READ All
exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageAsset.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ One
exports.getImageById = async (req, res) => {
  try {
    const image = await ImageAsset.findById(req.params.id);
    if (!image)
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    res.status(200).json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE image URL only (for this case)
exports.updateImage = async (req, res) => {
  try {
    const { sourceUrl,sno } = req.body;
    const updated = await ImageAsset.findByIdAndUpdate(
      req.params.id,
      { sourceUrl,sno },
        { new: true }
      );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    res
      .status(200)
      .json({ success: true, message: "Image updated", image: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteImage = async (req, res) => {
  try {
    const deleted = await ImageAsset.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    res
      .status(200)
      .json({ success: true, message: "Image deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
