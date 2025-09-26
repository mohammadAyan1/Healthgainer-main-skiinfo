const imagekit = require("../../config/imageKit.js");
const Deal = require("../../models/deal/DealModel.js");

// Get all deals
exports.getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find().sort({ sno: 1 }); // ✅ Sort by sno
    res.status(200).json({ success: true, deals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch deals", error });
  }
};

// Create a deal
exports.createDeal = async (req, res) => {
  try {
    const { title, subtitle, price, quantity, tag } = req.body;

    if (!title || !subtitle || !price || !quantity) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Get highest sno and increment
    const lastDeal = await Deal.findOne().sort({ sno: -1 });
    const nextSno = lastDeal ? lastDeal.sno + 1 : 1;

    const uploaded = await imagekit.upload({
      file: req.files.image.data.toString("base64"),
      fileName: `deal_${Date.now()}.jpg`,
      folder: "/deals",
    });

    const newDeal = await Deal.create({
      title,
      subtitle,
      price,
      quantity,
      tag,
      sno: nextSno, // ✅ Save sno
      image: uploaded.url,
    });

    res.status(201).json({ success: true, deal: newDeal });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create deal", error });
  }
};

// Update deal
exports.updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, price, quantity, tag, sno } = req.body;

    const updateData = {};

    if (title) updateData.title = title;
    if (subtitle) updateData.subtitle = subtitle;
    if (price) updateData.price = price;
    if (quantity) updateData.quantity = quantity;
    if (tag) updateData.tag = tag;
    if (sno !== undefined) updateData.sno = sno; // ✅ Update sno if sent

    if (req.files?.image) {
      const uploaded = await imagekit.upload({
        file: req.files.image.data.toString("base64"),
        fileName: `deal_${Date.now()}.jpg`,
        folder: "/deals",
      });
      updateData.image = uploaded.url;
    }

    const updated = await Deal.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ success: true, deal: updated });
  } catch (error) {
    console.error("Update deal error:", error);
    res.status(500).json({ success: false, message: "Failed to update deal" });
  }
};

// Delete deal
exports.deleteDeal = async (req, res) => {
  try {
    const deleted = await Deal.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Deal not found" });
    }

    res.status(200).json({ success: true, message: "Deal deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete deal", error });
  }
};
