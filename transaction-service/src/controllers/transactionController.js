const Transaction = require("../models/Transaction");

exports.getHistory = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const transactions = await Transaction.find({ accountNumber }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load transactions",
      error: error.message
    });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { accountNumber, amount, type, description } = req.body;

    if (!accountNumber || amount === undefined || !type) {
      return res.status(400).json({
        success: false,
        message: "accountNumber, amount, and type are required"
      });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    const transaction = await Transaction.create({
      accountNumber,
      amount: numericAmount,
      type,
      description
    });

    return res.status(201).json({
      success: true,
      transaction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create transaction",
      error: error.message
    });
  }
};
