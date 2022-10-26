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

const Users = require('../models/User');
const Products = require('../models/Product');

const router = express.Router();

// Route = /api/v1/products
router.get('/allproducts', advancedQuerySearch(Products), getAllProducts);
router.get('/:productId', getProduct);
router.post('/admin', protect(Users), authorize('admin'), createProducts);
router.put(
  '/update/:productId/admin',
  protect(Users),
  authorize('admin'),
  updateProduct
);
router.delete(
  '/delete/:productId/admin',
  protect(Users),
  authorize('admin'),
  deleteProduct
);

module.exports = router;
