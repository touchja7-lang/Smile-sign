const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['Admin', 'Seller'],
      default: 'Seller',
    },
    sellerData: {
      sellerLevel: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze',
      },
      discountRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      shopDetails: {
        shopName: { type: String, trim: true },
        logoUrl: { type: String },
        address: { type: String },
      },
      totalSalesVolume: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
