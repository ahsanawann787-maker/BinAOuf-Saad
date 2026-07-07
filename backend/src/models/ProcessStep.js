import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

const processStepSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    n: { type: String, required: true, trim: true }, // e.g. "01"
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: '', trim: true },
    list: { type: [String], default: [] },
    grad: { type: String, default: 'd4876b,5c2318', trim: true },
    img: { type: String, default: '', trim: true }, // base64 or file URL
    fit: { type: String, default: 'cover', trim: true } // "cover" or "contain"
  },
  baseOpts
);

export const ProcessStep = mongoose.model('ProcessStep', processStepSchema);
