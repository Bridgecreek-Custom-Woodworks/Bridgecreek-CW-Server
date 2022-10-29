const express = require('express');
const {
  getAllGuest,
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
} = require('../controllers/guest_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router();
const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const CartOrderAccess = require('../models/CartOrderAccess');
const Admin = require('../models/Admin');
const Guests = require('../models/Guests');

// Route = '/api/v1/guests'

router.get(
  '/admin/allguests',
  protect(Admin),
  authorize('admin'),
  advancedQuerySearch(Guests),
  getAllGuest
);
router.get('/getme', protect(CartOrderAccess), getGuest);
router.post('/', createGuest);
router.put('/update/:guestId', protect(CartOrderAccess), updateGuest);
router.delete('/delete/:guestId', protect(CartOrderAccess), deleteGuest);

module.exports = router;
