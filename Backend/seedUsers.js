require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Components/User/models/User"); // Adjust path if needed
const bcrypt = require("bcryptjs"); // For password hash

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    const users = [
      { fullName: "Alice", email: "alice@test.com", password: "123456" },
      { fullName: "Bob", email: "bob@test.com", password: "123456" },
      { fullName: "Charlie", email: "charlie@test.com", password: "123456" },
      { fullName: "David", email: "david@test.com", password: "123456" },
      { fullName: "Eve", email: "eve@test.com", password: "123456" },
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const passwordHash = await bcrypt.hash(u.password, 10);
        await User.create({
          fullName: u.fullName,
          email: u.email,
          passwordHash,
        });
      }
    }

    console.log("Users added!");
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));