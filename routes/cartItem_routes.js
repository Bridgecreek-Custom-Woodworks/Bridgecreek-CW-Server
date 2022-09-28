const express = require('express');
const {
  getAllCartItems,
  getSingleCartItem,
  createCartItem,
} = require('../controllers/cartItem_controller');

const router = express.Router();

// Route = /api/v1/cartItems

router.get('/', getAllCartItems);
router.get('/:cartItemId', getSingleCartItem);
router.post('/:productId', createCartItem);
module.exports = router;
