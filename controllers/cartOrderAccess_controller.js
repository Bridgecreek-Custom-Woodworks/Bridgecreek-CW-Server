const CartOrderAccess = require('../models/CartOrderAccess');
const Guests = require('../models/Guests');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');

// @desc Get all cartOrderAccess
// @route GET /api/v1/cartorderaccess/admin/allcartOrderAccess
// access Private/Admin
exports.getAllCartOrderAccess = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch);
});

// @desc Get a single cartOrderAccess
// @route GET /api/v1/cartorderaccess/getme
// access Private/Admin
exports.getMyCartOrderAccess = asyncHandler(async (req, res, next) => {
  const cartOrderAccess = req.user;

  res.status(200).json({ success: true, data: cartOrderAccess });
});

// @desc Create cartOrderAccess
// @route POST /api/v1/cartorderaccess
// access Private/Admin
exports.createCartOrderAccess = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, adminId } = req.user.dataValues;

  const guest = await Guests.build();
  const { guestId } = guest.dataValues;

  const password = await guest.saltAndHashPassword();

  let guestName = guestId.split('-');
  guestName = guestName[4];
  guestName = `Guest ${guestName}`;

  let customer = {
    userName: guestName,
    customerId: guestId,
  };

  const cartOrderAccess = await CartOrderAccess.build(customer);

  guest.guestName = guestName;
  guest.password = password;
  guest.cartOrderAccessId = cartOrderAccess.cartOrderAccessId;
  guest.activeStatus = 'active';
  guest.createdBy = `${firstName} ${lastName} Id: ${adminId}`;

  await cartOrderAccess.save();

  try {
    await guest.save();
  } catch (error) {
    await cartOrderAccess.destroy();
    return next(new ErrorResponse('Unable to create guest user', 400));
  }

  sendTokenResponse(guest, 201, res);
});

// @desc Update cartOrderAccess
// @route PUT /api/v1/cartorderaccess/update/:cartOrderAccessId
// access Private/Admin
exports.updateCartOrderAccess = asyncHandler(async (req, res, next) => {
  let cartOrderAccess = await CartOrderAccess.update(req.body, {
    where: { cartOrderAccessId: req.params.cartOrderAccessId },
    returning: true,
  });

  let updatedCartOrderAccess = cartOrderAccess.flat(Infinity);
  cartOrderAccess = updatedCartOrderAccess[1].dataValues;

  res.status(200).json({ success: true, data: cartOrderAccess });
});

// @desc Update cartOrderAccess
// @route DELETE /api/v1/cartorderaccess/delete/:cartOrderAccessId
// access Private/Admin
exports.deleteCartOrderAccess = asyncHandler(async (req, res, next) => {
  const cartOrderAccess = await CartOrderAccess.destroy({
    where: { cartOrderAccessId: req.params.cartOrderAccessId },
  });

  if (!cartOrderAccess) {
    return next(
      new ErrorResponse(
        `Cart Order Access with id of ${req.params.cartOrderAccessId} was not found`
      )
    );
  }

  res.status(200).json({ success: true, data: cartOrderAccess });
});
