const express = require('express')
const router = express.Router()
const { getWishlist } = require('../controllers/admin_controllers')
const { protect } = require('../middleware/auth_middleware')

// Route Prefix = /api/v1/admin

router.get('/', protect, getWishlist)
module.exports = router
