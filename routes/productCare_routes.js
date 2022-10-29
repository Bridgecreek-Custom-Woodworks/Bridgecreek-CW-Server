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

const Admin = require('../models/Admin');
const ProductCare = require('../models/ProductCare');

const router = express.Router();

// Route = '/api/v1/productcare'

router.get(
  '/allproductcare/admin',
  protect(Admin),
  authorize('admin'),
  advancedQuerySearch(ProductCare),
  getAllProductCare
);

router.get('/:productCareId', getProductCare);
router.post('/admin', protect(Admin), authorize('admin'), createProductCare);

router.put(
  '/update/:productCareId/admin',
  protect(Admin),
  authorize('admin'),
  updateProductCare
);

router.delete(
  '/delete/:productCareId/admin',
  protect(Admin),
  authorize('admin'),
  deleteProductCare
);
module.exports = router;
