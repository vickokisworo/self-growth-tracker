const Goal = require("../models/Goal");

exports.createGoal = async (req, res, next) => {
  try {
    const { title, description, why_important, deadline } = req.body;
    const userId = req.user.id;

    const goal = await Goal.create({
      user_id: userId,
      title,
      description,
      why_important,
      deadline,
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: { goal },
    });
  } catch (error) {
    next(error);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goals = await Goal.findByUserId(userId);

    res.json({
      success: true,
      data: { goals },
    });
  } catch (error) {
    next(error);
  }
};

exports.getGoalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findById(id, userId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    // Get steps
    const steps = await Goal.getSteps(id);
    goal.steps = steps;

    res.json({
      success: true,
      data: { goal },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, why_important, deadline, status } = req.body;

    const goal = await Goal.update(id, userId, {
      title,
      description,
      why_important,
      deadline,
      status,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      message: "Goal updated successfully",
      data: { goal },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.delete(id, userId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.addStep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { step_title, order_number } = req.body;

    // Verify goal belongs to user
    const goal = await Goal.findById(id, userId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const step = await Goal.addStep({
      goal_id: id,
      step_title,
      order_number,
    });

    res.status(201).json({
      success: true,
      message: "Step added successfully",
      data: { step },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStep = async (req, res, next) => {
  try {
    const { stepId } = req.params;
    const { completed } = req.body;

    const step = await Goal.updateStep(stepId, completed);

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    res.json({
      success: true,
      message: "Step updated successfully",
      data: { step },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteStep = async (req, res, next) => {
  try {
    const { stepId } = req.params;

    const step = await Goal.deleteStep(stepId);

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    res.json({
      success: true,
      message: "Step deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
