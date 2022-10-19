const express = require('express');
const { getGuest, createGuest } = require('../controllers/guest_controller');
const { protect } = require('../middleware/auth_middleware');
const router = express.Router();

// Route = '/api/v1/guests'

router.get('/getme', getGuest);
router.post('/', createGuest);

module.exports = router;
