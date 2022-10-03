const express = require('express');
const { getAllWishlist } = require('../controllers/wishlist_controller');

const {
  createProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/product_controllers');

const { getAllUsers } = require('../controllers/user_controller');

const { getAllReviews } = require('../controllers/review_controller');

const { getAllCarts } = require('../controllers/cart_controller');

const { deleteCart } = require('../controllers/cart_controller');

const { getAllCartItems } = require('../controllers/cartItem_controller');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth_middleware');

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');

// Route  = /api/v1/admin

// Admin Review Routes
router.get('/allreviews', protect, authorize('admin'), getAllReviews);

// Admin Wishlist Routes
router.get('/allwishlist', protect, authorize('admin'), getAllWishlist);

// Admin Users Routes
router.get(
  '/allusers',
  protect,
  authorize('admin'),
  advancedQuerySearch(Users),
  getAllUsers
);

// Admin Product Routes
router.post('/', protect, authorize('admin'), createProducts);
router.put('/admin', protect, authorize('admin'), updateProduct);
router.delete('/admin', protect, authorize('admin'), deleteProduct);

// Admin Cart Routes
router.get('/allcarts', protect, authorize('admin'), getAllCarts);
router.delete('/deletecart/:cartId', protect, authorize('admin'), deleteCart);

// Admin CartItems Routes
router.get('/allcartitems', protect, getAllCartItems);
module.exports = router;
