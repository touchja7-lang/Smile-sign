require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'ป้ายไวนิล',
    pricingType: 'per_sqm',
    basePrice: 35,
    options: [
      { name: 'พับขอบตอกตาไก่', addOnPrice: 0 },
      { name: 'สอดท่อ', addOnPrice: 0 },
      { name: 'ร้อยเชือก', addOnPrice: 5 }
    ]
  },
  {
    name: 'สติกเกอร์ PVC',
    pricingType: 'per_sqm',
    basePrice: 45,
    options: [
      { name: 'ไดคัท', addOnPrice: 20 },
      { name: 'เคลือบเงา', addOnPrice: 15 },
      { name: 'เคลือบด้าน', addOnPrice: 15 }
    ]
  },
  {
    name: 'ป้ายตู้ไฟ',
    pricingType: 'per_unit',
    basePrice: 2800,
    options: [
      { name: 'เดินสายไฟ', addOnPrice: 500 }
    ]
  },
  {
    name: 'ป้ายอะคริลิก',
    pricingType: 'per_sqm',
    basePrice: 380,
    options: [
      { name: 'ซ่อนไฟ LED', addOnPrice: 1500 }
    ]
  }
];

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB Connected for Seeding...');
  await Product.deleteMany({});
  console.log('Old products cleared.');
  
  await Product.insertMany(products);
  console.log('New products injected successfully!');
  
  process.exit();
})
.catch((err) => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
