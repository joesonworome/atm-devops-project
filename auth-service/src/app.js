const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/atmdb";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (non-blocking)
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Auth DB connected"))
  .catch((err) => console.error("⚠️ DB connection error (service will continue):", err.message));

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "auth-service", status: "running" });
});

// 🔥 IMPORTANT — connect routes
app.use("/api/auth", authRoutes);

// Start server (independent of DB connection)
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});