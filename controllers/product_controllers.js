const Products = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all products
// @route GET /api/v1/products
// access Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Products.findAll();
  const count = products.length;
  res.status(200).json({ success: true, count: count, data: products });
});

// @desc Get single product
// @route GET /api/v1/products/:productId
// access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findOne({
    where: { productId: req.params.productId },
  });

  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with the id of ${req.params.productId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc Create product
// @route POST /api/v1/products/admin
// access  Private/Admin
exports.createProducts = asyncHandler(async (req, res, next) => {
  const product = await Products.create(req.body);

  res.status(201).json({ success: true, data: product });
});

// @desc Update product
// @route PUT /api/v1/products/:productId/admin
// access Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Products.update(req.body, {
    where: {
      productId: req.params.productId,
    },
    returning: true,
  });

  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with the id of ${req.product.productId}`,
        404
      )
    );
  }

  let updatedProduct = product.flat(Infinity);
  product = updatedProduct[1].dataValues;

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc Delete product
// @route DELETE /api/v1/products/:productId/admin
// access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.destroy({
    where: {
      productId: req.params.productId,
    },
  });
  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with the id of ${req.params.productId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: product,
    msg: `Product with the id of ${req.params.productId} was deleted`,
  });
});
