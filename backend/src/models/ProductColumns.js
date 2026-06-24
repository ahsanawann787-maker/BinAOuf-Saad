import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

// One document per category — defines that category's editable product table columns.
const columnSchema = new mongoose.Schema(
  { key: { type: String, required: true }, label: { type: String, required: true } },
  { _id: false }
);

const productColumnsSchema = new mongoose.Schema(
  {
    catId: { type: String, required: true, unique: true, index: true },
    columns: { type: [columnSchema], default: [] },
  },
  baseOpts
);

export const ProductColumns = mongoose.model('ProductColumns', productColumnsSchema);
