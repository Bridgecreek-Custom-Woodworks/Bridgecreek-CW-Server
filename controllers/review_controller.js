const ErrorResponse = require('../utils/errorResponse');
const Reviews = require('../models/Reviews');
const User = require('../models/User');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const { Op } = require('sequelize');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all reviews
// @route GET /api/v1/reviews/admin/allreviews
// access Private / Admin
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(
      new ErrorResponse('User must be logged in to add a review', 400)
    );
  }

  if (
    Object.keys(req.query).length > 0 ||
    !Object.keys(req.query).length === 0
  ) {
    return res.status(200).json(res.advancedQuerySearch);
  }

  const reviews = await User.findAll({
    attributes: ['firstName', 'lastName'],
    include: [
      {
        model: Reviews,
        attributes: ['updatedAt', 'createdAt', 'comments', 'rating'],
        required: true,
        include: [
          {
            model: Product,
            attributes: ['productId', 'productName', 'price', 'avgRating'],
            required: true,
          },
        ],
      },
    ],
  });

  const count = await Reviews.count();

  res.status(200).json({
    success: true,
    count,
    data: reviews,
  });
});

// @desc Get single review
// @route GET /api/v1/reviews/product/review/:productId
// access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Reviews.findOne({
    attributes: [
      'reviewId',
      'productId',
      'updatedAt',
      'createdAt',
      'comments',
      'rating',
    ],

    where: { productId: req.params.productId },
    include: [
      {
        model: Product,
        attributes: ['productId', 'productName', 'price', 'avgRating'],
        required: true,
      },
      {
        model: User,
        attributes: ['firstName', 'lastName'],
        required: true,
      },
    ],
  });

  if (!review) {
    return next(
      new ErrorResponse(`This product currently has no reviews`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Get users reviews
// @route GET /api/v1/reviews/product/myreviews
// access Private
exports.getMyReviews = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please login to see your reviews', 400));
  }

  const review = await Reviews.findAll({
    attributes: ['updatedAt', 'createdAt', 'comments', 'rating'],

    where: { userId: req.user.userId },
    include: [
      {
        model: Product,
        attributes: ['productId', 'productName', 'price', 'avgRating'],
        required: true,
      },
    ],
  });

  if (review.length === 0) {
    return next(
      new ErrorResponse(`You have not reviewed any products yet.`, 400)
    );
  }

  const count = review.length;

  res.status(200).json({
    success: true,
    count,
    data: review,
  });
});

// @desc Add review to product
// @route POST /api/v1/reviews
// access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.userId;

  const review = await Reviews.create(req.body);

  const count = await Reviews.count();

  res.status(200).json({ success: true, count, data: review });
});

// @desc Update review
// @route PUT /api/v1/reviews/:productId
// access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please login to update your review', 401));
  }

  const review = await Reviews.update(req.body, {
    where: {
      [Op.and]: [
        { productId: req.params.productId },
        { userId: req.user.userId },
      ],
    },
    individualHooks: true,
  });

  if (!review) {
    return next(
      new ErrorResponse(
        `The review with id ${req.params.productId} was not found`,
        400
      )
    );
  }

  const count = await Reviews.count({
    where: {
      userId: req.user.userId,
    },
  });

  res.status(200).json({
    success: true,
    count,
    data: review,
    msg: 'Your review has been updated',
  });
});

// @desc Remove review from product
// @route DELETE /api/v1/reviews/:productId
// access Private
exports.removeReview = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please login to remove your review', 401));
  }

  const review = await Reviews.destroy({
    where: {
      [Op.and]: { productId: req.params.productId },
      userId: req.user.userId,
    },
    individualHooks: true,
  });

  if (!review) {
    return next(
      new ErrorResponse(
        `The review with id ${req.params.productId} has already been removed`,
        400
      )
    );
  }

  const count = await Reviews.count({
    where: {
      userId: req.user.userId,
    },
  });

  res.status(200).json({
    success: true,
    count,
    data: review,
    msg: 'Your review has been deleted',
  });
});
