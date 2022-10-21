const express = require('express');

const {
  createProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/product_controllers');

const { getAllWishlist } = require('../controllers/wishlist_controller');

const { getAllUsers } = require('../controllers/user_controller');

const { getAllReviews } = require('../controllers/review_controller');

const { getAllCarts } = require('../controllers/cart_controller');

const { deleteCart } = require('../controllers/cart_controller');

const { getAllCartItems } = require('../controllers/cartItem_controller');

const { getAllOrders } = require('../controllers/order_controller');

const { getAllOrderItems } = require('../controllers/orderItem_controller');

const { getAllGuest } = require('../controllers/guest_controller');

const {
  getAllCartOrderAccess,
} = require('../controllers/cartOrderAccess_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router({ mergeParams: true });

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');
const Carts = require('../models/Cart');
const CartItems = require('../models/CartItem');
const Reviews = require('../models/Reviews');
const Wishlist = require('../models/Wishlist');
const Orders = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const Guests = require('../models/Guests');
const CartOrderAccess = require('../models/CartOrderAccess');

// Route  = /api/v1/admin

// Admin Review Routes
router.get(
  '/allreviews',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(Reviews),
  getAllReviews
);

// Admin Wishlist Routes
router.get(
  '/allwishlist',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(Wishlist),
  getAllWishlist
);

// Admin Users Routes
router.get(
  '/allusers',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(Users),
  getAllUsers
);

// Admin Product Routes
router.post('/', protect(Users), authorize('admin'), createProducts);
router.put('/admin', protect(Users), authorize('admin'), updateProduct);
router.delete('/admin', protect(Users), authorize('admin'), deleteProduct);

// Admin Cart Routes
router.get(
  '/allcarts',
  protect(CartOrderAccess),
  authorize('admin'),
  advancedQuerySearch(Carts),
  getAllCarts
);

router.delete(
  '/deletecart/:cartId',
  protect(Users),
  authorize('admin'),
  deleteCart
);

// Admin CartItems Routes
router.get(
  '/allcartitems',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(CartItems),
  getAllCartItems
);

// Admin Orders Routes
router.get(
  '/allorders',
  protect(CartOrderAccess),

  authorize('admin'),
  advancedQuerySearch(Orders),
  getAllOrders
);

// Admin OrderItems Routes

router.get(
  '/allorderitems',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(OrderItems),
  getAllOrderItems
);

// Admin Guest Routes
router.get(
  '/allguests',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(Guests),
  getAllGuest
);

// Admin CartOrderAccess Routes
router.get(
  '/allcartorderaccess',
  protect(CartOrderAccess),
  authorize('admin'),
  advancedQuerySearch(CartOrderAccess),
  getAllCartOrderAccess
);

module.exports = router;
