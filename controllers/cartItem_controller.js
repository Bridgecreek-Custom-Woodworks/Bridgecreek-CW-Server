const CartItem = require('../models/CartItem');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all items
// @route GET /api/v1/cartItems
// access Private/Guest
exports.getAllCartItems = asyncHandler(async (req, res, next) => {
  const cartItems = await CartItem.findAll();

  const count = CartItem.count();

  res.status(200).json({ success: true, count: count, data: cartItems });
});

// @desc Get single product
// @route GET /api/v1/cartItems/:cartItemId
// access Private/Guest
exports.getSingleCartItem = asyncHandler(async (req, res, next) => {
  const cartItem = await CartItem.findOne({
    where: { cartItemId: req.params.cartItemId },
  });

  if (!cartItem) {
    return next(new ErrorResponse('This item is not longer in your cart', 404));
  }

  res.status(200).json({ success: true, data: cartItem });
});

// @desc Create cartItem
// @route POST /api/v1/cartItems/:productId
// access Private/Guest
exports.createCartItem = asyncHandler(async (req, res, next) => {
  req.body.productId = req.params.productId;
  req.body.cartId = '2ee6c6f6-3445-4985-821c-e65ba478ad71';

  const cartItem = await CartItem.create(req.body);

  if (!cartItem) {
    return next(new ErrorResponse('This item was not added to your cart', 400));
  }

  res.status(201).json({ success: true, data: cartItem });
});
