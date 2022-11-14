const express = require('express');
const {
  createPayment,
  updateOrderHook,
} = require('../controllers/stripePayments_controllers');

const { protect } = require('../middleware/auth_middleware');

const CartOrderAccess = require('../models/CartOrderAccess');

router = express.Router();

// Remember to uncomment this after the frontend checkout component is working
// router.post('/checkout/:orderId', protect(CartOrderAccess), createPayment);
router.post('/checkout', createPayment);

// router.post('/', express.raw({ type: 'application/json' }), updateOrderHook);
router.post('/', updateOrderHook);

module.exports = router;
