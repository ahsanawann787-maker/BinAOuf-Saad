import { asyncHandler } from '../utils/asyncHandler.js';
import { Settings } from '../models/Settings.js';

const KEY = 'site';

async function getDoc() {
  let doc = await Settings.findOne({ key: KEY });
  if (!doc) doc = await Settings.create({ key: KEY });
  return doc;
}

// ADMIN — full settings object.
export const getSettings = asyncHandler(async (_req, res) => {
  const doc = await getDoc();
  res.json({ ok: true, data: doc });
});

// ADMIN — upsert any subset of fields (mirrors admin's save-all behaviour).
export const updateSettings = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  delete payload.key;
  delete payload.id;
  const doc = await Settings.findOneAndUpdate(
    { key: KEY },
    { $set: payload },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json({ ok: true, data: doc });
});

// PUBLIC — only website-safe fields.
export const getPublicSettings = asyncHandler(async (_req, res) => {
  const doc = await getDoc();
  const json = doc.toJSON();
  const out = {};
  for (const f of Settings.PUBLIC_FIELDS) if (json[f] !== undefined) out[f] = json[f];
  res.json({ ok: true, data: out });
});
