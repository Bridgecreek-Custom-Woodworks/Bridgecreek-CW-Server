const express = require('express');
const {
  createCart,
  getMyCart,
  updateMyCart,
} = require('../controllers/cart_controller');
const { protect } = require('../middleware/auth_middleware');

// Include other resource routers

const router = express.Router();

// Route = /api/v1/carts

router.get('/mycart', protect, getMyCart);
router.post('/', protect, createCart); // <== This route may not be necessary
router.put('/mycart/update/:cartId', protect, updateMyCart);

module.exports = router;
