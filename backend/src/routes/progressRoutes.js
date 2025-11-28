const express = require("express");
const { body } = require("express-validator");
const progressController = require("../controllers/progressController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../utils/validator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  [
    body("category").notEmpty().withMessage("Category is required"),
    body("rating")
      .isInt({ min: 1, max: 10 })
      .withMessage("Rating must be between 1 and 10"),
    body("date").optional().isDate().withMessage("Please provide a valid date"),
  ],
  validate,
  progressController.createProgress
);

router.get("/", authenticate, progressController.getProgress);

router.get("/:id", authenticate, progressController.getProgressById);

router.put(
  "/:id",
  authenticate,
  [
    body("category")
      .optional()
      .notEmpty()
      .withMessage("Category cannot be empty"),
    body("rating")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Rating must be between 1 and 10"),
    body("date").optional().isDate().withMessage("Please provide a valid date"),
  ],
  validate,
  progressController.updateProgress
);

router.delete("/:id", authenticate, progressController.deleteProgress);

module.exports = router;
