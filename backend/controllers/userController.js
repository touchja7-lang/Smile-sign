const User = require('../models/User');

// @desc    Get all users (sellers)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (Admin updating seller tier/discount/role)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserById = async (req, res, next) => {
  try {
    const { role, sellerLevel, discountRate } = req.body;
    
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (sellerLevel) user.sellerData.sellerLevel = sellerLevel;
    if (discountRate !== undefined) user.sellerData.discountRate = discountRate;

    const updatedUser = await user.save();
    
    res.json({ 
      success: true, 
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        sellerData: updatedUser.sellerData
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserById,
};
