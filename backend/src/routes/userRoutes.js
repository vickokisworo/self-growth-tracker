const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../utils/validator");

const router = express.Router();

router.put(
  "/profile",
  authenticate,
  [
    body("username")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email"),
  ],
  validate,
  userController.updateProfile
);

router.delete("/account", authenticate, userController.deleteAccount);

module.exports = router;
