const mongoose = require('mongoose');

const productOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    addOnPrice: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'ทั่วไป', trim: true },
    imageUrl: { type: String, default: null },
    pricingType: {
      type: String,
      enum: ['per_sqm', 'per_unit'],
      required: true,
    },
    basePrice: {
      type: Number,
      required: true, 
    },
    options: [productOptionSchema],
    status: {
      type: String,
      enum: ['Active', 'Sold out', 'Hidden'],
      default: 'Active'
    },
    promotion: {
      isActive: { type: Boolean, default: false },
      discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
      startDate: { type: Date },
      endDate: { type: Date }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
