const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const accountRoutes = require("./routes/accountRoutes");

const app = express();
const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/atmdb";

app.use(cors());
app.use(express.json());

// MongoDB connection (non-blocking)
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Account DB connected"))
  .catch((err) => console.error("⚠️ DB connection error (service will continue):", err.message));

app.get("/health", (req, res) => {
  res.json({ service: "account-service", status: "running" });
});

app.use("/api/account", accountRoutes);

// Start server (independent of DB connection)
app.listen(PORT, () => {
  console.log(`Account service running on port ${PORT}`);
});