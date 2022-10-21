const express = require('express');
const {
  getAllOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/order_controller');

const { protect, authorize } = require('../middleware/auth_middleware');
const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Orders = require('../models/Order');
const CartOrderAccess = require('../models/CartOrderAccess');

const router = express.Router();

// Route = /api/v1/orders
router.get(
  '/admin/allorders',
  protect(CartOrderAccess),
  authorize('admin'),
  advancedQuerySearch(Orders),
  getAllOrders
);

router.get(
  '/getmyorders',
  protect(CartOrderAccess),
  advancedQuerySearch(Orders, true),
  getMyOrders
);

router.get('/getorder/:orderId', protect(CartOrderAccess), getOrder);
router.post('/', protect(CartOrderAccess), createOrder);
router.put('/update/:orderId', protect(CartOrderAccess), updateOrder);
router.delete('/delete/:orderId', protect(CartOrderAccess), deleteOrder);

module.exports = router;
