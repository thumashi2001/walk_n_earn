require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Components/User/models/User");
const bcrypt = require("bcrypt");

// 30 realistic Sri Lankan + international names
const USERS = [
  // ── Admin ──
  { fullName: "Admin",              email: "admin@walknearn.com",       password: "Admin@1234",  role: "admin",  totalPoints: 0    },
  // ── 30 Regular Users (500+ pts each) ──
  { fullName: "Kasun Perera",       email: "kasun@test.com",            password: "123456",      role: "user",   totalPoints: 1820 },
  { fullName: "Nimali Fernando",    email: "nimali@test.com",           password: "123456",      role: "user",   totalPoints: 2340 },
  { fullName: "Tharuka Silva",      email: "tharuka@test.com",          password: "123456",      role: "user",   totalPoints: 960  },
  { fullName: "Dinesh Rajapakse",   email: "dinesh@test.com",           password: "123456",      role: "user",   totalPoints: 1540 },
  { fullName: "Sachini Jayawardena",email: "sachini@test.com",          password: "123456",      role: "user",   totalPoints: 750  },
  { fullName: "Ruwan Kumara",       email: "ruwan@test.com",            password: "123456",      role: "user",   totalPoints: 2100 },
  { fullName: "Ishara Bandara",     email: "ishara@test.com",           password: "123456",      role: "user",   totalPoints: 1380 },
  { fullName: "Malini Herath",      email: "malini@test.com",           password: "123456",      role: "user",   totalPoints: 680  },
  { fullName: "Chaminda Vaas",      email: "chaminda@test.com",         password: "123456",      role: "user",   totalPoints: 3200 },
  { fullName: "Nadeesha Gunaratne", email: "nadeesha@test.com",         password: "123456",      role: "user",   totalPoints: 1050 },
  { fullName: "Lakshan Mendis",     email: "lakshan@test.com",          password: "123456",      role: "user",   totalPoints: 870  },
  { fullName: "Sanduni Wijesinghe", email: "sanduni@test.com",          password: "123456",      role: "user",   totalPoints: 1920 },
  { fullName: "Pradeep Ranasinghe", email: "pradeep@test.com",          password: "123456",      role: "user",   totalPoints: 560  },
  { fullName: "Hiruni Nikeshala",   email: "hiruni@test.com",           password: "123456",      role: "user",   totalPoints: 1440 },
  { fullName: "Janith De Silva",    email: "janith@test.com",           password: "123456",      role: "user",   totalPoints: 2560 },
  { fullName: "Nethmi Chathurangi", email: "nethmi@test.com",           password: "123456",      role: "user",   totalPoints: 780  },
  { fullName: "Amaya Liyanage",     email: "amaya@test.com",            password: "123456",      role: "user",   totalPoints: 1690 },
  { fullName: "Dulanga Abeysekara", email: "dulanga@test.com",          password: "123456",      role: "user",   totalPoints: 2850 },
  { fullName: "Rashmi Athukorala",  email: "rashmi@test.com",           password: "123456",      role: "user",   totalPoints: 620  },
  { fullName: "Pasindu Wickrama",   email: "pasindu@test.com",          password: "123456",      role: "user",   totalPoints: 1260 },
  { fullName: "Kaveesha Peris",     email: "kaveesha@test.com",         password: "123456",      role: "user",   totalPoints: 980  },
  { fullName: "Nuwan Pradeep",      email: "nuwan@test.com",            password: "123456",      role: "user",   totalPoints: 3050 },
  { fullName: "Dilini Samaraweera", email: "dilini@test.com",           password: "123456",      role: "user",   totalPoints: 1150 },
  { fullName: "Sahan Pathirana",    email: "sahan@test.com",            password: "123456",      role: "user",   totalPoints: 2200 },
  { fullName: "Thisuri Weerasinghe",email: "thisuri@test.com",          password: "123456",      role: "user",   totalPoints: 540  },
  { fullName: "Geethika Dissanayake",email: "geethika@test.com",        password: "123456",      role: "user",   totalPoints: 1780 },
  { fullName: "Buddhika Senanayake",email: "buddhika@test.com",         password: "123456",      role: "user",   totalPoints: 910  },
  { fullName: "Oshadi Karunarathne",email: "oshadi@test.com",           password: "123456",      role: "user",   totalPoints: 1620 },
  { fullName: "Yasith Gamage",      email: "yasith@test.com",           password: "123456",      role: "user",   totalPoints: 2480 },
  { fullName: "Chathura Lakmal",    email: "chathura@test.com",         password: "123456",      role: "user",   totalPoints: 730  },
  { fullName: "Softedge Innovations",email: "softedgeinnovations@gmail.com", password: "123456", role: "user",   totalPoints: 5000 },
  { fullName: "Deshan MSI",         email: "msideshan@gmail.com",            password: "123456", role: "user",   totalPoints: 4800 },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    let created = 0;
    let skipped = 0;

    for (const u of USERS) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`  skip  ${u.email}`);
        skipped++;
        continue;
      }
      const passwordHash = await bcrypt.hash(u.password, 10);
      await User.create({
        fullName:    u.fullName,
        email:       u.email,
        passwordHash,
        role:        u.role,
        totalPoints: u.totalPoints,
      });
      console.log(`  +  ${u.fullName} (${u.email}) — ${u.totalPoints} pts`);
      created++;
    }

    console.log(`\nDone — ${created} created, ${skipped} skipped (already existed).`);
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));