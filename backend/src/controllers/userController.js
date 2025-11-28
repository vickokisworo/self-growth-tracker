const User = require("../models/User");

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    const user = await User.update(userId, { username, email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.delete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
