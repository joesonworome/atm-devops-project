const mongoose = require("mongoose");
const Account = require("./models/Account");

mongoose.connect("mongodb://localhost:27017/atmdb")
  .then(() => console.log("MongoDB connected for account seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function seed() {
  try {
    await Account.deleteMany({});

    await Account.create({
      accountNumber: "ACC001",
      name: "Student One",
      balance: 1000
    });

    console.log("✅ Account seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();