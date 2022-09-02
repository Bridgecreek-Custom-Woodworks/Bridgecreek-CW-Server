const Wishlist = require('../models/Wishlist')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async_middleware')
const User = require('../models/User')
const Product = require('../models/Product')
const { Op } = require('sequelize')

exports.getWishlist = asyncHandler(async (req, res, next) => {
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

exports.getUsersWishlist = asyncHandler(async (req, res, next) => {
  const data = await User.findAll({
    where: { userId: req.user.userId },
    include: Product,
  })

  if (data[0].Products.length === 0) {
    return next(new ErrorResponse(`Your wishlist is currently empty`))
  }
  const count = data[0].Products.length
  res.status(200).json({
    success: true,
    count,
    data,
  })
})

exports.addItemToWishlist = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.userId

  const wishlist = await Wishlist.create(req.body)

  const count = wishlist.length

  res.status(200).json({ success: true, count, data: wishlist })
})

exports.removeItemFromWishlist = asyncHandler(async (req, res, next) => {
  const product = await Wishlist.destroy({
    where: {
      [Op.and]: { productId: req.params.productId },
      userId: req.user.userId,
    },
  })

  if (!product) {
    return next(new ErrorResponse(`User not authorized`))
  }

  const count = await Wishlist.count({
    where: {
      userId: req.user.userId,
    },
  })

  res.status(200).json({ success: true, count, data: product })
})
