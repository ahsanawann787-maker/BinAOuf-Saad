import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

const customerSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    cc: { type: String, default: '' },
    type: { type: String, default: '' },
    country: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    orders: { type: Number, default: 0 },
    spent: { type: String, default: '$0' }, // display string to match admin
    since: { type: String, default: '' },
  },
  baseOpts
);

export const Customer = mongoose.model('Customer', customerSchema);
