const express = require('express');
const {
  getUsersWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
} = require('../controllers/wishlist_controller');

const { protect } = require('../middleware/auth_middleware');

// Include other resource routers
const wishlist = require('./admin_routes');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', wishlist);

// Route = /api/v1/wishlist
router.get('/mywishlist', protect, getUsersWishlist);
router.post('/mywishlist', protect, addItemToWishlist);

router.delete('/mywishlist/:productId', protect, removeItemFromWishlist);

module.exports = router;
