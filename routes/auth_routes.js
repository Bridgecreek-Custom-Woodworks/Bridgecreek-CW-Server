const express = require('express');
const {
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  activateAccount,
} = require('../controllers/auth_controller');
const { protect } = require('../middleware/auth_middleware');

const router = express.Router();

const Users = require('../models/User');

// Route  = /api/v1/auth
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/logout', protect(Users), logout);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect(Users), updatePassword);
router.put('/accountactivation/:resettoken', protect(Users), activateAccount);

module.exports = router;
