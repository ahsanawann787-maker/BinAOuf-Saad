import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Card } from '../models/Card.js';
import { nextSeq } from '../utils/counter.js';

/**
 * Generic CRUD controller for resources keyed by a business `id`.
 *
 * @param {Object}   cfg
 * @param {Model}    cfg.Model        Mongoose model
 * @param {Function} cfg.genId        async () => business id for new docs
 * @param {Object}   [cfg.defaultSort]  e.g. { order: 1, id: 1 }
 * @param {Function} [cfg.transform]  (body, req) => body  (mutate before create/update)
 * @param {Function} [cfg.listFilter] (req) => mongo filter (e.g. public active-only)
 * @param {Boolean}  [cfg.idIsNumber] coerce :id param to Number (default true)
 */
export function crudController({
  Model,
  genId,
  defaultSort = { id: 1 },
  transform,
  listFilter,
  idIsNumber = true,
}) {
  const coerce = (raw) => (idIsNumber ? Number(raw) : raw);

  const list = asyncHandler(async (req, res) => {
    const filter = listFilter ? listFilter(req) : {};
    const docs = await Model.find(filter).sort(defaultSort).lean({ virtuals: true });
    res.json({ ok: true, count: docs.length, data: docs });
  });

  const getOne = asyncHandler(async (req, res) => {
    const doc = await Model.findOne({ id: coerce(req.params.id) });
    if (!doc) throw ApiError.notFound();
    res.json({ ok: true, data: doc });
  });

  const create = asyncHandler(async (req, res) => {
    let body = { ...req.body };
    if (transform) body = await transform(body, req);
    if (body.id == null) body.id = await genId(body);
    const doc = await Model.create(body);

    if (Model.modelName === 'Product') {
      const cardExists = await Card.findOne({ productId: doc.id });
      if (!cardExists) {
        const cardId = await nextSeq('card');
        await Card.create({ id: cardId, productId: doc.id, visible: true });
      }
    }

    res.status(201).json({ ok: true, data: doc });
  });

  const update = asyncHandler(async (req, res) => {
    let body = { ...req.body };
    if (transform) body = await transform(body, req);
    delete body.id; // id is immutable via update
    const doc = await Model.findOneAndUpdate(
      { id: coerce(req.params.id) },
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!doc) throw ApiError.notFound();
    res.json({ ok: true, data: doc });
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findOneAndDelete({ id: coerce(req.params.id) });
    if (!doc) throw ApiError.notFound();

    if (Model.modelName === 'Product') {
      await Card.deleteMany({ productId: doc.id });
    }

    res.json({ ok: true, data: { id: doc.id } });
  });

  return { list, getOne, create, update, remove };
}
