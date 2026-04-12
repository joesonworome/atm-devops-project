const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const accountRoutes = require("./routes/accountRoutes");

const app = express();
const PORT = 4002;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/atmdb")
  .then(() => console.log("✅ Account DB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

app.get("/health", (req, res) => {
  res.json({ service: "account-service", status: "running" });
});

app.use("/api/account", accountRoutes);

app.listen(PORT, () => {
  console.log(`Account service running on port ${PORT}`);
});