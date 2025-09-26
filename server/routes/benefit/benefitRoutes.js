// routes/benefitRoutes.js
const express = require("express");
const { getAllBenefits,

      createBenefit,
      updateBenefit,
      deleteBenefit,
 } = require("../../controllers/benefit/benefitController");


const router = express.Router();

// GET all
router.get("/", getAllBenefits);

// POST - handles file upload via express-fileupload
router.post("/", createBenefit);

// PATCH - handles optional file update
router.put("/:id", updateBenefit);

// DELETE
router.delete("/:id", deleteBenefit);

module.exports = router;

