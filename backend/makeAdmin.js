/**
 * makeAdmin.js
 * สคริปต์สำหรับเปลี่ยนสิทธิ์ผู้ใช้เป็น Admin
 * ใช้คำสั่ง: node makeAdmin.js <email>
 */
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const email = process.argv[2];

if (!email) {
  console.error('❌ กรุณาระบุอีเมล: node makeAdmin.js your@email.com');
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'Admin' },
      { new: true }
    );

    if (!user) {
      console.error(`❌ ไม่พบผู้ใช้ที่มีอีเมล: ${email}`);
      process.exit(1);
    }

    console.log(`✅ อัปเกรดสิทธิ์สำเร็จ!`);
    console.log(`   ชื่อ: ${user.name}`);
    console.log(`   อีเมล: ${user.email}`);
    console.log(`   สิทธิ์: ${user.role}`);
    console.log('');
    console.log('👉 ให้ล็อกเอาท์และล็อกอินใหม่เพื่อให้สิทธิ์มีผล');

  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
