import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Replace an entire collection with the supplied array (idempotent).
 * Matches the admin panel's "mutate array locally, then persist the whole
 * collection" model. Upserts every item by its `id`, deletes the rest.
 * No wipe window — safe even if a write fails midway.
 */
export function bulkReplace(Model) {
  return asyncHandler(async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    if (!Array.isArray(items)) {
      throw ApiError.badRequest('Expected an array (or { items: [...] })');
    }
    const missing = items.findIndex((i) => i == null || i.id == null);
    if (missing !== -1) throw ApiError.badRequest(`Item at index ${missing} is missing an "id"`);

    const ids = items.map((i) => i.id);
    if (items.length) {
      await Model.bulkWrite(
        items.map((i) => ({
          updateOne: { filter: { id: i.id }, update: { $set: i }, upsert: true },
        })),
        { ordered: false }
      );
    }
    await Model.deleteMany({ id: { $nin: ids } });
    const data = await Model.find().lean({ virtuals: true });
    res.json({ ok: true, count: data.length, data });
  });
}

// Replace the whole per-category columns map: { catId: [ {key,label}, ... ] }
export function bulkColumns(ProductColumns) {
  return asyncHandler(async (req, res) => {
    const map = req.body?.map && typeof req.body.map === 'object' ? req.body.map : req.body;
    if (!map || typeof map !== 'object' || Array.isArray(map)) {
      throw ApiError.badRequest('Expected a { catId: columns[] } map');
    }
    const catIds = Object.keys(map);
    await Promise.all(
      catIds.map((catId) =>
        ProductColumns.updateOne(
          { catId },
          { $set: { columns: Array.isArray(map[catId]) ? map[catId] : [] } },
          { upsert: true }
        )
      )
    );
    await ProductColumns.deleteMany({ catId: { $nin: catIds } });
    const docs = await ProductColumns.find().lean();
    const out = {};
    for (const d of docs) out[d.catId] = d.columns;
    res.json({ ok: true, data: out });
  });
}
