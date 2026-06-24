import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    cat: { type: String, required: true, index: true }, // category slug
    name: { type: String, required: true, trim: true },
    desc: { type: String, default: '' },
    tags: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
    img: { type: String, default: '' }, // absolute URL or base64 data-URI
    // Flexible per-category spec columns (art#, weight, size, packing, custom...).
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  baseOpts
);

productSchema.index({ name: 'text', desc: 'text', tags: 'text' });

export const Product = mongoose.model('Product', productSchema);
