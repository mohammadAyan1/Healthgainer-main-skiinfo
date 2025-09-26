const express = require("express");
const router = express.Router();
const {
  createReq,
  getAllReq,
  updateReq,
  deleteReq,
} = require("../controllers/reqController");

// Routes for contacts
router.post("/create", createReq);
router.get("/all", getAllReq);
router.put("/update/:id", updateReq);
router.delete("/delete/:id", deleteReq);

module.exports = router;
