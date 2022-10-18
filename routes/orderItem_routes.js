const express = require('express');
const {
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require('../controllers/orderItem_controller');

const { protect } = require('../middleware/auth_middleware');
const CartOrderAccess = require('../models/CartOrderAccess');

const router = express.Router();

// Route = '/api/v1/orderitems'

router.get(
  '/getorderitem/:orderItemId',
  protect(CartOrderAccess),
  getOrderItem
);
router.post('/', protect(CartOrderAccess), createOrderItem);
router.put('/update/:orderItemId', protect(CartOrderAccess), updateOrderItem);
router.delete(
  '/delete/:orderItemId',
  protect(CartOrderAccess),
  deleteOrderItem
);

module.exports = router;
