const express = require("express");
const router = express.Router();

const {
  getAllDeals,
  createDeal,
  updateDeal,
  deleteDeal,
} = require("../../controllers/deal/dealController.js");

// GET all deals
router.get("/", getAllDeals);

// POST create deal
router.post("/", createDeal);

// PUT update deal
router.put("/:id", updateDeal);

// DELETE deal
router.delete("/:id", deleteDeal);

module.exports = router;
