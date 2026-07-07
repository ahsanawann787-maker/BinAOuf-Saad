import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

const faqSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    displayOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  baseOpts
);

export const FAQ = mongoose.model('FAQ', faqSchema);
