const HealthAdvice = require("../models/HealthAdvice");
const {
  validateHealthAdviceRequest,
} = require("../validators/healthAdviceValidator");

// CREATE – New Health Advice
exports.createHealthAdvice = async (req, res) => {
  try {
    const errors = validateHealthAdviceRequest(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

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

// READ – Get All Health Advices
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

// READ – Get Single Health Advice by ID
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

// UPDATE – Update Health Advice by ID
exports.updateHealthAdvice = async (req, res) => {
  try {
    const errors = validateHealthAdviceRequest(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const advice = await HealthAdvice.findById(req.params.id);
    if (!advice) {
      return res.status(404).json({
        success: false,
        message: "Advice not found",
      });
    }

    Object.assign(advice, req.body);
    await advice.save(); // triggers schema + pre("validate") checks

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

// DELETE – Delete Health Advice by ID
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
