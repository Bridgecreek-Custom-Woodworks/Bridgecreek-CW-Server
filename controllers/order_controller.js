const Orders = require('../models/Order');
const Product = require('../models/Product');
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

  const { cartOrderAccessId } = req.user.dataValues;

  const order = await Orders.findAll({
    where: { cartOrderAccessId: cartOrderAccessId },
    include: [{ model: Product }],
  });

  res.status(200).json({ success: true, data: order });
});

// @desc Get a single order
// @route GET /api/v1/orders/getorder/:orderId
// access Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Orders.findOne({
    where: { orderId: req.params.orderId },
    include: [
      {
        model: Product,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
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
  const { Carts, Guests, Users, Orders: existingOrders } = req.user.dataValues;
  let usersCart;
  let newOrPendingOrders;
  let activeStatus;

  //  Setting user values to the body of the req for the order
  if (Guests.length === 1) {
    activeStatus = Guests[0].dataValues.activeStatus;
    req.body = Guests[0].dataValues;
  } else if (Users.length === 1) {
    activeStatus = Users[0].dataValues.activeStatus;
    req.body = Users[0].dataValues;
  }

  // Getting users cart that is not already in paid or completed status
  for (let i = 0; i < Carts.length; i++) {
    if (Carts[i].dataValues.cartStatus === 'checkout') {
      usersCart = Carts[i];
      break;
    } else if (Carts[i].dataValues.cartStatus === 'new') {
      usersCart = Carts[i];
    }
  }

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

  if (req.user.dataValues.Orders.length > 0 && newOrPendingOrders) {
    await newOrPendingOrders.destroy();
  }

  let order = await Orders.build(req.body);

  // Changing cart status to checkout
  usersCart.cartStatus = 'checkout';
  await usersCart.save();

  // Changing orders status to pending
  order.orderStatus = 'pending';
  await order.save();

  order.createOrderItems(req);

  res.status(201).json({ success: true, data: order });
});

// @desc Update order
// @route PUT /api/v1/orders/update/:orderId
// access Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }
  const { Carts } = req.user.dataValues;

  let usersCart;

  // Getting users cart that is associated with this order.
  for (let i = 0; i < Carts.length; i++) {
    if (Carts[i].dataValues.cartStatus === 'checkout') {
      usersCart = Carts[i];
      break;
    } else if (Carts[i].dataValues.cartStatus === 'new') {
      usersCart = Carts[i];
      usersCart.dataValues.cartStatus = 'checkout';
      usersCart.save();
      break;
    }
  }

  let order = await Orders.findOne({
    where: { orderId: req.params.orderId },
  });

  if (!order) {
    return next(new ErrorResponse('Your order was not found', 404));
  }

  req.body.subTotal = usersCart.dataValues.total;

  order = await order.update(req.body);
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
