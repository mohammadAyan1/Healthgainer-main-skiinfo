// routes/SupplementRoutes.js
const express = require("express");
const { getAllSupplements,

      createSupplement,
      updateSupplement,
      deleteSupplement,
 } = require("../../controllers/supplement/supplementController.js");


const router = express.Router();

// GET all
router.get("/", getAllSupplements);

// POST - handles file upload via express-fileupload
router.post("/", createSupplement);

// PATCH - handles optional file update
router.put("/:id", updateSupplement);

// DELETE
router.delete("/:id", deleteSupplement);

module.exports = router;

