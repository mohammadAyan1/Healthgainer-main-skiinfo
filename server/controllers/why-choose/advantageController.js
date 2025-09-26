const Advantage = require("../../models/why-choose/advantageModel.js");

exports.createAdvantage = async (req, res) => {
  const { text } = req.body;
  const adv = await Advantage.create({ text });
  res.status(201).json({ success: true, advantage: adv });
};

exports.getAllAdvantages = async (req, res) => {
  const advantages = await Advantage.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, advantages });
};

exports.updateAdvantage = async (req, res) => {
  const { text } = req.body;
  const updated = await Advantage.findByIdAndUpdate(req.params.id, { text }, { new: true });
  res.status(200).json({ success: true, advantage: updated });
};

exports.deleteAdvantage = async (req, res) => {
  await Advantage.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Advantage deleted" });
};
