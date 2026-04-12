const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 4001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/atmdb")
  .then(() => console.log("✅ Auth DB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "auth-service", status: "running" });
});

// 🔥 IMPORTANT — connect routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});