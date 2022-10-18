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

const Users = require('../models/User');

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', wishlist);

// Route = /api/v1/wishlist
router.get('/mywishlist', protect(Users), getUsersWishlist);
router.post('/mywishlist', protect(Users), addItemToWishlist);
router.delete('/mywishlist/:productId', protect(Users), removeItemFromWishlist);

module.exports = router;
