const OrderItems = require('../models/OrderItems');
const Orders = require('../models/Order');
const Products = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all orders items
// @route GET /api/v1/orders/admin/allordersitems
// access Private/Admin
exports.getAllOrderItems = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }
  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get a single orderitem
// @route GET /api/v1/orders/getorderitem/:orderItemId
// access Private
exports.getOrderItem = asyncHandler(async (req, res, next) => {
  const orderItem = await OrderItems.findOne({
    where: { orderItemId: req.params.orderItemId },
  });

  if (!orderItem) {
    return next(
      new ErrorResponse(`Order Item ${req.params.orderItemId} was not found`)
    );
  }

  res.status(200).json({ success: true, data: orderItem });
});

// @desc Create order item
// @route POST /api/v1/ordersitems
// access Private
exports.createOrderItem = asyncHandler(async (req, res, next) => {
  const { Orders } = req.user.dataValues;

  let usersOrder;

  // Getting existing order
  for (let i = 0; i < Orders.length; i++) {
    if (Orders[i].dataValues.orderStatus === 'pending') {
      usersOrder = Orders[i];
      break;
    } else if (Orders[i].dataValues.orderStatus === 'new order') {
      usersOrder = Orders[i];
    }
  }

  const product = await Products.findOne({
    where: { productId: req.body.productId },
  });

  const { price, discount } = product.dataValues;
  const { quantity, productId } = req.body;
  const { orderId } = usersOrder.dataValues;

  let discountTotal = Number(price) * Number(discount);
  let total = Number(price) * quantity - Number(discountTotal);

  req.body = {
    productId: productId,
    price: price,
    quantity: quantity,
    discountTotal: discountTotal.toFixed(2),
    total: total.toFixed(2),
    orderId: orderId,
  };

  const orderItem = await OrderItems.create(req.body);

  if (!orderItem) {
    return next(new ErrorResponse('Order was not created', 400));
  }

  res.status(200).json({ success: true, data: orderItem });
});

// @desc Update order item
// @route PUT /api/v1/orderitems/update/:orderitemId
// access Private
exports.updateOrderItem = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }

  const orderItem = await OrderItems.findOne({
    where: { orderItemId: req.params.orderitemId },
    include: { model: Orders },
    returning: true,
  });

  if (!orderItem) {
    return next(
      new ErrorResponse(`Order Item ${req.body.params} was not found`)
    );
  }

  orderItem.update(req.body);

  res.status(200).json({ success: true, data: orderItem });
});

// @desc Delete order item
// @route DELETE /api/v1/orderitems/delete/:orderitemId
// access Private
exports.deleteOrderItem = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }

  const orderItem = await OrderItems.destroy({
    where: { orderItemId: req.params.orderitemId },
  });

  if (!orderItem) {
    return next(
      new ErrorResponse(`Order item with ${req.body.params} was not found`)
    );
  }

  res.status(200).json({ success: true, data: orderItem });
});
