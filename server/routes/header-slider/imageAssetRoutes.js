const express = require("express");
const router = express.Router();
const {
  createImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
} = require("../../controllers/header-slider/imageAssetController");

router.post("/", createImage);
router.get("/", getAllImages);
router.get("/:id", getImageById);
router.put("/:id", updateImage);
router.delete("/:id", deleteImage);

module.exports = router;
