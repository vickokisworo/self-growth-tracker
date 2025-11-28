const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../utils/validator");

const router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  authController.login
);

router.get("/profile", authenticate, authController.getProfile);

module.exports = router;
