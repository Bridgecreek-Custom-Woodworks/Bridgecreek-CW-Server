const Guests = require('../models/Guests');
const CartOrderAccess = require('../models/CartOrderAccess');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');

// @desc Get all guest
// @route GET /api/v1/admin/allguests
// access Private/Admin
exports.getAllGuest = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get a single guest
// @route GET /api/v1/guests/getme
// access Private/Guest
exports.getGuest = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: 'You got all the guests' });
  // res.status(200).json(res.advancedQuerySearch);
});

// @desc Create guest
// @route POST /api/v1/guests
// access Private/Guest
exports.createGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guests.build(req.body);
  const password = await guest.saltAndHashPassword();

  const { guestName, guestId } = guest.dataValues;
  let customer = {
    userName: guestName,
    customerId: guestId,
  };

  const cartOrderAccess = await CartOrderAccess.build(customer);

  guest.password = password;
  guest.cartOrderAccessId = cartOrderAccess.cartOrderAccessId;
  guest.activeStatus = 'active';

  await cartOrderAccess.save();

  try {
    await guest.save();
  } catch (error) {
    await cartOrderAccess.destroy();
    return next(new ErrorResponse('Unable to create guest user', 400));
  }

  sendTokenResponse(guest, 201, res);
});
