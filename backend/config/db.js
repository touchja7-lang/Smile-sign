const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // ไม่ให้ Server ระเบิดตัวเอง (ไม่ใช้ process.exit) เพื่อให้เรารู้ว่าปัญหาอยู่ที่ DB หรือส่วนอื่น
  }
};

module.exports = connectDB;
