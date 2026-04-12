const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/atmdb");

async function seed() {
  await User.deleteMany({});

  await User.create({
    username: "student1",
    pin: "1234",
    accountNumber: "ACC001"
  });

  console.log("✅ User seeded");
  process.exit();
}

seed();