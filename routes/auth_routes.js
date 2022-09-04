const express = require('express')
const router = express.Router()
const { login, logout } = require('../controllers/auth_controller')
const { protect } = require('../middleware/auth_middleware')

// Route  = /api/v1/auth
router.post('/login', login)
router.post('/logout', protect, logout)

module.exports = router
