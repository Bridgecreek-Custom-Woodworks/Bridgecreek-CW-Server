const express = require('express');
const {
  getAllProducts,
  getProduct,
  createProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/product_controllers');

const { protect, authorize } = require('../middleware/auth_middleware');

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Products = require('../models/Product');
const Admin = require('../models/Admin');

const router = express.Router();

// Route = /api/v1/products
router.get('/allproducts', advancedQuerySearch(Products), getAllProducts);
router.get('/:productId', getProduct);
router.post('/admin', protect(Admin), authorize('admin'), createProducts);
router.put(
  '/update/:productId/admin',
  protect(Admin),
  authorize('admin'),
  updateProduct
);
router.delete(
  '/delete/:productId/admin',
  protect(Admin),
  authorize('admin'),
  deleteProduct
);

module.exports = router;
