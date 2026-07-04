import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { inquiryPublicSchema } from '../validators/schemas.js';
import { Product } from '../models/Product.js';
import { Card } from '../models/Card.js';
import { Category } from '../models/Category.js';
import { HomeCat } from '../models/HomeCat.js';
import { Cert } from '../models/Cert.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { submitInquiry } from '../controllers/inquiry.controller.js';
import { getPublicSettings } from '../controllers/settings.controller.js';

const r = Router();

// Active products only; optional ?cat=slug filter.
r.get('/products', asyncHandler(async (req, res) => {
  const cards = await Card.find({ visible: true }).lean();
  const cardProductIds = new Set(cards.map(c => c.productId));

  const filter = { status: 'Active' };
  if (req.query.cat) filter.cat = String(req.query.cat);
  const products = await Product.find(filter).sort({ id: 1 }).lean({ virtuals: true });
  
  const data = products.map(p => ({
    ...p,
    showInCard: cardProductIds.has(p.id)
  }));
  
  res.json({ ok: true, count: data.length, data });
}));


r.get('/products/:id', asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  const card = await Card.findOne({ productId, visible: true });
  if (!card) return res.status(404).json({ ok: false, error: 'Not found' });

  const data = await Product.findOne({ id: productId, status: 'Active' }).lean({ virtuals: true });
  if (!data) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, data });
}));

r.get('/categories', asyncHandler(async (_req, res) => {
  const data = await Category.find().sort({ order: 1, name: 1 }).lean({ virtuals: true });
  res.json({ ok: true, count: data.length, data });
}));

r.get('/home-categories', asyncHandler(async (_req, res) => {
  const data = await HomeCat.find().sort({ order: 1, id: 1 }).lean({ virtuals: true });
  res.json({ ok: true, count: data.length, data });
}));

r.get('/certifications', asyncHandler(async (_req, res) => {
  const data = await Cert.find().sort({ order: 1, id: 1 }).lean({ virtuals: true });
  res.json({ ok: true, count: data.length, data });
}));

r.get('/settings', getPublicSettings);

// Contact form submission.
r.post('/inquiries', validate(inquiryPublicSchema), submitInquiry);

export default r;
