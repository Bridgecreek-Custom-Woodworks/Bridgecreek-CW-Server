const Orders = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');
const Reviews = require('../models/Reviews');

// @desc Get all orders
// @route GET /api/v1/orders/admin/allorders
// access Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }
  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get single uses orders
// @route GET /api/v1/orders/getmyorders
// access Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const order = await Orders.findAll({
    where: { userId: req.user.userId },
  });

  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get a single order
// @route GET /api/v1/orders/getorder/:orderId
// access Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Orders.findOne({
    where: {},
  });
  res.status(200).json({ success: true, data: order });
});

// @desc Create order
// @route POST /api/v1/order
// access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { Cart } = req.user.dataValues;
  req.body = req.user.dataValues;
  req.body.subTotal = Cart.dataValues.total;

  // Check if user activeStatus is active
  // Set order status to pending at the bottom of this route

  console.log(req.body);

  const order = await Orders.build(req.body);

  console.log(req.user.dataValues);
  console.log(Cart.dataValues.total);

  order.save();
  res.status(200).json({ success: true, data: order });
});
