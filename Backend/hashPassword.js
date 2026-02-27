const bcrypt = require("bcrypt");

async function hash() {
  const hashed = await bcrypt.hash("123456", 10);
  console.log(hashed);
}

hash();