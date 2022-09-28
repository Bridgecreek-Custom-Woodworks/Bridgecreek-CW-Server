const Cart = require('../models/Cart');
const User = require('../models/User');
const Products = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all carts
// @route GET /api/v1/carts/admin/allcarts
// access Private/Admin
exports.getAllCarts = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findAll({
    include: [
      {
        model: User,
      },
      {
        model: Products,
        through: {
          attributes: [
            'cartItemId',
            'quantity',
            'discount',
            'updatedAt',
            'createdAt',
          ],
        },
      },
    ],
  });

  const count = await Cart.count();

  res.status(200).json({ success: true, count: count, data: cart });
});

// @desc Get a single cart
// @route GET /api/v1/carts/mycart
// access Private/Guest
exports.getMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findAll({
    where: { userId: req.user.userId }, // <== Might need to add Op and cart status ***
    include: [
      {
        model: User,
        required: true,
      },
      {
        model: Products,
        through: {
          attributes: [
            'cartItemId',
            'quantity',
            'discount',
            'updatedAt',
            'createdAt',
          ],
        },
        required: true,
      },
    ],
  });

  const count = await Cart.count();

  res.status(200).json({ success: true, count: count, data: cart });
});

// @desc Create cart
// @route POST /api/v1/carts
// access Private/Guest
exports.createCart = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.userId;
  const cart = await Cart.create(req.body);

  if (!cart) {
    return next(
      new ErrorResponse(
        `Cart was not created. Please log in or select continue as guest`
      )
    );
  }

  res.status(201).json({ success: true, data: cart });
});

// @desc Update cart
// @route POST /api/v1/carts/mycart/:cartId
// access Private/Guest
exports.updateMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findAll({
    where: { cartId: req.params.cartId },
  });

  const count = await Cart.count();

  res.status(200).json({ success: true, count: count, data: cart });
});
