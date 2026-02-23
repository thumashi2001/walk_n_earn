const HealthAdvice = require("../models/HealthAdvice");

// ========================
// CREATE – New Health Advice
// ========================
exports.createHealthAdvice = async (req, res) => {
  try {
    const advice = await HealthAdvice.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Health advice created successfully",
      data: advice,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================
// READ – Get All Health Advices
// ========================
exports.getAllHealthAdvices = async (req, res) => {
  try {
    const advices = await HealthAdvice.find().sort({
      priority: -1,
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      count: advices.length,
      data: advices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================
// READ – Get Single Health Advice by ID
// ========================
exports.getHealthAdviceById = async (req, res) => {
  try {
    const advice = await HealthAdvice.findById(req.params.id);
    if (!advice) {
      return res
        .status(404)
        .json({ success: false, message: "Advice not found" });
    }
    return res.status(200).json({ success: true, data: advice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// UPDATE – Update Health Advice by ID
// ========================
exports.updateHealthAdvice = async (req, res) => {
  try {
    const advice = await HealthAdvice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return updated document
        runValidators: true, // ensure schema validation runs
      },
    );

    if (!advice) {
      return res
        .status(404)
        .json({ success: false, message: "Advice not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Health advice updated successfully",
      data: advice,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================
// DELETE – Delete Health Advice by ID
// ========================
exports.deleteHealthAdvice = async (req, res) => {
  try {
    const advice = await HealthAdvice.findByIdAndDelete(req.params.id);
    if (!advice) {
      return res
        .status(404)
        .json({ success: false, message: "Advice not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Health advice deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
