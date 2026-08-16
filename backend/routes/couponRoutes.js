const express = require('express');
const router = express.Router();
const {
  getCoupons, getCouponsAdmin, validateCoupon,
  createCoupon, updateCoupon, deleteCoupon, claimCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Seller routes
router.get('/', protect, getCoupons);
router.post('/validate', protect, validateCoupon);
router.post('/:id/claim', protect, claimCoupon);

// Admin routes
router.get('/admin', protect, admin, getCouponsAdmin);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
