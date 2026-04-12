const express = require("express");
const router = express.Router();

// 🔥 FIXED PATH (matches your file name)
const authController = require("../controllers/authControllers");

router.post("/login", authController.login);

module.exports = router;