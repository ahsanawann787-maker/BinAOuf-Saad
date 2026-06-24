import { asyncHandler } from '../utils/asyncHandler.js';
import { ProductColumns } from '../models/ProductColumns.js';

const DEFAULT_COLS = [
  { key: 'art', label: 'Art#' },
  { key: 'weight', label: 'Weight (kg)' },
  { key: 'size', label: 'Size (cm)' },
  { key: 'packing', label: 'Packing' },
];

// Returns a { catId: [columns] } map (admin consumes COLS keyed by category).
export const getAllColumns = asyncHandler(async (_req, res) => {
  const docs = await ProductColumns.find().lean();
  const map = {};
  for (const d of docs) map[d.catId] = d.columns;
  res.json({ ok: true, data: map });
});

export const getColumns = asyncHandler(async (req, res) => {
  const doc = await ProductColumns.findOne({ catId: req.params.catId });
  res.json({ ok: true, data: doc ? doc.columns : DEFAULT_COLS });
});

export const setColumns = asyncHandler(async (req, res) => {
  const doc = await ProductColumns.findOneAndUpdate(
    { catId: req.params.catId },
    { $set: { columns: req.body.columns } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json({ ok: true, data: doc.columns });
});
