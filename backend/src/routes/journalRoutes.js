const express = require("express");
const { body } = require("express-validator");
const journalController = require("../controllers/journalController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../utils/validator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  [body("date").optional().isDate().withMessage("Please provide a valid date")],
  validate,
  journalController.createJournal
);

router.get("/", authenticate, journalController.getJournals);

router.get("/:id", authenticate, journalController.getJournalById);

router.get("/date/:date", authenticate, journalController.getJournalByDate);

router.put(
  "/:id",
  authenticate,
  [body("date").optional().isDate().withMessage("Please provide a valid date")],
  validate,
  journalController.updateJournal
);

router.delete("/:id", authenticate, journalController.deleteJournal);

module.exports = router;
