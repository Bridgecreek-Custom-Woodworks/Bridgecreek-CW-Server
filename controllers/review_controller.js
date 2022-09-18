const ErrorResponse = require('../utils/errorResponse');
const Reviews = require('../models/Reviews');
const User = require('../models/User');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');

const { Op } = require('sequelize');
const asyncHandler = require('../middleware/async_middleware');
const sequelize = require('sequelize');

// @desc Get all reviews
// @route GET /api/v1/reviews/admin/allreviews
// access Private / Admin
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(
      new ErrorResponse('User must be logged in to add a review', 400)
    );
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

  // const count = reviews[0].Products.length; // Need to figure out how to get the count for this (reduce method?).

  res.status(200).json({
    success: true,
    // count,
    data: reviews,
  });
});

// @desc Get single review
// @route GET /api/v1/product/review/:productId
// access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Product.findAll({
    attributes: ['productId', 'productName', 'price'],

    where: { productId: req.params.productId },
    include: [
      {
        model: User,
        through: {
          attributes: ['updatedAt', 'createdAt', 'comments', 'rating'],
        },
        attributes: ['firstName', 'lastName'],
        required: true,
      },
    ],
  });

  if (data.length === 0) {
    return next(new ErrorResponse(`This product currently has no reviews `));
  }

  const count = data.length;
  res.status(200).json({
    success: true,
    count,
    data: review,
  });
});

// @desc Get users reviews
// @route GET /api/v1/product/myreviews
// access Private
exports.getMyReviews = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please login to see your reviews', 400));
  }

  // const review = await User.findAll({
  //   attributes: ['firstName', 'lastName'],
  //   where: {
  //     userId: req.user.userId,
  //   },
  //   include: [
  //     {
  //       model: Product,
  //       through: {
  //         attributes: ['updatedAt', 'createdAt', 'comments', 'rating'],
  //       },
  //       attributes: ['productId', 'productName', 'price'],
  //       required: true,
  //     },
  //   ],
  // });

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
    return next(new ErrorResponse(`You have not reviewed any products yet.`));
  }

  const count = review.length;

  res.status(200).json({
    success: true,
    count,
    data: review,
  });
});

// @desc Add review to product
// @route POST /api/v1/review
// access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.userId;

  const review = await Reviews.create(req.body);

  const count = review.length;

  res.status(200).json({ success: true, count, data: review });
});

// @desc Update review
// @route PUT /api/v1/review/:productId
// access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please login to update your review', 401));
  }

  const review = await Reviews.update(req.body, {
    where: {
      [Op.and]: { productId: req.params.productId },
      userId: req.user.userId,
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
    review: 'Your review has been updated',
  });
});

// @desc Remove review from product
// @route DELETE /api/v1/review
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
    review: 'Your review has been deleted',
  });
});
