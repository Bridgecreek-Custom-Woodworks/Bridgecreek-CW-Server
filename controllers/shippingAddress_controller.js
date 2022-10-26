const ShippingAddress = require('../models/ShippingAddress');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all shipping addresses
// @route GET /api/v1/shippingaddress/admin/allshippiingaddresses
// access Private/Admin
exports.getAllShippingAddresses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch);
});

// @desc Get users shipping addresses
// @route GET /api/v1/shippingaddress/myshippingaddresses
// access Private
exports.getMyShippingAddresses = asyncHandler(async (req, res, next) => {
  const shippingAddress = await ShippingAddress.findAll({
    where: { userId: req.user.userId },
  });

  if (!shippingAddress) {
    return next(new ErrorResponse('You have no shipping addresses saved', 404));
  }
  res.status(200).json({ success: true, data: shippingAddress });
});

// @desc Get single shipping address
// @route GET /api/v1/shippingaddress/:shippingAddressId
// access Private
exports.getShippingAddress = asyncHandler(async (req, res, next) => {
  const shippingAddress = await ShippingAddress.findOne({
    where: { shippingAddressId: req.params.shippingAddressId },
  });

  if (!shippingAddress) {
    return next(
      new ErrorResponse(
        `The shipping addresses with the id  of ${req.params.shippingAddressId} was not found`
      )
    );
  }
  res.status(200).json({ success: true, data: shippingAddress });
});

// @desc Create shipping address
// @route POST /api/v1/shippingaddress
// access Private
exports.createShippingAddress = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.userId;

  const shippingAddress = await ShippingAddress.create(req.body);

  if (!shippingAddress) {
    return next(new ErrorResponse('Shipping Address was not created', 400));
  }
  res.status(201).json({ success: true, data: shippingAddress });
});

// @desc Update shipping address
// @route PUT /api/v1/shippingaddress/update/:shippingAddressId
// access Private
exports.updateShippingAddress = asyncHandler(async (req, res, next) => {
  const shippingAddress = await ShippingAddress.update(req.body, {
    where: { shippingAddressId: req.params.shippingAddressId },
    returning: true,
  });

  if (!shippingAddress) {
    return next(
      new ErrorResponse(
        `The shipping address with the id ${req.params.shippingaddressId} was not found`
      )
    );
  }
  res.status(200).json({ success: true, data: shippingAddress });
});

// @desc Delete shipping address
// @route DELETE /api/v1/shippingaddress/delete/:shippingAddressId
// access Private
exports.deleteShippingAddress = asyncHandler(async (req, res, next) => {
  const shippingAddress = await ShippingAddress.destroy({
    where: { shippingAddressId: req.params.shippingAddressId },
  });

  if (!shippingAddress) {
    return next(
      new ErrorResponse(
        `The shipping address with the id ${req.params.shippingaddressId} was not found`
      )
    );
  }
  res.status(200).json({ success: true, data: shippingAddress });
});
