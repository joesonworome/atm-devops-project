const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4003;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "transaction-service", status: "running" });
});

app.listen(PORT, () => {
  console.log(`Transaction service running on port ${PORT}`);
});