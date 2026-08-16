const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      productId,
      width,
      height,
      quantity,
      finishingOptions,
      fileUrl,
      designStatus,
      note,
      deliveryMethod,
      shippingAddress,
      clientSellingPrice, // ราคาที่เซลล์ขายลูกค้าปลายทาง (ส่งมาจาก Frontend ได้เพราะเซลล์เป็นคนกำหนดเอง)
      couponCode, // รหัสคูปองที่เซลล์ใช้ลดต้นทุนเพิ่มเติม
    } = req.body;

    // 1. ดึงข้อมูล Product จาก Database แทนที่จะเชื่อข้อมูลที่ Frontend ส่งมา
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // 2. คำนวณราคาฐาน (Base Price) จาก Database เท่านั้น
    // สมมติว่าคำนวณตามตารางเมตร (width * height * quantity * basePrice)
    let shopCost = 0;
    if (product.pricingType === 'per_sqm') {
      const area = width * height;
      shopCost = area * product.basePrice * quantity;
    } else {
      shopCost = product.basePrice * quantity;
    }

    // บวกราคา Finishing Options ต่างๆ (จำลองว่าค้นหา option จาก product.options)
    if (finishingOptions && finishingOptions.length > 0) {
      finishingOptions.forEach(optName => {
        const option = product.options.find(o => o.name === optName);
        if (option) {
          shopCost += (option.addOnPrice * quantity);
        }
      });
    }

    // --- APPLY PRODUCT PROMOTION (if active) ---
    const now = new Date();
    if (
      product.promotion && 
      product.promotion.isActive && 
      (!product.promotion.startDate || now >= product.promotion.startDate) &&
      (!product.promotion.endDate || now <= product.promotion.endDate)
    ) {
      const promoDiscount = Math.floor(shopCost * (product.promotion.discountPercentage / 100));
      shopCost = shopCost - promoDiscount;
    }


    // 3. คำนวณราคาทุนสำหรับเซลล์ (sellerCost) โดยดูจาก Level/Discount ของเซลล์ (จาก req.user)
    const discountRate = req.user.discountRate || 0;
    const tierDiscountAmount = Math.floor(shopCost * (discountRate / 100));
    
    // 4. คำนวณส่วนลดเพิ่มเติมจากคูปอง (ถ้ามี)
    let finalCouponDiscount = 0;
    let appliedCoupon = null;
    
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      if (coupon && coupon.isActive && now >= coupon.validFrom && now <= coupon.validUntil) {
        // เช็คข้อจำกัดต่างๆ 
        const isNotExceedLimit = coupon.usageLimit === null || coupon.usedBy.length < coupon.usageLimit;
        const isMinOrderMet = coupon.minOrderValue === 0 || (shopCost - tierDiscountAmount) >= coupon.minOrderValue;
        const isProductAllowed = coupon.applicableProducts.length === 0 || coupon.applicableProducts.includes(productId);
        
        if (isNotExceedLimit && isMinOrderMet && isProductAllowed) {
          if (coupon.discountType === 'percent') {
            finalCouponDiscount = Math.floor((shopCost - tierDiscountAmount) * (coupon.discountValue / 100));
          } else {
            finalCouponDiscount = Math.min(coupon.discountValue, (shopCost - tierDiscountAmount));
          }
          appliedCoupon = coupon;
        }
      }
    }

    const sellerCost = shopCost - tierDiscountAmount - finalCouponDiscount;

    // 5. คำนวณกำไรของเซลล์ (sellerProfit)
    const sellerProfit = clientSellingPrice - sellerCost;

    // 6. บันทึก Order ลง Database
    const order = await Order.create({
      seller: req.user._id,
      product: productId,
      specs: { width, height, quantity, finishingOptions },
      artwork: { fileUrl, designStatus, note },
      logistics: { deliveryMethod, shippingAddress },
      financials: {
        shopCost,
        sellerCost,
        clientSellingPrice,
        sellerProfit,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        couponDiscount: finalCouponDiscount,
      },
      status: 'Pending',
    });

    // 7. บันทึกการใช้คูปอง
    if (appliedCoupon) {
      appliedCoupon.usedBy.push({ user: req.user._id });
      await appliedCoupon.save();
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('product', 'name nameTh category basePrice')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin
// @access  Private/Admin
const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('seller', 'name email sellerData.shopDetails.shopName')
      .populate('product', 'name nameTh category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/admin/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    // Validate status against enum
    const validStatuses = ['Pending', 'Confirm Artwork', 'Producing', 'Ready to Ship', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('seller', 'name email').populate('product', 'name');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatus
};
