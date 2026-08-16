const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserById } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// @route   GET /api/users (Admin lists users)
router.get('/', protect, admin, getAllUsers);

// @route   PUT /api/users/:id (Admin updates user tier/role)
router.put('/:id', protect, admin, updateUserById);

module.exports = router;
