const express = require("express");
const { body } = require("express-validator");
const habitController = require("../controllers/habitController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../utils/validator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  [
    body("name").notEmpty().withMessage("Habit name is required"),
    body("frequency")
      .optional()
      .isIn(["daily", "weekly", "monthly"])
      .withMessage("Invalid frequency"),
  ],
  validate,
  habitController.createHabit
);

router.get("/", authenticate, habitController.getHabits);

router.get("/:id", authenticate, habitController.getHabitById);

router.put(
  "/:id",
  authenticate,
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Habit name cannot be empty"),
    body("frequency")
      .optional()
      .isIn(["daily", "weekly", "monthly"])
      .withMessage("Invalid frequency"),
    body("is_active")
      .optional()
      .isBoolean()
      .withMessage("is_active must be a boolean"),
  ],
  validate,
  habitController.updateHabit
);

router.delete("/:id", authenticate, habitController.deleteHabit);

router.post(
  "/:id/log",
  authenticate,
  [
    body("completed").isBoolean().withMessage("completed must be a boolean"),
    body("date").optional().isDate().withMessage("Please provide a valid date"),
  ],
  validate,
  habitController.logHabit
);

router.get("/:id/logs", authenticate, habitController.getHabitLogs);

router.get("/:id/streak", authenticate, habitController.getHabitStreak);

module.exports = router;
