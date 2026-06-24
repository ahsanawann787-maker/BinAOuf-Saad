import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

// "Our Credentials" certifications block.
const certSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    emoji: { type: String, default: '🏅' },
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: '' },
    img: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  baseOpts
);

export const Cert = mongoose.model('Cert', certSchema);
