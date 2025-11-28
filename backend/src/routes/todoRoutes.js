// backend/src/routes/todoRoutes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const todoController = require("../controllers/todoController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../utils/validator");

// Get all todos
router.get("/", authenticate, todoController.getTodos);

// Get todo by ID
router.get("/:id", authenticate, todoController.getTodoById);

// Get stats
router.get("/stats/summary", authenticate, todoController.getStats);

// Create todo
router.post(
  "/",
  authenticate,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    body("due_date").optional().isDate().withMessage("Invalid date format"),
  ],
  validate,
  todoController.createTodo
);

// Update todo
router.put(
  "/:id",
  authenticate,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().isString(),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    body("due_date").optional().isDate().withMessage("Invalid date format"),
    body("completed").optional().isBoolean(),
  ],
  validate,
  todoController.updateTodo
);

// Toggle complete
router.patch("/:id/toggle", authenticate, todoController.toggleComplete);

// Delete todo
router.delete("/:id", authenticate, todoController.deleteTodo);

// Delete all completed
router.delete("/completed/all", authenticate, todoController.deleteCompleted);

module.exports = router;
