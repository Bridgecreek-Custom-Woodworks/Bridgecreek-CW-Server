const express = require('express');
const {
  getSingleCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} = require('../controllers/cartItem_controller');

const { protect } = require('../middleware/auth_middleware');

const router = express.Router();

// Route = /api/v1/cartItems
router.get('/:cartItemId', protect, getSingleCartItem);
router.post('/:productId', protect, createCartItem);
router.put('/update/:cartItemId', updateCartItem);
router.delete('/delete/:cartItemId', deleteCartItem);

module.exports = router;
