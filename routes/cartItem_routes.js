const express = require('express');
const {
  getAllCartItems,
  getSingleCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} = require('../controllers/cartItem_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router();

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const CartItems = require('../models/CartItem');
const CartOrderAccess = require('../models/CartOrderAccess');
const Users = require('../models/User');

// Route = /api/v1/cartitems
router.get(
  '/admin/allcartitems',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(CartItems),
  getAllCartItems
);
router.get('/:cartItemId', protect(CartOrderAccess), getSingleCartItem);
router.post('/:productId', protect(CartOrderAccess), createCartItem);
router.put('/update/:cartItemId', protect(CartOrderAccess), updateCartItem);
router.delete('/delete/:cartItemId', protect(CartOrderAccess), deleteCartItem);

module.exports = router;
