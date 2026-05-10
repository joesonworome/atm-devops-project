const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const accountRoutes = require("./routes/accountRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Account Service connected to MongoDB"))
  .catch((err) => console.error("❌ Account Service MongoDB error:", err));

app.get("/health", (req, res) => {
  res.json({
    service: "account-service",
    status: "running"
  });
});

app.use("/api/account", accountRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Account Service running on port ${process.env.PORT}`);
});

