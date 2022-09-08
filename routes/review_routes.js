const express = require('express');
const {
  getReview,
  getMyReviews,
  addReview,
  updateReview,
  removeReview,
} = require('../controllers/review_controller');
const { protect } = require('../middleware/auth_middleware');

const review = require('./admin_routes');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', review);

// Route = /api/v1/reviews
router.get('/product/review/:productId', getReview);
router.get('/product/myreviews', protect, getMyReviews);
router.post('/', protect, addReview);
router.put('/:productId', protect, updateReview);
router.delete('/:productId', protect, removeReview);

module.exports = router;
