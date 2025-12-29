const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri, {
      // options can be added here if needed
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // Exit process if we can't connect
    process.exit(1);
  }
}

module.exports = connectDB;
