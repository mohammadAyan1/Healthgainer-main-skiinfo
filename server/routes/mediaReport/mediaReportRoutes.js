// routes/benefitRoutes.js
const express = require("express");
const { getAllMediaReports,

      createMediaReport,
      updateMediaReport,
      deleteMediaReport,
 } = require("../../controllers/mediaReport/mediaReportController.js");


const router = express.Router();

// GET all
router.get("/", getAllMediaReports);

// POST - handles file upload via express-fileupload
router.post("/", createMediaReport);

// PATCH - handles optional file update
router.put("/:id", updateMediaReport);

// DELETE
router.delete("/:id", deleteMediaReport);

module.exports = router;

