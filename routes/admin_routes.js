const express = require('express');
const { getAllWishlist } = require('../controllers/wishlist_controller');

const {
  createProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/product_controllers');

const { getAllUsers } = require('../controllers/user_controller');

const { getAllReviews } = require('../controllers/review_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const { getAllCarts } = require('../controllers/cart_controller');

const router = express.Router({ mergeParams: true });

// Route  = /api/v1/admin

router.get('/allcarts', protect, authorize('admin'), getAllCarts);
router.get('/allreviews', protect, authorize('admin'), getAllReviews);
router.get('/allwishlist', protect, authorize('admin'), getAllWishlist);
router.get('/allusers', protect, authorize('admin'), getAllUsers);
router.post('/', protect, authorize('admin'), createProducts);
router.put('/admin', protect, authorize('admin'), updateProduct);
router.delete('/admin', protect, authorize('admin'), deleteProduct);

module.exports = router;
