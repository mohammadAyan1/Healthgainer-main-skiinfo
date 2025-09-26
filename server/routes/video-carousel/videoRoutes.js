const express = require("express");
const router = express.Router();
const {
  createVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
} = require("../../controllers/video-carousel/videoController");

// No multer used here as it's just links
router.post("/", createVideo);
router.get("/", getAllVideos);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;
