require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    await User.deleteMany({});

    await User.create({
      username: "student1",
      pin: "1234",
      accountNumber: "ACC001"
    });

    console.log("✅ User seeded");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

seed();