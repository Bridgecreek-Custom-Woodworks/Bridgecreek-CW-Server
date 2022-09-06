const express = require('express');
const { getAllWishlist } = require('../controllers/wishlist_controller');
const {
  createProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/product_controllers');
const { getAllUsers } = require('../controllers/user_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router({ mergeParams: true });

// Route  = /api/v1/admin
router.get('/allwishlist', protect, authorize('admin'), getAllWishlist);
router.get('/allusers', protect, authorize('admin'), getAllUsers);
router.post('/', protect, authorize('admin'), createProducts);
router.put('/admin', protect, authorize('admin'), updateProduct);
router.delete('/admin', protect, authorize('admin'), deleteProduct);

module.exports = router;
