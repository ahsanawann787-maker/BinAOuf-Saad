import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

// `id` is the human order code, e.g. "BA-1042".
const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    cust: { type: String, required: true },
    cc: { type: String, default: '' }, // avatar color hex
    country: { type: String, default: '' },
    prod: { type: String, default: '' },
    qty: { type: String, default: '' },
    amt: { type: String, default: '' }, // kept as display string ("$4,900") to match admin
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    date: { type: String, default: '' }, // display date ("Jun 21")
  },
  baseOpts
);

export const Order = mongoose.model('Order', orderSchema);
