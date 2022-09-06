const express = require('express');
const {
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/auth_controller');
const { protect } = require('../middleware/auth_middleware');

const router = express.Router();

// Route  = /api/v1/auth
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/logout', protect, logout);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
