const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController.js");

router.get("/balance/:accountNumber", accountController.getBalance);
router.post("/deposit", accountController.deposit);
router.post("/withdraw", accountController.withdraw);

module.exports = router;