const express = require('express');
const {
  getMyCartOrderAccess,
  createCartOrderAccess,
  updateCartOrderAccess,
  deleteCartOrderAccess,
} = require('../controllers/cartOrderAccess_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const router = express.Router();

const CartOrderAccess = require('../models/CartOrderAccess');

// Route = '/api/v1/cartorderaccess'

router.get('/getme', protect(CartOrderAccess), getMyCartOrderAccess);
router.post(
  '/',
  protect(CartOrderAccess),
  authorize('admin'),
  createCartOrderAccess
);
router.put(
  '/update/:cartOrderAccessId',
  protect(CartOrderAccess),
  updateCartOrderAccess
);
router.delete(
  '/delete/:cartOrderAccessId',
  protect(CartOrderAccess),
  deleteCartOrderAccess
);

module.exports = router;
