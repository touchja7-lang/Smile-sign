const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrdersAdmin, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Protected routes (Requires Token)
router.route('/')
  .post(protect, createOrder)
  .get(protect, getMyOrders);

// Admin routes
router.route('/admin')
  .get(protect, admin, getAllOrdersAdmin);

router.route('/admin/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
