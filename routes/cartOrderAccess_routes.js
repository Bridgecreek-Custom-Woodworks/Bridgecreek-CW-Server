const express = require('express');
const {
  getAllCartOrderAccess,
  getMyCartOrderAccess,
  createCartOrderAccess,
  updateCartOrderAccess,
  deleteCartOrderAccess,
} = require('../controllers/cartOrderAccess_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const router = express.Router();

const CartOrderAccess = require('../models/CartOrderAccess');
const Admin = require('../models/Admin');

// Route = '/api/v1/cartorderaccess'
router.get(
  '/admin/allcartorderaccess',
  protect(Admin),
  authorize('admin'),
  advancedQuerySearch(CartOrderAccess),
  getAllCartOrderAccess
);

router.get('/getme', protect(CartOrderAccess), getMyCartOrderAccess);

router.post('/', protect(Admin), authorize('admin'), createCartOrderAccess);

router.put(
  '/update/:cartOrderAccessId',
  protect(CartOrderAccess),
  updateCartOrderAccess
);

router.delete(
  '/delete/:cartOrderAccessId',
  protect(CartOrderAccess),
  deleteCartOrderAccess
);

module.exports = router;
