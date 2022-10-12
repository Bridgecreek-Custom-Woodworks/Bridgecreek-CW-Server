const Cart = require('../models/Cart');
const User = require('../models/User');
const Products = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { Op } = require('sequelize');

// @desc Get all carts
// @route GET /api/v1/admin/allcarts
// access Private/Admin
exports.getAllCarts = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }
  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get a single cart
// @route GET /api/v1/carts/mycart
// access Private/Guest
exports.getMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findAll({
    where: {
      [Op.and]: [
        { userId: req.user.userId },
        { cartStatus: ['New', 'Checkout'] },
      ],
    },
    include: [
      {
        model: User,
        required: true,
      },
      {
        model: Products,
        through: {
          attributes: [
            'productId',
            'cartItemId',
            'quantity',
            'updatedAt',
            'createdAt',
          ],
        },
        required: true,
      },
    ],
  });

  if (!cart || cart.length === 0) {
    return next(new ErrorResponse(`Your cart is currently empty`, 404));
  }

  res.status(200).json({ success: true, data: cart });
});

// @desc Create cart
// @route POST /api/v1/carts
// access Private/Guest
// THIS ROUTE MAT NOT BE NECESSARY AS THE CART IS CREATED AT THE TIME THE CUSTOMER ADDS A PRODUCT.
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
// @route POST /api/v1/carts/mycart/update/:cartId
// access Private/Guest
exports.updateMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.update(req.body, {
    where: {
      cartId: req.params.cartId,
    },
    returning: true,
  });

  if (!cart) {
    return next(
      new ErrorResponse(
        `There is not cart found with the id of ${req.params.cartId}`
      )
    );
  }

  res.status(200).json({ success: true, data: cart });
});

// @desc Delete cart
// @route DELETE /api/v1/admin/deletecart/:cartId
// access Private/Admin
exports.deleteCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({
    where: { cartId: req.params.cartId },
  });

  if (!cart) {
    return next(
      new ErrorResponse(
        `The cart with the id of ${req.params.cartId} has already been removed`,
        404
      )
    );
  }

  await cart.removeCartItems(req.params.cartId);

  cart.destroy();

  res.status(200).json({
    success: true,
    data: cart,
    msg: `Cart with the id ${req.params.cartId} was deleted`,
  });
});
