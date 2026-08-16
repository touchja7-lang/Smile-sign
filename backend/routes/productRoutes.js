const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProducts, createProduct, updateProduct, uploadProductImage } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Multer: store in memory, accept images only, max 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

// @route   GET /api/products (Sellers use this to list products)
router.get('/', protect, getProducts);

// @route   POST /api/products (Admin creates a product)
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id (Admin updates a product's price or options)
router.put('/:id', protect, admin, updateProduct);

// @route   POST /api/products/:id/image (Admin uploads product image)
router.post('/:id/image', protect, admin, upload.single('image'), uploadProductImage);

module.exports = router;
