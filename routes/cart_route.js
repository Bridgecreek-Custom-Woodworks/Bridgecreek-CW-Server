const express = require('express');
const {
  getAllCarts,
  createCart,
  getMyCart,
  updateMyCart,
  deleteCart,
} = require('../controllers/cart_controller');
const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router();
const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const CartOrderAccess = require('../models/CartOrderAccess');
const Carts = require('../models/Cart');
const Users = require('../models/User');
const Admin = require('../models/Admin');

// Route = /api/v1/carts

router.get(
  '/admin/allcarts',
  protect(Admin),
  authorize('admin'),
  advancedQuerySearch(Carts),
  getAllCarts
);
router.get('/mycart', protect(CartOrderAccess), getMyCart);
router.post('/', protect(CartOrderAccess), createCart);
router.put('/mycart/update/:cartId', protect(CartOrderAccess), updateMyCart);
router.delete(
  '/admin/delete/:cartId',
  protect(Admin),
  authorize('admin'),
  deleteCart
);

module.exports = router;
