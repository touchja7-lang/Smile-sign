const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String, required: true, unique: true,
      uppercase: true, trim: true, index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    discountType: {
      type: String, enum: ['percent', 'fixed'], required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    // Product restriction: empty array = applies to ALL products
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    minOrderValue: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    // Total usage cap (admin sets this)
    usageLimit: { type: Number, default: null }, // null = unlimited
    // Per-user tracking
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      }
    ],
    claimedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        claimedAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

// Virtual: how many times used in total
couponSchema.virtual('totalUsed').get(function () {
  return this.usedBy.length;
});

module.exports = mongoose.model('Coupon', couponSchema);
