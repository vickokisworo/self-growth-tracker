const Journal = require("../models/Journal");

exports.createJournal = async (req, res, next) => {
  try {
    const { date, mood, grateful_for, what_went_well, what_to_improve, notes } =
      req.body;
    const userId = req.user.id;

    const journal = await Journal.create({
      user_id: userId,
      date,
      mood,
      grateful_for,
      what_went_well,
      what_to_improve,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Journal entry created successfully",
      data: { journal },
    });
  } catch (error) {
    next(error);
  }
};

exports.getJournals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit } = req.query;

    const journals = await Journal.findByUserId(
      userId,
      limit ? parseInt(limit) : 30
    );

    res.json({
      success: true,
      data: { journals },
    });
  } catch (error) {
    next(error);
  }
};

exports.getJournalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const journal = await Journal.findById(id, userId);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    res.json({
      success: true,
      data: { journal },
    });
  } catch (error) {
    next(error);
  }
};

exports.getJournalByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;

    const journal = await Journal.findByDate(userId, date);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found for this date",
      });
    }

    res.json({
      success: true,
      data: { journal },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { date, mood, grateful_for, what_went_well, what_to_improve, notes } =
      req.body;

    const journal = await Journal.update(id, userId, {
      date,
      mood,
      grateful_for,
      what_went_well,
      what_to_improve,
      notes,
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    res.json({
      success: true,
      message: "Journal entry updated successfully",
      data: { journal },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const journal = await Journal.delete(id, userId);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    res.json({
      success: true,
      message: "Journal entry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
