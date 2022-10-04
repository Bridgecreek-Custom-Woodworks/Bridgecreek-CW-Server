const CartItem = require('../models/CartItem');
const Carts = require('../models/Cart');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all items
// @route GET /api/v1/admin/allcartitems
// access Private/Admin
exports.getAllCartItems = asyncHandler(async (req, res, next) => {
  if (
    Object.keys(req.query).length > 0 ||
    !Object.keys(req.query).length === 0
  ) {
    return res.status(200).json(res.advancedQuerySearch);
  }

  const cartItems = await CartItem.findAll();

  const count = cartItems.length;

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
    return next(new ErrorResponse('The item is not longer in your cart', 404));
  }

  res.status(200).json({ success: true, data: cartItem });
});

// @desc Create cartItem
// @route POST /api/v1/cartItems/:productId
// access Private/Guest
exports.createCartItem = asyncHandler(async (req, res, next) => {
  req.body.productId = req.params.productId;
  req.body.userId = req.user.userId;

  if (req.user.Cart === null) {
    let cart = await Carts.create(req.body);
    req.body.cartId = cart.dataValues.cartId;
  } else {
    req.body.cartId = req.user.Cart.dataValues.cartId;
  }

  const cartItem = await CartItem.create(req.body);

  if (!cartItem) {
    return next(new ErrorResponse('This item was not added to your cart', 400));
  }

  res.status(201).json({ success: true, data: cartItem });
});

// @desc Update cartItem
// @route PUT /api/v1/cartitems/update/:cartItemId
// access Private/Guest
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const cartItem = await CartItem.update(req.body, {
    where: { cartItemId: req.params.cartItemId },
    returning: true,
    individualHooks: true,
  });

  if (!cartItem) {
    return next(
      new ErrorResponse(
        `This cart item with the id of ${req.params.cartItemId} was now found`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: cartItem });
});

// @desc Delete cartItem
// @route DELETE /api/v1/cartItems/delete/:cartItemId
// access Private/Guest
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const cartItem = await CartItem.destroy({
    where: { cartItemId: req.params.cartItemId },
    individualHooks: true,
  });

  if (!cartItem) {
    return next(
      new ErrorResponse(
        `This cart item with the id of ${req.params.cartItemId} has already been deleted`,
        400
      )
    );
  }

  res.status(200).json({ success: true, data: cartItem });
});
