const express = require('express');
const {
  getMyOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/order_controller');
const { protect } = require('../middleware/auth_middleware');
const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Orders = require('../models/Order');

const orderRouter = require('./admin_routes');
const CartOrderAccess = require('../models/CartOrderAccess');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', orderRouter);

// Route = /api/v1/orders
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
