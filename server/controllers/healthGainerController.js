const HealthGainer = require("../models/healthGainerModel");

// ✅ Get all Health Gainer details
exports.getAllHealthGainers = async (req, res) => {
  try {
    const tabs = await HealthGainer.find().populate("product");
    res.status(200).json(tabs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Health Gainer details by ID
exports.getHealthGainerById = async (req, res) => {
  try {
    const { id } = req.params;
    const tabData = await HealthGainer.findById(id).populate("product");
    if (!tabData) return res.status(404).json({ message: "No data found for this ID" });
    res.status(200).json(tabData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Health Gainer details by Product ID
exports.getHealthGainerByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const tabData = await HealthGainer.findOne({ product: productId }).populate("product");
    if (!tabData) return res.status(404).json({ message: "No data found for this product" });
    res.status(200).json(tabData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create a new Health Gainer tab
exports.createHealthGainer = async (req, res) => {
  try {
    const newTab = new HealthGainer(req.body);
    console.log(newTab);
    
    await newTab.save();
    res.status(201).json(newTab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Health Gainer details by ID
exports.updateHealthGainer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTab = await HealthGainer.findByIdAndUpdate(id, req.body, { new: true }).populate("product");
    if (!updatedTab) return res.status(404).json({ message: "No data found for this ID" });
    res.status(200).json(updatedTab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Health Gainer by ID
exports.deleteHealthGainer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTab = await HealthGainer.findByIdAndDelete(id);
    if (!deletedTab) return res.status(404).json({ message: "No data found for this ID" });
    res.status(200).json({ message: "Health Gainer tab deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
