const express = require('express');
const {
  getAllCartItems,
  getSingleCartItem,
  createCartItem,
} = require('../controllers/cartItem_controller');

const { protect } = require('../middleware/auth_middleware');

const router = express.Router();

// Route = /api/v1/cartItems

router.get('/', getAllCartItems);
router.get('/:cartItemId', getSingleCartItem);
router.post('/:productId', protect, createCartItem);
module.exports = router;
