const express = require('express');
const {
  getAllUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
} = require('../controllers/user_controller');

const { protect, authorize } = require('../middleware/auth_middleware');
const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');
const Admin = require('../models/Admin');

const router = express.Router();

// Route = /api/v1/users
router.get(
  '/admin/allusers',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(Users),
  getAllUsers
);
router.get('/getme', protect(Users), advancedQuerySearch(Users, true), getUser);
router.post('/', registerUser);
router.put('/updateme', protect(Users), updateUser);
router.delete('/deleteme', protect(Users), deleteUser);

module.exports = router;
