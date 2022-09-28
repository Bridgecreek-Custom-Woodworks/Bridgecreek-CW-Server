const Cart = require('../models/Cart');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

exports.createCart = asyncHandler(async (req, res, next) => {
  req.body.userId = '1024cf0f-9c88-4af3-8eb3-928a0a0b844e';
  const cart = await Cart.create(req.body);

  res.status(201).json({ success: true, data: cart });
});
