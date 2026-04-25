const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 4003;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/atmdb";

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Transaction DB connected"))
  .catch((err) => console.error("⚠️ DB connection error (service will continue):", err.message));

app.get("/health", (req, res) => {
  res.json({ service: "transaction-service", status: "running" });
});

app.use("/api/transaction", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Transaction service running on port ${PORT}`);
});