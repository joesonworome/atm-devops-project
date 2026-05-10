const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { accountNumber, type, amount } = req.body;

    if (!accountNumber || !type || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Account number, type, and amount are required"
      });
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a number greater than 0"
      });
    }

    const transaction = await Transaction.create({
      accountNumber,
      type,
      amount: numericAmount
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
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

exports.getTransactionsByAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const transactions = await Transaction.find({ accountNumber }).sort({
      timestamp: -1
    });

    return res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions",
      error: error.message
    });
  }
};

