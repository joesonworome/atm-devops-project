const User = require("../models/User");

exports.login = async (req, res) => {
  const { username, pin } = req.body;

  const user = await User.findOne({ username, pin });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  res.json({
    success: true,
    user
  });
};