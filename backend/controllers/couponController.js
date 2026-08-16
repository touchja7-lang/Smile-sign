const Coupon = require('../models/Coupon');

// ─── SELLER: Get all active coupons available to use ─────────────────────────
// GET /api/coupons
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true, validUntil: { $gte: new Date() } })
      .populate('applicableProducts', 'name category')
      .sort({ createdAt: -1 });
    
    // Add flags for the current user
    const result = coupons.map(c => {
      const isClaimed = c.claimedBy && c.claimedBy.some(u => u.user.toString() === req.user._id.toString());
      const isUsed = c.usedBy.some(u => u.user.toString() === req.user._id.toString());
      return {
        ...c.toObject({ virtuals: true }),
        claimedByMe: isClaimed,
        usedByMe: isUsed,
      };
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── SELLER: Claim a coupon ──────────────────────────────────────────────────
// POST /api/coupons/claim/:id
const claimCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'ไม่พบคูปอง' });

    const alreadyClaimed = coupon.claimedBy && coupon.claimedBy.some(u => u.user.toString() === req.user._id.toString());
    if (alreadyClaimed) return res.status(400).json({ success: false, message: 'คุณเก็บคูปองนี้ไปแล้ว' });

    coupon.claimedBy = [...(coupon.claimedBy || []), { user: req.user._id, claimedAt: new Date() }];
    await coupon.save();

    res.json({ success: true, message: 'เก็บคูปองเรียบร้อยแล้ว' });
  } catch (err) {
    next(err);
  }
};

// ─── SELLER: Validate a coupon code (before applying to order) ───────────────
// POST /api/coupons/validate
const validateCoupon = async (req, res, next) => {
  try {
    const { code, productId, orderValue } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'กรุณากรอกรหัสคูปอง' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() })
      .populate('applicableProducts', '_id');

    if (!coupon) return res.status(404).json({ success: false, message: 'ไม่พบรหัสคูปองนี้' });

    const now = new Date();
    if (!coupon.isActive) return res.status(400).json({ success: false, message: 'คูปองนี้ถูกปิดใช้งานแล้ว' });
    if (now < coupon.validFrom) return res.status(400).json({ success: false, message: 'คูปองนี้ยังไม่เริ่มใช้งานได้' });
    if (now > coupon.validUntil) return res.status(400).json({ success: false, message: 'คูปองนี้หมดอายุแล้ว' });

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedBy.length >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'คูปองนี้ถูกใช้ครบจำนวนแล้ว' });
    }

    if (coupon.usedBy.some(u => u.user.toString() === req.user._id.toString())) {
      return res.status(400).json({ success: false, message: 'คุณใช้คูปองนี้ไปแล้ว' });
    }

    if (!coupon.claimedBy || !coupon.claimedBy.some(u => u.user.toString() === req.user._id.toString())) {
      return res.status(400).json({ success: false, message: 'คุณต้องกดเก็บคูปองนี้ก่อนจึงจะสามารถใช้งานได้' });
    }

    // Check product restriction
    if (coupon.applicableProducts.length > 0 && productId) {
      const allowed = coupon.applicableProducts.some(p => p._id.toString() === productId);
      if (!allowed) return res.status(400).json({ success: false, message: 'คูปองนี้ใช้ไม่ได้กับสินค้าที่เลือก' });
    }

    // Check minimum order value
    if (orderValue !== undefined && coupon.minOrderValue > 0 && orderValue < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `ยอดสั่งซื้อขั้นต่ำ ฿${coupon.minOrderValue.toLocaleString()} ถึงจะใช้คูปองได้`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (orderValue !== undefined) {
      if (coupon.discountType === 'percent') {
        discountAmount = Math.floor(orderValue * (coupon.discountValue / 100));
      } else {
        discountAmount = Math.min(coupon.discountValue, orderValue); // can't exceed order value
      }
    }

    res.json({
      success: true,
      data: {
        _id: coupon._id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        applicableProducts: coupon.applicableProducts,
        validUntil: coupon.validUntil,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Get ALL coupons (including inactive) ──────────────────────────────
// GET /api/coupons/admin
const getCouponsAdmin = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({})
      .populate('applicableProducts', 'name category')
      .sort({ createdAt: -1 });

    const result = coupons.map(c => ({
      ...c.toObject({ virtuals: true }),
      totalUsed: c.usedBy.length,
      totalClaimed: c.claimedBy ? c.claimedBy.length : 0,
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Create a coupon ───────────────────────────────────────────────────
// POST /api/coupons
const createCoupon = async (req, res, next) => {
  try {
    const {
      code, name, description, discountType, discountValue,
      applicableProducts, minOrderValue, validFrom, validUntil,
      isActive, usageLimit,
    } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      name, description, discountType, discountValue,
      applicableProducts: applicableProducts || [],
      minOrderValue: minOrderValue || 0,
      validFrom: validFrom || new Date(),
      validUntil: (() => { const d = new Date(validUntil); d.setHours(23, 59, 59, 999); return d; })(),
      isActive: isActive !== undefined ? isActive : true,
      usageLimit: usageLimit || null,
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'รหัสคูปองนี้ถูกใช้ไปแล้ว' });
    }
    next(err);
  }
};

// ─── ADMIN: Update a coupon ───────────────────────────────────────────────────
// PUT /api/coupons/:id
const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'ไม่พบคูปอง' });

    const fields = ['name','description','discountType','discountValue','applicableProducts',
                    'minOrderValue','validFrom','validUntil','isActive','usageLimit'];
    fields.forEach(f => { if (req.body[f] !== undefined) coupon[f] = req.body[f]; });

    const updated = await coupon.save();
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Delete a coupon ───────────────────────────────────────────────────
// DELETE /api/coupons/:id
const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'ลบคูปองเรียบร้อย' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCoupons,
  getCouponsAdmin,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  claimCoupon,
};
