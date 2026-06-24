import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { AdminUser } from '../models/AdminUser.js';
import { signToken } from '../middleware/auth.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.verifyPassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  user.lastLoginAt = new Date();
  await user.save();
  const token = signToken(user);
  res.json({ ok: true, data: { token, user: user.toJSON() } });
});

export const me = asyncHandler(async (req, res) => {
  const user = await AdminUser.findById(req.user.sub);
  if (!user) throw ApiError.unauthorized();
  res.json({ ok: true, data: user });
});
