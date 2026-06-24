import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function signToken(user) {
  return jwt.sign(
    { sub: String(user.id || user._id), email: user.email, role: user.role || 'admin' },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

// Requires a valid Bearer token. Attaches req.user.
export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(ApiError.unauthorized('Missing auth token'));
  try {
    req.user = jwt.verify(token, env.jwt.secret);
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
