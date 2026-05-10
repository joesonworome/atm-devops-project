const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Transaction Service connected to MongoDB"))
  .catch((err) => console.error("❌ Transaction Service MongoDB error:", err));

app.get("/health", (req, res) => {
  res.json({
    service: "transaction-service",
    status: "running"
  });
});

app.use("/api/transactions", transactionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Transaction Service running on port ${process.env.PORT}`);
});

