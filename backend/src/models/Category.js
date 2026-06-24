import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

// `id` is a human slug ('edible', 'animal', ...) referenced by products & homecats.
const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    emoji: { type: String, default: '📦' },
    desc: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  baseOpts
);

export const Category = mongoose.model('Category', categorySchema);
