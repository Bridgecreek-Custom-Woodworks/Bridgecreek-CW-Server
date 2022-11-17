const Products = require('../models/Product');
const Reviews = require('../models/Reviews');
const ProductCare = require('../models/ProductCare');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const stripe = require('stripe')(process.env.STRIP_SECRET_TEST_KEY);
const cloudinary = require('../utils/cloudinary.js');

// @desc Get all products
// @route GET /api/v1/products/allproducts
// access Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get single product
// @route GET /api/v1/products/:productId
// access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findOne({
    where: { productId: req.params.productId },
    include: {
      model: Reviews,
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
  });
});

// @desc Create product
// @route POST /api/v1/products/admin
// access  Private/Admin
exports.createProducts = asyncHandler(async (req, res, next) => {
  const dbProduct = await Products.build(req.body);

  if (!dbProduct) {
    return next(new ErrorResponse('Unable to create product in database', 400));
  }

  let unitPrice = String(dbProduct.price).split('.').join('');

  // *** Need to add product care model here as well ***
  const productCare = await ProductCare.build({
    productId: dbProduct.productId,
    maintenance: req.body.maintenance,
  });

  try {
    var cloudinaryRes = await cloudinary.uploader.upload(req.body.image, {
      folder: 'online-shop',
      public_id: null,
      overwrite: true,
      width: 300,
      height: 300,
    });

    var stripeProduct = await stripe.products.create({
      id: dbProduct.productId,
      name: dbProduct.productName,
      active: true,
      images: [cloudinaryRes.secure_url],
      description: dbProduct.description,
      url: dbProduct.url,
      default_price_data: {
        currency: 'usd',
        unit_amount: Number(unitPrice),
        tax_behavior: 'exclusive',
      },
    });
  } catch (error) {
    return next(
      new ErrorResponse(
        `Unable to create product in Stripe or Cloudinary: ${error}`,
        400
      )
    );
  }

  // dbProduct.url = cloudinaryRes.secure_url;
  dbProduct.stripeProductId = stripeProduct.default_price;

  await dbProduct.save();
  await dbProduct.validate();
  await productCare.save();
  await productCare.validate();

  res.status(201).json({ success: true, data: dbProduct });
});

// @desc Update product
// @route PUT /api/v1/products/update/:productId/admin
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
// @route DELETE /api/v1/products/delete/:productId/admin
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
