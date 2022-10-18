const express = require('express');
const {
  getReview,
  getMyReviews,
  addReview,
  updateReview,
  removeReview,
} = require('../controllers/review_controller');
const { protect } = require('../middleware/auth_middleware');

const Users = require('../models/User');
const CartOrderAccess = require('../models/CartOrderAccess');

const review = require('./admin_routes');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', review);

// Route = /api/v1/reviews
router.get('/product/review/:productId', getReview);
router.get('/product/myreviews', protect(Users), getMyReviews);
router.post('/', protect(Users), addReview);
router.put('/:productId', protect(Users), updateReview);
router.delete('/:productId', protect(Users), removeReview);

module.exports = router;
