const Video = require("../../models/video-carousel/videoModel");

// CREATE
exports.createVideo = async (req, res) => {
  try {
    const { name, videoUrl } = req.body;

    if (!name || !videoUrl) {
      return res.status(400).json({ success: false, message: "Name and video URL are required" });
    }

    const video = await Video.create({ name, videoUrl });
    res.status(201).json({ success: true, video });
  } catch (error) {
    console.error("Create Video Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// READ
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ sno: 1, createdAt: -1 });
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Fetch Videos Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// UPDATE
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, videoUrl, sno } = req.body;

    const updated = await Video.findByIdAndUpdate(
      id,
      { name, videoUrl, sno },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    res.status(200).json({ success: true, video: updated });
  } catch (error) {
    console.error("Update Video Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// DELETE
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    res.status(200).json({ success: true, message: "Video deleted", id });
  } catch (error) {
    console.error("Delete Video Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
