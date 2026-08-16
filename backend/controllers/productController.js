const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public (or Private depending on business logic, usually public/protected for sellers)
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, category, imageUrl, pricingType, basePrice, options, status, promotion } = req.body;

    const product = await Product.create({
      name,
      category: category || 'ทั่วไป',
      imageUrl: imageUrl || null,
      pricingType,
      basePrice,
      options: options || [],
      status: status || 'Active',
      promotion: promotion || { isActive: false, discountPercentage: 0 }
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (e.g. change basePrice or add options)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, category, imageUrl, pricingType, basePrice, options, status, promotion } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (pricingType) product.pricingType = pricingType;
    if (basePrice !== undefined) product.basePrice = basePrice;
    if (options !== undefined) product.options = options;
    if (status) product.status = status;
    if (promotion !== undefined) product.promotion = promotion;

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product image
// @route   POST /api/products/:id/image
// @access  Private/Admin
const uploadProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Convert buffer to base64 data URL
    const base64 = req.file.buffer.toString('base64');
    const mime = req.file.mimetype;
    product.imageUrl = `data:${mime};base64,${base64}`;

    const updated = await product.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  uploadProductImage,
};
