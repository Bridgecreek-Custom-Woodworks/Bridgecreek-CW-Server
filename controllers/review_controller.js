const Reviews = require('../models/Reviews');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Product = require('../models/Product');
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
        model: Product,
        through: {
          attributes: ['updatedAt', 'createdAt', 'comments', 'rating'],
        },
        attributes: ['productId', 'productName', 'price', 'avgRating'],
        required: true,
      },
    ],
  });

  const count = reviews[0].Products.length; // Need to figure out how to get the count for this (reduce method?).

  res.status(200).json({
    success: true,
    count,
    data: reviews,
  });
});

// @desc Get single review
// @route GET /api/v1/product/review/:productId
// access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const data = await Product.findAll({
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
    data,
  });
});

// @desc Get users reviews
// @route GET /api/v1/product/myreviews
// access Private
exports.getMyReviews = asyncHandler(async (req, res, next) => {
  const data = await User.findAll({
    attributes: ['firstName', 'lastName'],
    where: {
      userId: req.user.userId,
    },
    include: [
      {
        model: Product,
        through: {
          attributes: ['updatedAt', 'createdAt', 'comments', 'rating'],
        },
        attributes: ['productId', 'productName', 'price'],
        required: true,
      },
    ],
  });

  if (data[0].Products.length === 0) {
    return next(new ErrorResponse(`You have not reviewed any products yet.`));
  }

  const count = data[0].Products.length;

  res.status(200).json({
    success: true,
    count,
    data,
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
// @route PUT /api/v1/review
// access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  // NEED TO ADD LOGIC TO THIS ROUTE ************
});

// @desc Remove review from product
// @route DELETE /api/v1/review
// access Private
exports.removeReview = asyncHandler(async (req, res, next) => {
  const product = await Wishlist.destroy({
    where: {
      [Op.and]: { productId: req.params.productId },
      userId: req.user.userId,
    },
  });

  if (!product) {
    return next(new ErrorResponse(`User not authorized`));
  }

  const count = await Wishlist.count({
    where: {
      userId: req.user.userId,
    },
  });

  res.status(200).json({ success: true, count, data: product });
});
