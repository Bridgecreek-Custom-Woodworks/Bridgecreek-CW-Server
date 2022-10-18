const express = require('express');
const {
  createCart,
  getMyCart,
  updateMyCart,
} = require('../controllers/cart_controller');
const { protect } = require('../middleware/auth_middleware');

const router = express.Router();

const CartOrderAccess = require('../models/CartOrderAccess');

// Route = /api/v1/carts

router.get('/mycart', protect(CartOrderAccess), getMyCart);
router.post('/', protect(CartOrderAccess), createCart);
router.put('/mycart/update/:cartId', protect(CartOrderAccess), updateMyCart);

module.exports = router;
