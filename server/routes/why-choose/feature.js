const express = require("express");
const router = express.Router();
const {
  createFeature,
  getAllFeatures,
  updateFeature,
  deleteFeature,
} = require("../../controllers/why-choose/featureController");

router.get("/", getAllFeatures);
router.post("/", createFeature);
router.put("/:id", updateFeature);
router.delete("/:id", deleteFeature);

module.exports = router;
