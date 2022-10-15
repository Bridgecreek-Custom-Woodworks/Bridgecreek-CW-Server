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

const { getAllOrders } = require('../controllers/order_controller');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth_middleware');

const { getAllOrderItems } = require('../controllers/orderItem_controller');

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');
const Carts = require('../models/Cart');
const CartItems = require('../models/CartItem');
const Reviews = require('../models/Reviews');
const Wishlist = require('../models/Wishlist');
const Orders = require('../models/Order');
const OrderItems = require('../models/OrderItems');

// Route  = /api/v1/admin

// Admin Review Routes
router.get(
  '/allreviews',
  protect,
  authorize('admin'),
  advancedQuerySearch(Reviews),
  getAllReviews
);

// Admin Wishlist Routes
router.get(
  '/allwishlist',
  protect,
  authorize('admin'),
  advancedQuerySearch(Wishlist),
  getAllWishlist
);

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
router.get(
  '/allcarts',
  protect,
  authorize('admin'),
  advancedQuerySearch(Carts),
  getAllCarts
);
router.delete('/deletecart/:cartId', protect, authorize('admin'), deleteCart);

// Admin CartItems Routes
router.get(
  '/allcartitems',
  protect,
  authorize('admin'),
  advancedQuerySearch(CartItems),
  getAllCartItems
);

// Admin Orders Routes
router.get(
  '/allorders',
  protect,
  authorize('admin'),
  advancedQuerySearch(Orders),
  getAllOrders
);

// Admin OrderItems Routes

router.get(
  '/allorderitems',
  protect,
  authorize('admin'),
  advancedQuerySearch(OrderItems),
  getAllOrderItems
);

module.exports = router;
