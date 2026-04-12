const Account = require("../models/Account");

exports.getBalance = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    return res.json({
      success: true,
      account: {
        accountNumber: account.accountNumber,
        name: account.name,
        balance: account.balance
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get balance",
      error: error.message
    });
  }
};

exports.deposit = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    if (!accountNumber || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Account number and amount are required"
      });
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    account.balance += numericAmount;
    await account.save();

    return res.json({
      success: true,
      message: "Deposit successful",
      account: {
        accountNumber: account.accountNumber,
        balance: account.balance
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Deposit failed",
      error: error.message
    });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    if (!accountNumber || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Account number and amount are required"
      });
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    if (account.balance < numericAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient funds"
      });
    }

    account.balance -= numericAmount;
    await account.save();

    return res.json({
      success: true,
      message: "Withdrawal successful",
      account: {
        accountNumber: account.accountNumber,
        balance: account.balance
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Withdrawal failed",
      error: error.message
    });
  }
};