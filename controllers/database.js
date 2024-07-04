const mongoose = require('mongoose');
const DB_URL = process.env.MONGODB_URI


const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = connectDB;
