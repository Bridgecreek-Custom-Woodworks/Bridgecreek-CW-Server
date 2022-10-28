const express = require('express');
const {
  getAllAdminUsers,
  getAdminUser,
  createAdminUser,
  login,
  updateAdminUser,
  deleteAdminUser,
} = require('../controllers/admin_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router({ mergeParams: true });

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Admin = require('../models/Admin');
const User = require('../models/User');

// Route  = /api/v1/admin

router.get(
  '/',
  protect(Admin),
  authorize('admin'),
  advancedQuerySearch(Admin),
  getAllAdminUsers
);

router.get('/:userId', protect(Admin), authorize('admin'), getAdminUser);
router.post('/login', login);
router.post('/', protect(Admin), authorize('admin'), createAdminUser);

router.put(
  '/update/:userId',
  protect(Admin),
  authorize('admin'),
  updateAdminUser
);

router.delete(
  '/delete/:userId',
  protect(User),
  authorize('admin'),
  deleteAdminUser
);

module.exports = router;
