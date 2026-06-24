import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details;

  // Mongoose / driver friendly mapping
  if (err.name === 'ValidationError') {
    status = 400;
    details = Object.values(err.errors).map((e) => e.message);
    message = 'Validation failed';
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for "${err.path}"`;
  } else if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for ${Object.keys(err.keyValue || {}).join(', ')}`;
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    status = 400;
    message = 'File too large';
  }

  if (status >= 500 && !env.isProd) console.error(err);

  res.status(status).json({
    ok: false,
    error: message,
    ...(details ? { details } : {}),
  });
}
