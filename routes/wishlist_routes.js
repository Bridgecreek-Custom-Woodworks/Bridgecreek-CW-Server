const express = require('express')
const router = express.Router()
const {
  getUsersWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
} = require('../controllers/wishlist_controller')
const { protect } = require('../middleware/auth_middleware')

router.get('/mywishlist', protect, getUsersWishlist)
router.post('/mywishlist', protect, addItemToWishlist)
router.delete('/mywishlist/:productId', protect, removeItemFromWishlist)

module.exports = router
