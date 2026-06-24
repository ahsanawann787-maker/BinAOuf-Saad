import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // sequence name, e.g. "product"
  value: { type: Number, default: 0 },
});

export const Counter = mongoose.model('Counter', counterSchema);
