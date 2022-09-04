const Wishlist = require('../models/Wishlist')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const Product = require('../models/Product')
const asyncHandler = require('../middleware/async_middleware')
const { Op } = require('sequelize')

// @desc Get all wishlist
// @route GET /api/v1/wishlist
// access Private/Admin
exports.getWishlist = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin' && process.env.NODE_ENV === 'production') {
    return next(new ErrorResponse(`User ${req.user.userId} not authorized`))
  }

  const wishlist = await User.findAll({
    include: [
      {
        model: Product,
        required: true,
      },
    ],
  })

  const count = wishlist.length

  res.status(200).json({
    success: true,
    count,
    data: wishlist,
  })
})
