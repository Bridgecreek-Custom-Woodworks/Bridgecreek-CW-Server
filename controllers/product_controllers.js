const Products = require('../models/Product')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async_middleware')
const { RowDescriptionMessage } = require('pg-protocol/dist/messages')

// @desc Get all products
// @route GET /api/v1/products
// access Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Products.findAll()
  res.status(200).json({ success: true, data: products })
})

// @desc Get single product
// @route GET /api/v1/products
// access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findOne({
    where: { productId: req.params.productId },
  })

  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with the id of ${req.params.productId} `,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: product,
  })
})
