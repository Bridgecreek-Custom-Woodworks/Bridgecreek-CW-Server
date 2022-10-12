const ErrorResponse = require('./errorResponse');

// FUNCTION CHECKS Minimum 8 and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
exports.verifyPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/g;
  return (verify = password.match(regex));
};

exports.matchUserIdToModelsUserId = (reqUserId, modelsUserId) => {
  if (!reqUserId === modelsUserId) {
    return next(new ErrorResponse('User not authorized', 400));
  }
};
