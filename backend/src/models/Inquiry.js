import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

// Created from the public website contact form; managed in the admin inbox.
const inquirySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    company: { type: String, default: '' },
    country: { type: String, default: '' },
    phone: { type: String, default: '' },
    subj: { type: String, default: 'New Inquiry' },
    msg: { type: String, required: true },
    cc: { type: String, default: '' },
    // Structured extras captured from the form (orderType, qty, market, product).
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  baseOpts
);

// Admin renders `i.time` — expose a relative string derived from createdAt.
inquirySchema.virtual('time').get(function () {
  const ts = this.createdAt ? new Date(this.createdAt).getTime() : Date.now();
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d} days ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
});

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
