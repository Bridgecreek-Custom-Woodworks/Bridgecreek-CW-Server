const Admins = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');
const { verifyPassword } = require('../utils/functions');

// @desc Get all admin users
// @route GET /api/v1/
