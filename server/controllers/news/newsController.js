const imagekit = require("../../config/imageKit.js");
const News = require("../../models/news/newsModel.js");

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json({ success: true, news });
  } catch (error) {
    console.error("Get news error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch news" });
  }
};

exports.createNews = async (req, res) => {
  try {
    const { label, link } = req.body;

    if (!req.files?.image) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const uploaded = await imagekit.upload({
      file: req.files.image.data.toString("base64"),
      fileName: `news_${Date.now()}.jpg`,
      folder: "/news",
    });

    const news = await News.create({
      label,
      link,
      imageUrl: uploaded.url,
    });

    res.status(201).json({ success: true, news });
  } catch (error) {
    console.error("Create news error:", error);
    res.status(500).json({ success: false, message: "Failed to create news" });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, link } = req.body;
    const updateData = {};

    if (label) updateData.label = label;
    if (link) updateData.link = link;

    if (req.files?.image) {
      const uploaded = await imagekit.upload({
        file: req.files.image.data.toString("base64"),
        fileName: `news_${Date.now()}.jpg`,
        folder: "/news",
      });
      updateData.imageUrl = uploaded.url;
    }

    const updated = await News.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ success: true, news: updated });
  } catch (error) {
    console.error("Update news error:", error);
    res.status(500).json({ success: false, message: "Failed to update news" });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await News.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "News deleted" });
  } catch (error) {
    console.error("Delete news error:", error);
    res.status(500).json({ success: false, message: "Failed to delete news" });
  }
};
