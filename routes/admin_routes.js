const express = require('express');
const {
  getAllAdminUsers,
  getAdminUser,
  createAdminUser,
  login,
  logout,
  updateAdminUser,
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
  '/',
  protect(Admin),
  authorize('admin'),
  advancedQuerySearch(Admin),
  getAllAdminUsers
);

router.get('/:adminId', protect(Admin), authorize('admin'), getAdminUser);

router.get('/cart/:cartId', protect(Admin), authorize('admin'), getCartById);
router.get('/guest/:guestId', protect(Admin), authorize('admin'), getGuestById);
router.get('/user/:userId', protect(Admin), authorize('admin'), getUserById);
// router.get('/:adminId', protect(Admin), authorize('admin'), );
router.post('/login', login);
router.post('/', createAdminUser);

router.put(
  '/update/:adminId',
  protect(Admin),
  authorize('admin'),
  updateAdminUser
);

router.delete(
  '/delete/:adminId',
  protect(Admin),
  authorize('admin'),
  deleteAdminUser
);

module.exports = router;
