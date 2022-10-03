const Products = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { Op } = require('sequelize');

// @desc Get all products
// @route GET /api/v1/products
// access Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  // const products = await Products.findAll(); // <== Restore after testing *****
  let query = {};
  query['subQuery'] = true;

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
    const removeFields = ['attributes', 'limit', 'offset', 'page'];

    // Loop over removeFields and delete them from req.query
    removeFields.forEach((param) => delete req.query[param]);

    query['where'] = req.query;
  }

  // Place if statement here for Op.and operator... if query.where && query.where has a comma (,) then do stuff...

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

  // Pagination
  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Products.count();

  // Pagination result
  const pagination = {};

  // Add limit and offset to query being returned for pagination\
  if (reqQuery.offset || reqQuery.limit) {
    query.subQuery = false;
    query['offset'] = startIndex;
    query['limit'] = reqQuery.limit ? reqQuery.limit : 10;
  }

  console.log(query);

  query = Products.findAll(query); // <== Products will need to become model to make this more reusable and then a parameters model can be passed to the function

  const products = await query; // <== products will need to be turned into results to make this more reusable

  const count = products.length; // <== This products.length will need to become model.length

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

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
