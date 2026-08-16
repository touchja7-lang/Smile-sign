require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const lightboxOptions = [
  { name: 'ออกแบบลายกราฟิก (Design Service)', addOnPrice: 500 }
];

const stickerOptions = [
  { name: 'ไดคัทตามทรง (Die-cut)', addOnPrice: 20 },
  { name: 'เคลือบเงา (Glossy Lamination)', addOnPrice: 15 },
  { name: 'เคลือบด้าน (Matte Lamination)', addOnPrice: 15 }
];

const products = [
  // ─── ป้ายตู้ไฟ (Lightboxes) ───
  { name: 'ตู้ไฟกลม (หน้าเรียบ) R40', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 850, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (หน้าเรียบ) R50', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 980, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (หน้าเรียบ) R60', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1080, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (หน้าเรียบ) R70', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1750, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (หน้าเรียบ) R80', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 2100, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (หน้าเรียบ) R100', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 2900, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (หน้าเรียบ) R120', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 3600, options: lightboxOptions },
  
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R30', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 600, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R40', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 800, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R50', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 900, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R60', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1000, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R70', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1400, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R80', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1900, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R90', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 2200, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R100', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 2650, options: lightboxOptions },
  { name: 'ตู้ไฟกลม (ปั๊มนูน) R120', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 3500, options: lightboxOptions },
  
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 20x40', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 700, options: lightboxOptions },
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 40x60', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1000, options: lightboxOptions },
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 50x70', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1200, options: lightboxOptions },
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 55x55', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1200, options: lightboxOptions },
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 60x60', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1200, options: lightboxOptions },
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 60x90', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1500, options: lightboxOptions },
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 80x55', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1500, options: lightboxOptions },
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 80x80', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 2000, options: lightboxOptions },
  { name: 'ตู้ไฟเหลี่ยม (ปั๊มนูน) 80x120', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 2500, options: lightboxOptions },
  
  { name: 'ตู้ไฟวงรี (ปั๊มนูน) 55x80', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1500, options: lightboxOptions },
  { name: 'ตู้ไฟวงรี (ปั๊มนูน) 50x100', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1700, options: lightboxOptions },
  
  { name: 'กล่องไฟ คริสตัล แบบบาง A4', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 1100, options: lightboxOptions },
  { name: 'กล่องไฟ คริสตัล แบบบาง A3', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 1200, options: lightboxOptions },
  { name: 'กล่องไฟ คริสตัล แบบบาง A2', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 1700, options: lightboxOptions },
  { name: 'กล่องไฟ คริสตัล แบบบาง A1', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 2800, options: lightboxOptions },
  { name: 'กล่องไฟ คริสตัล แบบบาง A0', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 5500, options: lightboxOptions },
  
  { name: 'กล่องไฟ LED แบบบาง A4', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 800, options: lightboxOptions },
  { name: 'กล่องไฟ LED แบบบาง A3', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 900, options: lightboxOptions },
  { name: 'กล่องไฟ LED แบบบาง A2', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 1000, options: lightboxOptions },
  { name: 'กล่องไฟ LED แบบบาง A1', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 1600, options: lightboxOptions },
  { name: 'กล่องไฟ LED แบบบาง A0', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 3200, options: lightboxOptions },
  
  { name: 'กล่องไฟ LED แม่เหล็ก A4', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 1100, options: lightboxOptions },
  { name: 'กล่องไฟ LED แม่เหล็ก A3', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 1200, options: lightboxOptions },
  { name: 'กล่องไฟ LED แม่เหล็ก A2', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 1500, options: lightboxOptions },
  { name: 'กล่องไฟ LED แม่เหล็ก A1', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 2500, options: lightboxOptions },
  { name: 'กล่องไฟ LED แม่เหล็ก A0', category: 'กล่องไฟแบบบาง', pricingType: 'per_unit', basePrice: 4800, options: lightboxOptions },
  
  { name: 'ตู้ไฟ ตั้งพื้น 2 หน้า 60x160cm', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 8500, options: lightboxOptions },
  { name: 'ตู้ไฟ ตั้งพื้น 2 หน้า 30x150cm', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 1500, options: lightboxOptions },
  { name: 'ตู้ไฟ 2 หน้า (ล้อเลื่อน) 60x120cm', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 6900, options: lightboxOptions },
  { name: 'ตู้ไฟ 2 หน้า (ล้อเลื่อน) 80x120cm', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 7900, options: lightboxOptions },
  { name: 'ตู้ไฟ 2 หน้า (ล้อเลื่อน) 80x150cm', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 9900, options: lightboxOptions },
  { name: 'ตู้ไฟ 2 หน้า (ล้อเลื่อน) 100x180cm', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 12900, options: lightboxOptions },
  { name: 'ตู้ไฟ 2 หน้า (ล้อเลื่อน) 120x240cm', category: 'ป้ายตู้ไฟ (Lightbox)', pricingType: 'per_unit', basePrice: 18900, options: lightboxOptions },
  
  { name: 'กรอบป้ายแบบบาง (ไม่มีไฟ) A4', category: 'กรอบป้ายไม่มีไฟ', pricingType: 'per_unit', basePrice: 300, options: [] },
  { name: 'กรอบป้ายแบบบาง (ไม่มีไฟ) A3', category: 'กรอบป้ายไม่มีไฟ', pricingType: 'per_unit', basePrice: 350, options: [] },
  { name: 'กรอบป้ายแบบบาง (ไม่มีไฟ) A2', category: 'กรอบป้ายไม่มีไฟ', pricingType: 'per_unit', basePrice: 550, options: [] },
  { name: 'กรอบป้ายแบบบาง (ไม่มีไฟ) A1', category: 'กรอบป้ายไม่มีไฟ', pricingType: 'per_unit', basePrice: 890, options: [] },
  { name: 'กรอบป้ายแบบบาง (ไม่มีไฟ) A0', category: 'กรอบป้ายไม่มีไฟ', pricingType: 'per_unit', basePrice: 1800, options: [] },

  // ─── วัสดุพิมพ์ Outdoor (Stickers & Canvas) ───
  { name: 'สติ๊กเกอร์พีวีซี กาวเทารีมูฟ (Panda)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 35, options: stickerOptions },
  { name: 'สติ๊กเกอร์พีวีซี 125g (Panda)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 25, options: stickerOptions },
  { name: 'สติ๊กเกอร์พีวีซี 140g (Panda)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 30, options: stickerOptions },
  { name: 'สติ๊กเกอร์พีวีซี 140g (กาวดำ) (Panda)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 35, options: stickerOptions },
  { name: 'สติ๊กเกอร์ ขาวเงา (Senven jet)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 56, options: stickerOptions },
  { name: 'สติ๊กเกอร์ ขาวด้าน / ใส (Senven jet)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 58, options: stickerOptions },
  { name: 'สติ๊กเกอร์ ขาวเงา/ขาวด้าน/ใส (FS)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 57, options: stickerOptions },
  { name: 'สติ๊กเกอร์ ฟู่ซุ่น ขาวด้าน ตู้ไฟ (FS)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 59, options: stickerOptions },
  { name: 'สติ๊กเกอร์ ฟู่ซุ่น ฝ้า (FS)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 57, options: stickerOptions },
  { name: 'สติ๊กเกอร์ ขาวเงา/ขาวด้าน/ใส/ฝ้า (HP Colorpro)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 49, options: stickerOptions },
  { name: 'สติ๊กเกอร์ ขาวเงา(กาวเทารีมูฟ) (HP Colorpro)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 59, options: stickerOptions },
  { name: 'สติ๊กเกอร์ขาวเงา 3M เกรด 2 ปี', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 100, options: stickerOptions },
  { name: 'สติ๊กเกอร์ใส 140g (Panda)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 38, options: stickerOptions },
  { name: 'ซีทรู (One way vision)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 70, options: [] },
  { name: 'สติ๊กเกอร์สูญญากาศ ขาว/ใส', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 70, options: stickerOptions },
  { name: 'ฟิล์มเคลือบติดพื้น (Floor Graphics Film 200g)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 55, options: [] },
  { name: 'ผ้าไอที (IT cloth outdoor)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 30, options: [] },
  { name: 'Eco พีพีฟิล์มด้าน 200g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 35, options: [] },
  { name: 'Eco พีพีฟิล์มด้าน 240g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 35, options: [] },
  { name: 'Eco พีอีที ด้าน(หลังเทา) 200g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 50, options: [] },
  { name: 'Eco พีอีที ด้าน(หลังเทา) 380g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 60, options: [] },
  { name: 'Eco พีอีทีใส 250g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 75, options: [] },
  { name: 'Eco พีพีสติกเกอร์ 150g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 38, options: stickerOptions },
  { name: 'Eco กระดาษโฟโต้ 220g ด้าน', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 39, options: [] },
  { name: 'Eco กระดาษโฟโต้ 260g เงา', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 37, options: [] },
  { name: 'Eco แบคลิสฟิล์ม 125g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 75, options: [] },
  { name: 'Eco แบคลิสฟิล์ม 175g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 95, options: [] },
  { name: 'ECO แคนวาส(แบบเงา) 280g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 90, options: [] },
  { name: 'ECO แคนวาส(แบบเงา) 280g (HP Colorpro)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 90, options: [] },
  { name: 'ECO แคนวาส(แบบเงา) 300g (HP Colorpro)', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 75, options: [] },
  { name: 'ECO แคนวาส(แบบด้าน) 280g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 85, options: [] },
  { name: 'ECO สติกเกอร์ วอลล์ แคนวาส 380g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 120, options: stickerOptions },
  { name: 'ECO แคนวาส หลังเหลือง(แบบเงา) 370g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 150, options: [] },
  { name: 'ECO แคนวาส หลังเหลือง(แบบด้าน) 370g', category: 'วัสดุพิมพ์ Outdoor (Sticker & Canvas)', pricingType: 'per_sqm', basePrice: 150, options: [] }
];

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB Connected for Panda JET Seeding...');
  await Product.deleteMany({});
  console.log('Old products cleared.');
  
  await Product.insertMany(products);
  console.log(`New Panda JET products (${products.length} items) injected successfully!`);
  
  process.exit();
})
.catch((err) => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
