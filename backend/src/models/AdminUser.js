import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { baseOpts } from './_base.js';

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, default: 'admin' },
    lastLoginAt: { type: Date },
  },
  baseOpts
);

adminUserSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

adminUserSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 12);
};

// Never leak the hash even if select() is overridden.
adminUserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
