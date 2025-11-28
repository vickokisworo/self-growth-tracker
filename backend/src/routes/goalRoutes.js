const express = require("express");
const { body } = require("express-validator");
const goalController = require("../controllers/goalController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../utils/validator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  [
    body("title").notEmpty().withMessage("Goal title is required"),
    body("deadline")
      .optional()
      .isDate()
      .withMessage("Please provide a valid date"),
  ],
  validate,
  goalController.createGoal
);

router.get("/", authenticate, goalController.getGoals);

router.get("/:id", authenticate, goalController.getGoalById);

router.put(
  "/:id",
  authenticate,
  [
    body("title")
      .optional()
      .notEmpty()
      .withMessage("Goal title cannot be empty"),
    body("deadline")
      .optional()
      .isDate()
      .withMessage("Please provide a valid date"),
    body("status")
      .optional()
      .isIn(["in_progress", "completed", "cancelled"])
      .withMessage("Invalid status"),
  ],
  validate,
  goalController.updateGoal
);

router.delete("/:id", authenticate, goalController.deleteGoal);

router.post(
  "/:id/steps",
  authenticate,
  [
    body("step_title").notEmpty().withMessage("Step title is required"),
    body("order_number")
      .optional()
      .isInt()
      .withMessage("Order number must be an integer"),
  ],
  validate,
  goalController.addStep
);

router.put(
  "/steps/:stepId",
  authenticate,
  [body("completed").isBoolean().withMessage("completed must be a boolean")],
  validate,
  goalController.updateStep
);

router.delete("/steps/:stepId", authenticate, goalController.deleteStep);

module.exports = router;
