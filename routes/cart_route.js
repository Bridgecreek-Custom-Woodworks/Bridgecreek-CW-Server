const express = require('express');
const {
  createCart,
  getMyCart,
  updateMyCart,
} = require('../controllers/cart_controller');
const { protect } = require('../middleware/auth_middleware');

// Include other resource routers
const cartAdminRouter = require('./admin_routes');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', cartAdminRouter);
router.use('/', cartAdminRouter);

// Route = /api/v1/carts

router.get('/mycart', protect, getMyCart);
router.post('/', protect, createCart); // <== This route may not be necessary
router.put('/mycart/update/:cartId', protect, updateMyCart);

module.exports = router;
