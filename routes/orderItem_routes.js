const express = require('express');
const {
  getAllOrderItems,
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require('../controllers/orderItem_controller');

const { protect, authorize } = require('../middleware/auth_middleware');
const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const router = express.Router();

const CartOrderAccess = require('../models/CartOrderAccess');
const Users = require('../models/User');
const OrderItems = require('../models/OrderItems');

// Route = '/api/v1/orderitems'
router.get(
  '/admin/allorderitems',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(OrderItems),
  getAllOrderItems
);

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
