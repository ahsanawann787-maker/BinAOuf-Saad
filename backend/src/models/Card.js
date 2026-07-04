import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

const cardSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    productId: { type: Number, required: true, unique: true, index: true, ref: 'Product' },
    visible: { type: Boolean, default: true },
  },
  baseOpts
);

export const Card = mongoose.model('Card', cardSchema);
