const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  // console.log(err)
  let error = { ...err }
  error.message = err.message

  // Check for Sequelize bad Primary Key (Bad Format)
  if (err.name === 'SequelizeDatabaseError' && err.parent.code === '22P02') {
    const message = 'Resource not found'
    error = new ErrorResponse(message, 404)
  }

  // Check for Sequelize duplicate field value
  if (
    err.name === 'SequelizeUniqueConstraintError' &&
    err.parent.code === '23505'
  ) {
    let message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  // console.log(err.name)

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' })
}

module.exports = errorHandler
