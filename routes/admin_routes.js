const express = require('express');
const {
  getAllAdminUsers,
  getMe,
  createAdminUser,
  login,
  logout,
  updateAdminUser,
  updateAdminPassword,
  deleteAdminUser,
  getCartById,
  getGuestById,
  getUserById,
} = require('../controllers/admin_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router({ mergeParams: true });

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Admin = require('../models/Admin');

// Route  = /api/v1/admin

router.get(
  '/alladmins',
  protect(Admin),
  authorize('admin'),
  advancedQuerySearch(Admin),
  getAllAdminUsers
);

router.get('/getme', protect(Admin), authorize('admin'), getMe);

router.get('/cart/:cartId', protect(Admin), authorize('admin'), getCartById);
router.get('/guest/:guestId', protect(Admin), authorize('admin'), getGuestById);
router.get('/user/:userId', protect(Admin), authorize('admin'), getUserById);
router.post('/logout', protect(Admin), authorize('admin'), logout);
router.post('/login', login);
router.post('/', protect(Admin), authorize('admin'), createAdminUser);

router.put(
  '/update/:adminId',
  protect(Admin),
  authorize('admin'),
  updateAdminUser
);

router.put(
  '/updatepassword',
  protect(Admin),
  authorize('admin'),
  updateAdminPassword
);

router.delete(
  '/delete/:adminId',
  protect(Admin),
  authorize('admin'),
  deleteAdminUser
);

module.exports = router;
