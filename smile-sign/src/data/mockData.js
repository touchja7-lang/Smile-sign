// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockUser = null; // Cleared mock user

export const sellerLevels = [
  {
    name: 'Bronze',
    minSales: 0,
    maxSales: 30000,
    discount: 10,
    color: 'var(--bronze)',
    bg: 'var(--bronze-bg)',
    icon: '🥉',
  },
  {
    name: 'Silver',
    minSales: 30000,
    maxSales: 100000,
    discount: 15,
    color: 'var(--silver)',
    bg: 'var(--silver-bg)',
    icon: '🥈',
  },
  {
    name: 'Gold',
    minSales: 100000,
    maxSales: 300000,
    discount: 20,
    color: 'var(--gold)',
    bg: 'var(--gold-bg)',
    icon: '🥇',
  },
  {
    name: 'Platinum',
    minSales: 300000,
    maxSales: null,
    discount: 25,
    color: 'var(--platinum)',
    bg: 'var(--platinum-bg)',
    icon: '💎',
  },
];

export const monthlyCoupons = [
  {
    id: 'coup-001',
    code: 'SMILE-AUG10',
    title: 'ลด 10% ไวนิลทุกชนิด',
    description: 'สำหรับคำสั่งซื้อขั้นต่ำ 5 ตร.ม.',
    discount: 10,
    type: 'percent',
    expiry: '2026-08-31',
    used: false,
    productType: 'vinyl',
  },
  {
    id: 'coup-002',
    code: 'BULK-500',
    title: 'ส่วนลด ฿500 สั่ง 10 ชิ้นขึ้นไป',
    description: 'งานป้ายประเภทใดก็ได้',
    discount: 500,
    type: 'fixed',
    expiry: '2026-08-31',
    used: false,
    productType: 'all',
  },
];

export const products = [
  {
    id: 'vinyl-banner',
    name: 'ป้ายไวนิล',
    nameTh: 'ป้ายไวนิล',
    category: 'vinyl',
    basePrice: 35, // per sqm
    unit: 'ตร.ม.',
    minSize: { w: 0.5, h: 0.5 },
    description: 'ไวนิลหน้าขาว เนื้อดี 440gsm พิมพ์ 4 สี',
    materials: ['ไวนิลธรรมดา', 'ไวนิลเจาะรู', 'ไวนิลสะท้อนแสง'],
    leadDays: 2,
    popular: true,
  },
  {
    id: 'lightbox',
    name: 'ป้ายตู้ไฟ',
    nameTh: 'ป้ายตู้ไฟ',
    category: 'lightbox',
    basePrice: 2800, // per unit (custom quote)
    unit: 'ชิ้น',
    description: 'ตู้ไฟ LED อลูมิเนียม บางเฉียบ ไฟสม่ำเสมอ',
    materials: ['ตู้ไฟบาง LED', 'ตู้ไฟ Slim', 'ตู้ไฟสองหน้า'],
    leadDays: 7,
    popular: true,
  },
  {
    id: 'sticker',
    name: 'สติกเกอร์',
    nameTh: 'สติกเกอร์',
    category: 'sticker',
    basePrice: 45,
    unit: 'ตร.ม.',
    description: 'สติกเกอร์ PVC กันน้ำ ติดทนนาน 3-5 ปี',
    materials: ['สติกเกอร์ใส', 'สติกเกอร์ขาว', 'สติกเกอร์เงิน', 'ไดคัทตาม shape'],
    leadDays: 3,
    popular: false,
  },
  {
    id: 'fabric-banner',
    name: 'ป้ายผ้า',
    nameTh: 'ป้ายผ้า',
    category: 'fabric',
    basePrice: 55,
    unit: 'ตร.ม.',
    description: 'ผ้า Polyester พิมพ์ Dye Sub สีสด ไม่ลอก',
    materials: ['ผ้าธรรมดา', 'ผ้า Backlit', 'ผ้า Stretch'],
    leadDays: 3,
    popular: false,
  },
  {
    id: 'acrylic-sign',
    name: 'ป้ายอะคริลิก',
    nameTh: 'ป้ายอะคริลิก',
    category: 'acrylic',
    basePrice: 380,
    unit: 'ตร.ม.',
    description: 'อะคริลิกใส/ขาว ตัดเลเซอร์ความแม่นยำสูง',
    materials: ['อะคริลิกใส 3mm', 'อะคริลิกขาว 5mm', 'อะคริลิกสี'],
    leadDays: 5,
    popular: true,
  },
  {
    id: 'foam-board',
    name: 'โฟมบอร์ด / PVC',
    nameTh: 'โฟมบอร์ด / PVC',
    category: 'board',
    basePrice: 85,
    unit: 'ตร.ม.',
    description: 'โฟมบอร์ดพิมพ์ UV ตรง น้ำหนักเบา แข็งแรง',
    materials: ['โฟมบอร์ด 5mm', 'PVC 3mm', 'Sintra Board'],
    leadDays: 2,
    popular: false,
  },
];

export const mockOrders = []; // Cleared mock orders

export const statusConfig = {
  pending:   { label: 'รอยืนยันแบบ',         color: 'var(--status-pending)',   bg: 'var(--status-pending-bg)' },
  progress:  { label: 'กำลังผลิต',            color: 'var(--status-progress)',  bg: 'var(--status-progress-bg)' },
  done:      { label: 'ผลิตเสร็จแล้ว',       color: 'var(--status-done)',      bg: 'var(--status-done-bg)' },
  deliver:   { label: 'พร้อมส่ง / จัดส่ง', color: 'var(--status-deliver)',   bg: 'var(--status-deliver-bg)' },
  installed: { label: 'เสร็จสิ้น',    color: 'var(--status-installed)', bg: 'var(--status-installed-bg)' },
  cancelled: { label: 'ยกเลิก', color: 'var(--warn)', bg: 'var(--surface-2)' },
};
