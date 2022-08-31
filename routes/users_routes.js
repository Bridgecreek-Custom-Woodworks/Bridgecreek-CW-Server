const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
} = require('../controllers/user_controller')

const { protect } = require('../middleware/auth_middleware')

// Route prefix /api/v1/users

router.get('/', getAllUsers)
router.get('/getMe', protect, getUser)
router.post('/', registerUser)
router.put('/updateMe', protect, updateUser)
router.delete('/deleteMe', protect, deleteUser)
module.exports = router
