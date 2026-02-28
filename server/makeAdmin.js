require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// Usage: node server/makeAdmin.js <email>
const email = process.argv[2];

if (!email) {
  console.error("Usage: node server/makeAdmin.js <email>");
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/fitsupps"
    );
    console.log("Connected to database");

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();
    
    console.log(`User ${user.name} (${user.email}) is now an admin`);
    process.exit(0);
  } catch (error) {
    console.error("Error making user admin:", error);
    process.exit(1);
  }
}

makeAdmin();

