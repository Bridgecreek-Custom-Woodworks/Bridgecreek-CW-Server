const Wishlist = require('../models/Wishlist');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Product = require('../models/Product');
const { Op } = require('sequelize');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all wishlist
// @route GET /api/v1/wishlist/admin/allwishlist
// access Private/Admin
exports.getAllWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await User.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Product,
        through: { attributes: ['updatedAt', 'createdAt'] },
        attributes: ['productId', 'productName', 'price'],
        required: true,
      },
    ],
  });

  const count = wishlist.length;

  res.status(200).json({
    success: true,
    count,
    data: wishlist,
  });
});

// @desc Get single user wishlist
// @route GET /api/v1/wishlist
// access Private
exports.getUsersWishlist = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(
      new ErrorResponse('User must be logged in to access wishlist', 400)
    );
  }

  const data = await User.findAll({
    attributes: ['firstName', 'lastName'],
    require: true,
    where: { userId: req.user.userId },
    include: Product,
  });

  if (data[0].Products.length === 0) {
    return next(new ErrorResponse(`Your wishlist is currently empty`));
  }

  const count = data[0].Products.length;
  res.status(200).json({
    success: true,
    count,
    data,
  });
});

// @desc Add product to wishlist
// @route POST /api/v1/wishlist
// access Private
exports.addItemToWishlist = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.userId;

  const wishlist = await Wishlist.create(req.body);

  const count = wishlist.length;

  res.status(200).json({ success: true, count, data: wishlist });
});

// @desc Remove item from wishlist
// @route DELETE /api/v1/wishlist
// access Private
exports.removeItemFromWishlist = asyncHandler(async (req, res, next) => {
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
