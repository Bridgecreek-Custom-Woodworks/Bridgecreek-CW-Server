const express = require('express');
const {
  getSingleCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} = require('../controllers/cartItem_controller');

const { protect } = require('../middleware/auth_middleware');
const CartOrderAccess = require('../models/CartOrderAccess');

const router = express.Router();

// Route = /api/v1/cartitems
router.get('/:cartItemId', protect(CartOrderAccess), getSingleCartItem);
router.post('/:productId', protect(CartOrderAccess), createCartItem);
router.put('/update/:cartItemId', protect(CartOrderAccess), updateCartItem);
router.delete('/delete/:cartItemId', protect(CartOrderAccess), deleteCartItem);

module.exports = router;
