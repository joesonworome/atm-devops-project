const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Auth Service connected to MongoDB"))
  .catch((err) => console.error("❌ Auth Service MongoDB error:", err));

app.get("/health", (req, res) => {
  res.json({
    service: "auth-service",
    status: "running"
  });
});

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Auth Service running on port ${process.env.PORT}`);
});

