const express = require('express');
const {
  getAllReviews,
  getReview,
  getMyReviews,
  addReview,
  updateReview,
  removeReview,
} = require('../controllers/review_controller');

const { protect, authorize } = require('../middleware/auth_middleware');

const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');
const Reviews = require('../models/Reviews');

const router = express.Router();

// Route = /api/v1/reviews
router.get(
  '/admin/allreviews',
  protect(Users),
  authorize('admin'),
  advancedQuerySearch(Reviews),
  getAllReviews
);
router.get('/product/review/:productId', getReview);
router.get('/product/myreviews', protect(Users), getMyReviews);
router.post('/', protect(Users), addReview);
router.put('/update/:productId', protect(Users), updateReview);
router.delete('/delete/:productId', protect(Users), removeReview);

module.exports = router;
