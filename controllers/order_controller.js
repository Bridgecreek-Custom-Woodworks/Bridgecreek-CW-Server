const Orders = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

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
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }

  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get a single order
// @route GET /api/v1/orders/getorder/:orderId
// access Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Orders.findOne({
    where: { orderId: req.params.orderId },
  });

  // console.log(req.user.dataValues.Cart); ****

  if (!order) {
    return next(new ErrorResponse(`Order ${req.params.orderId} was not found`));
  }
  res.status(200).json({ success: true, data: order });
});

// @desc Create order
// @route POST /api/v1/order
// access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { Cart } = req.user.dataValues;

  //  Setting user values to the body of the req for the order
  req.body = req.user.dataValues;

  //  Setting the Cart total to the body of the req subTotal for the order
  req.body.subTotal = Cart.dataValues.total;

  if (!req.user.dataValues.activeStatus === 'active') {
    return next(new ErrorResponse('Please active your account first', 400));
  }

  const order = await Orders.build(req.body);

  order.orderStatus = 'pending';
  await order.save();
  //   await order.destroy();
  res.status(200).json({ success: true, data: order });
});

// @desc Update order
// @route PUT /api/v1/orders/update/:orderId
// access Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }

  const order = await Orders.update(req.body, {
    where: { orderId: req.params.orderId },
    returning: true,
  });

  if (!order) {
    return next(new ErrorResponse('Your order was not updated', 404));
  }

  res.status(200).json({ success: true, data: order });
});

// @desc Delete order
// @route PUT /api/v1/orders/delete/:orderId
// access Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }

  const order = await Orders.destroy({
    where: { orderId: req.params.orderId },
  });

  if (!order) {
    return next(
      new ErrorResponse(`Order with id ${req.params.orderId} not found`, 404)
    );
  }

  res.status(200).json({ success: true, data: order });
});
