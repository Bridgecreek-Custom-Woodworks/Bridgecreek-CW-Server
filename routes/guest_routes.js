const express = require('express');
const {} = require('../controllers/guest_controller');
const { protect } = require('../middleware/auth_middleware');
const router = express.Router();

// Route = '/api/v1/guests'

module.exports = router;
