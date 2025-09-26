const express = require("express");
const router = express.Router();
const healthGainerController = require("../controllers/healthGainerController");

router.get("/", healthGainerController.getAllHealthGainers);
router.get("/:id", healthGainerController.getHealthGainerById);
router.get("/product/:productId", healthGainerController.getHealthGainerByProduct);
router.post("/", healthGainerController.createHealthGainer);
router.put("/:id", healthGainerController.updateHealthGainer);
router.delete("/:id", healthGainerController.deleteHealthGainer);

module.exports = router;
