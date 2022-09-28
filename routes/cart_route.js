const express = require('express');
const { createCart, getMyCart } = require('../controllers/cart_controller');
const { protect } = require('../middleware/auth_middleware');

// Include other resource routers
const cartAdminRouter = require('./admin_routes');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', cartAdminRouter);

// Route = /api/v1/carts

router.get('/mycart/:cartId', protect, getMyCart);
router.post('/', createCart);

module.exports = router;
