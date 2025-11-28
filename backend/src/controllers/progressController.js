const Progress = require("../models/Progress");

exports.createProgress = async (req, res, next) => {
  try {
    const { category, rating, notes, date } = req.body;
    const userId = req.user.id;

    const progress = await Progress.create({
      user_id: userId,
      category,
      rating,
      notes,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Progress created successfully",
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, startDate, endDate } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const progress = await Progress.findByUserId(userId, filters);

    res.json({
      success: true,
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const progress = await Progress.findById(id, userId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    res.json({
      success: true,
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { category, rating, notes, date } = req.body;

    const progress = await Progress.update(id, userId, {
      category,
      rating,
      notes,
      date,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    res.json({
      success: true,
      message: "Progress updated successfully",
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const progress = await Progress.delete(id, userId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    res.json({
      success: true,
      message: "Progress deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
