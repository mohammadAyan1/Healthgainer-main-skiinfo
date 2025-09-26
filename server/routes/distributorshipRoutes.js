const express = require("express");
const router = express.Router();
const distributorshipController = require("../controllers/DistributorshipController");

// CREATE
router.post("/", distributorshipController.createDistributorshipForm);

// READ ALL
router.get("/", distributorshipController.getAllForms);

// READ ONE
router.get("/:id", distributorshipController.getFormById);

// UPDATE
router.put("/:id", distributorshipController.updateFormById);

// DELETE
router.delete("/:id", distributorshipController.deleteFormById);

module.exports = router;
