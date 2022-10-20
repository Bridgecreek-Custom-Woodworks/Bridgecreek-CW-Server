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
  const guest = req.user;

  if (!guest) {
    return next(new ErrorResponse('Guest was not found', 404));
  }
  res.status(200).json({ success: true, data: guest });
});

// @desc Create guest
// @route POST /api/v1/guests
// access Private/Guest
exports.createGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guests.build(req.body);
  const password = await guest.saltAndHashPassword();
  const { guestId } = guest.dataValues;

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

  await cartOrderAccess.save();

  try {
    await guest.save();
  } catch (error) {
    await cartOrderAccess.destroy();
    return next(new ErrorResponse('Unable to create guest user', 400));
  }

  sendTokenResponse(guest, 201, res);
});

// @desc Update guest
// @route PUT /api/v1/guests/update/:guestId
// access Private/Guest
exports.updateGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guests.update(req.body, {
    where: { guestId: req.params.guestId },
    returning: true,
  });

  if (guest[0] === 0 || guest[1].length === 0) {
    return next(
      new ErrorResponse(
        `Guest with id ${req.params.guestId} was not found`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: guest });
});

// @desc Delete guest
// @route DELETE /api/v1/guests/delete/:guestId
// access Private/Guest
exports.deleteGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guests.destroy({
    where: {
      guestId: req.params.guestId,
    },
  });

  if (!guest) {
    return next(
      new ErrorResponse(
        `Guest with id ${req.params.guestId} was not found`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: guest });
});
