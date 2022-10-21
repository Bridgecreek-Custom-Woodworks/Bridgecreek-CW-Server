const express = require('express');

const { protect, authorize } = require('../middleware/auth_middleware');

const router = express.Router({ mergeParams: true });

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

// Route  = /api/v1/admin

module.exports = router;
