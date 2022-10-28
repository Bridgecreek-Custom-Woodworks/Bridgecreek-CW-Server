const ProductCare = require('../models/ProductCare');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all product care
// @route GET /api/v1/productcare/allproductcare/admin
// access Private/Admin
exports.getAllProductCare = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch);
});

// @desc Get single product care
// @route GET /api/v1/productcare/:productCareId
// access Public
exports.getProductCare = asyncHandler(async (req, res, next) => {
  const productCare = await ProductCare.findOne({
    where: { productCareId: req.params.productCareId },
  });

  if (!productCare) {
    return next(
      new ErrorResponse(
        `Product Care with the id of ${req.params.productCareId} was not found`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: productCare });
});

// @desc Create product care
// @route POST /api/v1/productcare/admin
// access Private/Admin
exports.createProductCare = asyncHandler(async (req, res, next) => {
  const productCare = await ProductCare.create(req.body);

  if (!productCare) {
    return next(new ErrorResponse('Unable to create Product Care item', 400));
  }

  res.status(201).json({ success: true, data: productCare });
});

// @desc Updated product care
// @route PUT /api/v1/productcare/update/:productCareId/admin
// access Private/Admin
exports.updateProductCare = asyncHandler(async (req, res, next) => {
  const productCare = await ProductCare.update(req.body, {
    where: { productCareId: req.params.productCareId },
    returning: true,
  });

  if (productCare[0] === 0) {
    return next(new ErrorResponse('Unable to update Product Care item', 400));
  }

  res.status(200).json({ success: true, data: productCare });
});

// @desc Delete product care
// @route DELETE /api/v1/productcare/delete/:productCareId/admin
// access Private/Admin
exports.deleteProductCare = asyncHandler(async (req, res, next) => {
  const productCare = await ProductCare.destroy({
    where: { productCareId: req.params.productCareId },
  });

  if (productCare === 0) {
    return next(
      new ErrorResponse(
        `Product Care with id ${req.params.productCareId} was not found`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: productCare });
});
