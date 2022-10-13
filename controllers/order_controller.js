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

  if (!order) {
    return next(new ErrorResponse(`Order ${req.params.orderId} was not found`));
  }
  res.status(200).json({ success: true, data: order });
});

// @desc Create order
// @route POST /api/v1/orders
// access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { Carts, activeStatus, Orders: existingOrders } = req.user.dataValues;

  let usersCart;
  let newOrPendingOrders;

  // Getting users cart that is not already in paid or completed status
  for (let i = 0; i < Carts.length; i++) {
    if (Carts[i].dataValues.cartStatus === 'checkout') {
      usersCart = Carts[i];
      break;
    } else if (Carts[i].dataValues.cartStatus === 'new') {
      usersCart = Carts[i];
    }
  }

  //  Setting user values to the body of the req for the order
  req.body = req.user.dataValues;

  //  Setting the Cart total to the body of the req subTotal for the order
  req.body.subTotal = usersCart.dataValues.total;

  // Verifying that the customer's account is active
  if (activeStatus === 'pending' || activeStatus === 'not active') {
    return next(new ErrorResponse('Please active your account first', 400));
  }

  // Getting users order that is not already in paid or shipped status
  for (let i = 0; i < existingOrders.length; i++) {
    if (existingOrders[i].dataValues.orderStatus === 'pending') {
      newOrPendingOrders = existingOrders[i];
      break;
    } else if (existingOrders[i].dataValues.orderStatus === 'new order') {
      newOrPendingOrders = existingOrders[i];
    }
  }

  // if (newOrPendingOrders) {
  //   return next(
  //     new ErrorResponse(
  //       'Cannot create new order if new or pending order exist',
  //       400
  //     )
  //   );
  // }

  const order = await Orders.build(req.body);

  order.createOrderItems(req);

  // Changing cart status to checkout
  usersCart.cartStatus = 'checkout';
  // await usersCart.save();   <=== Uncomment after testing *******

  // Changing orders status to pending
  order.orderStatus = 'pending';
  // await order.save();  <=== Uncomment after testing *******

  res.status(201).json({ success: true, data: order });
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
