const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "api-gateway", status: "running" });
});

// Proxy routes to auth service
app.post("/api/auth/login", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:4001/api/auth/login", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: "Auth service error" });
  }
});

// Proxy routes to account service
app.get("/api/account/balance/:accountNumber", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:4002/api/account/balance/${req.params.accountNumber}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: "Account service error" });
  }
});

app.post("/api/account/deposit", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:4002/api/account/deposit", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: "Account service error" });
  }
});

app.post("/api/account/withdraw", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:4002/api/account/withdraw", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: "Account service error" });
  }
});

// Proxy routes to transaction service
app.get("/api/transaction/history/:accountNumber", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:4003/api/transaction/history/${req.params.accountNumber}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: "Transaction service error" });
  }
});

app.post("/api/transaction", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:4003/api/transaction", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: "Transaction service error" });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
