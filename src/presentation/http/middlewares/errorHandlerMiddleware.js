const DomainException = require('../../../domain/exceptions/DomainException');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  if (err instanceof DomainException) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errors: err.errors || undefined,
    });
  }
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return res.status(404).json({
      success: false,
      error: message,
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return res.status(409).json({
      success: false,
      error: message,
    });
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors,
    });
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};
module.exports = errorHandler;
