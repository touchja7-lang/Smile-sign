const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    specs: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      finishingOptions: [{ type: String }],
    },
    artwork: {
      fileUrl: { type: String },
      designStatus: {
        type: String,
        enum: ['Ready to Print', 'Need Draft', 'Drafting', 'Approved'],
        required: true,
      },
      note: { type: String },
    },
    logistics: {
      deliveryMethod: {
        type: String,
        enum: ['Pickup', 'Delivery', 'Install'],
        required: true,
      },
      shippingAddress: { type: String },
    },
    financials: {
      shopCost: { type: Number, required: true }, 
      sellerCost: { type: Number, required: true },
      clientSellingPrice: { type: Number, required: true },
      sellerProfit: { type: Number, required: true },
      couponCode: { type: String, default: null },
      couponDiscount: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirm Artwork', 'Producing', 'Ready to Ship', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
