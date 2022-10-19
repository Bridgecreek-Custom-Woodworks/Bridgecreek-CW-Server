const express = require('express');
const {
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
} = require('../controllers/guest_controller');

const { protect } = require('../middleware/auth_middleware');

const CartOrderAccess = require('../models/CartOrderAccess');

const router = express.Router();

// Route = '/api/v1/guests'

router.get('/getme', protect(CartOrderAccess), getGuest);
router.post('/', createGuest);
router.put('/update/:guestId', protect(CartOrderAccess), updateGuest);
router.delete('/delete/:guestId', protect(CartOrderAccess), deleteGuest);

module.exports = router;
