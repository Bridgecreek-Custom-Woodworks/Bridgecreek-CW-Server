const CartItem = require('../models/CartItem');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

exports.getAllCartItems = asyncHandler(async (req, res, next) => {
  const cartItems = await CartItem.findAll();

  const count = CartItem.count();

  res.status(200).json({ success: true, count: count, data: cartItems });
});
