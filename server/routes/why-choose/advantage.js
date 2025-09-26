const express = require("express");
const router = express.Router();
const {
  createAdvantage,
  getAllAdvantages,
  updateAdvantage,
  deleteAdvantage,
} = require("../../controllers/why-choose/advantageController.js");

router.get("/", getAllAdvantages);
router.post("/", createAdvantage);
router.put("/:id", updateAdvantage);
router.delete("/:id", deleteAdvantage);

module.exports = router;
