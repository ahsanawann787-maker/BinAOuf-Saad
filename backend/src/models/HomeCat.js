import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

// Curated category cards shown on the website home page.
const homeCatSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: '' },
    link: { type: String, default: '' }, // category slug to deep-link to
    emoji: { type: String, default: '📦' },
    img: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  baseOpts
);

export const HomeCat = mongoose.model('HomeCat', homeCatSchema);
