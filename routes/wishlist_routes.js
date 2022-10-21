const express = require('express');
const {
  getAllWishlist,
  getUsersWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
} = require('../controllers/wishlist_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router();

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');
const Wishlist = require('../models/Wishlist');

// Route = /api/v1/wishlist
router.get(
  '/admin/allwishlist',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(Wishlist),
  getAllWishlist
);
router.get('/mywishlist', protect(Users), getUsersWishlist);
router.post('/mywishlist', protect(Users), addItemToWishlist);
router.delete('/mywishlist/:productId', protect(Users), removeItemFromWishlist);

module.exports = router;
