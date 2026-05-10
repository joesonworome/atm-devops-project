const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/", transactionController.createTransaction);
router.get("/:accountNumber", transactionController.getTransactionsByAccount);

module.exports = router;