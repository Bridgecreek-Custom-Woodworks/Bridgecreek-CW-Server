const Guests = require('../models/Guests');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');

// @desc Get all guest
// @route GET /api/v1/admin/allguests
// access Private/Admin
exports.getAllGuest = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get a single guest
// @route GET /api/v1/guest/getme
// access Private/Guest
exports.getGuest = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch);
});
