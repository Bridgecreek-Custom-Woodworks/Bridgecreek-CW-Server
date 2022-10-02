const Products = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { Op, Sequelize, Model } = require('sequelize');

// @desc Get all products
// @route GET /api/v1/products
// access Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  // const products = await Products.findAll(); // <== Restore after testing *****
  let query = {};

  const { pricegte, pricelte, weightgte, weightlte } = req.query;

  if (pricegte || pricelte || weightgte || weightlte) {
    const { pricegte, pricelte, weightgte, weightlte } = req.query;
    if (pricegte) {
      query['where'] = { price: { [Op.gte]: pricegte } };
    }
    if (pricelte) {
      query['where'] = { price: { [Op.lte]: pricelte } };
    }
    if (weightgte) {
      query['where'] = { weight: { [Op.gte]: weightgte } };
    }
    if (weightlte) {
      query['where'] = { weight: { [Op.lte]: weightlte } };
    }
  }

  // Coping req.query for the if statement below
  let reqQuery = { ...req.query };

  if (!query.where || !query.where) {
    // Coping req.query for the if statement below
    reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['attributes'];

    // Loop over removeFields and delete them from req.query
    removeFields.forEach((param) => delete req.query[param]);

    query['where'] = req.query;
  }

  // Place if statement here for Op.and operator... if query.where && query.where has , then do stuff...

  if (reqQuery.attributes) {
    // Turn attributes values from string into array
    const attributesArr = reqQuery.attributes[0].split(',');
    query['attributes'] = attributesArr;
  }

  if (reqQuery.order) {
    // Turn order values from string into array
    const orderArr = reqQuery.order[0].split(',');
    query['order'] = [[orderArr]];
  }

  query = Products.findAll(query);

  const products = await query;

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
