const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const username = String(req.body.username).trim();
    const pin = String(req.body.pin).trim();

    const user = await User.findOne({ username });

    if (!user || String(user.pin).trim() !== pin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      user: {
        username: user.username,
        accountNumber: user.accountNumber
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login server error"
    });
  }
};