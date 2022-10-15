const OrderItems = require('../models/OrderItems');
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

  //   console.log(usersOrder.dataValues);
  console.log('Product Id', product.dataValues);
  console.log(usersOrder.dataValues.orderId);

  req.body = product.dataValues;
  req.body.orderId = usersOrder.dataValues.orderId;

  //   const orderItem = await OrderItems.create(req.body);

  //   if (!orderItem) {
  //     return next(new ErrorResponse('Order was not created', 400));
  //   }

  res.status(200).json({ success: true, data: req.body });
  //   res.status(200).json({ success: true, data: orderItem });
});
