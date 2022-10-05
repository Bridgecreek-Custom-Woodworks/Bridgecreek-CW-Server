const express = require('express');
const {
  getAllProducts,
  getProduct,
} = require('../controllers/product_controllers');

const advancedQuerySearch = require('../middleware/advancedQuerySearch');
const Products = require('../models/Product');

// Include other resource routers
const productAdminRouter = require('./admin_routes');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', productAdminRouter);
router.use('/:productId', productAdminRouter);

// Route = /api/v1/products
router.get('/', advancedQuerySearch(Products), getAllProducts);
router.get('/:productId', getProduct);

module.exports = router;
