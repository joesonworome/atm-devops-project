const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/history/:accountNumber", transactionController.getHistory);
router.post("/", transactionController.createTransaction);

module.exports = router;
