// backend/src/controllers/todoController.js
const Todo = require("../models/Todo");

exports.createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const userId = req.user.id;

    const todo = await Todo.create({
      user_id: userId,
      title,
      description,
      priority,
      due_date,
    });

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: { todo },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date, completed } = req.query;

    const filters = {};
    if (date) filters.date = date;
    if (completed !== undefined) filters.completed = completed === "true";

    const todos = await Todo.findByUserId(userId, filters);

    res.json({
      success: true,
      data: { todos },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const todo = await Todo.findById(id, userId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.json({
      success: true,
      data: { todo },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, priority, due_date, completed } = req.body;

    const todo = await Todo.update(id, userId, {
      title,
      description,
      priority,
      due_date,
      completed,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.json({
      success: true,
      message: "Todo updated successfully",
      data: { todo },
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleComplete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const todo = await Todo.toggleComplete(id, userId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.json({
      success: true,
      message: "Todo status updated",
      data: { todo },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const todo = await Todo.delete(id, userId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCompleted = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Todo.deleteCompleted(userId);

    res.json({
      success: true,
      message: "Completed todos deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const stats = await Todo.getStats(userId);

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};
