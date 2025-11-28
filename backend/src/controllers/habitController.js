const Habit = require("../models/Habit");

exports.createHabit = async (req, res, next) => {
  try {
    const { name, description, frequency, reminder_time } = req.body;
    const userId = req.user.id;

    const habit = await Habit.create({
      user_id: userId,
      name,
      description,
      frequency,
      reminder_time,
    });

    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      data: { habit },
    });
  } catch (error) {
    next(error);
  }
};

exports.getHabits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.findByUserId(userId);

    res.json({
      success: true,
      data: { habits },
    });
  } catch (error) {
    next(error);
  }
};

exports.getHabitById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const habit = await Habit.findById(id, userId);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.json({
      success: true,
      data: { habit },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, frequency, reminder_time, is_active } = req.body;

    const habit = await Habit.update(id, userId, {
      name,
      description,
      frequency,
      reminder_time,
      is_active,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.json({
      success: true,
      message: "Habit updated successfully",
      data: { habit },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const habit = await Habit.delete(id, userId);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.logHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { completed, date, notes } = req.body;

    // Verify habit belongs to user
    const habit = await Habit.findById(id, userId);
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    const log = await Habit.logHabit({
      habit_id: id,
      completed,
      date,
      notes,
    });

    res.json({
      success: true,
      message: "Habit logged successfully",
      data: { log },
    });
  } catch (error) {
    next(error);
  }
};

exports.getHabitLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Verify habit belongs to user
    const habit = await Habit.findById(id, userId);
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    const logs = await Habit.getHabitLogs(id, startDate, endDate);

    res.json({
      success: true,
      data: { logs },
    });
  } catch (error) {
    next(error);
  }
};

exports.getHabitStreak = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify habit belongs to user
    const habit = await Habit.findById(id, userId);
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    const streak = await Habit.getStreak(id);

    res.json({
      success: true,
      data: { streak: streak.streak || 0 },
    });
  } catch (error) {
    next(error);
  }
};
