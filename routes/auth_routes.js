const express = require('express')
const router = express.Router()
const { login } = require('../controllers/auth_controller')

// Route Prefix = '/api/v1/auth'

router.post('/login', login)

module.exports = router
