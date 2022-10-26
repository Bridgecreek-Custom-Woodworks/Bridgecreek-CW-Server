const express = require('express');
const {
  getAllShippingAddresses,
  getMyShippingAddresses,
  getShippingAddress,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} = require('../controllers/shippingAddress_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router();
const advanceQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');
const ShippingAddress = require('../models/ShippingAddress');

// Route = 'api/v1/shippingaddress'

router.get(
  '/admin/allshippingaddresses',
  protect(Users),
  authorize('admin'),
  advanceQuerySearch(ShippingAddress),
  getAllShippingAddresses
);
router.get('/myshippingaddresses', protect(Users), getMyShippingAddresses);
router.get('/:shippingAddressId', protect(Users), getShippingAddress);
router.post('/', protect(Users), createShippingAddress);
router.put('/update/:shippingAddressId', protect(Users), updateShippingAddress);
router.delete(
  '/delete/:shippingAddressId',
  protect(Users),
  deleteShippingAddress
);

module.exports = router;
