const express = require('express');
const {
  getAllProductCare,
  getProductCare,
  createProductCare,
  updateProductCare,
  deleteProductCare,
} = require('../controllers/productCare_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');
const ProductCare = require('../models/ProductCare');

const router = express.Router();

// Route = '/api/v1/productcare'

router.get(
  '/allproductcare/admin',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(ProductCare),
  getAllProductCare
);

router.get('/:productCareId', getProductCare);
router.post('/admin', createProductCare);
router.put(
  '/update/:productCareId/admin',
  protect(Users),
  authorize('admin'),
  updateProductCare
);
router.delete(
  '/delete/:productCareId/admin',
  protect(Users),
  authorize('admin'),
  deleteProductCare
);
module.exports = router;
