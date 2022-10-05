const express = require('express');
const {
  getSingleCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} = require('../controllers/cartItem_controller');

const { protect } = require('../middleware/auth_middleware');
const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const router = express.Router();

// Route = /api/v1/cartitems
router.get('/:cartItemId', protect, getSingleCartItem);
router.post('/:productId', protect, createCartItem);
router.put('/update/:cartItemId', protect, updateCartItem);
router.delete('/delete/:cartItemId', protect, deleteCartItem);

module.exports = router;
