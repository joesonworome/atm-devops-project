require("dotenv").config();
const mongoose = require("mongoose");
const Account = require("./models/Account");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected for account seeding");

    await Account.deleteMany({});

    await Account.create({
      accountNumber: "ACC001",
      name: "Student One",
      balance: 1000
    });

    console.log("✅ Account seeded successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();