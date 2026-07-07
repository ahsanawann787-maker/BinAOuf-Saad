import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { inquiryPublicSchema } from '../validators/schemas.js';
import { Product } from '../models/Product.js';
import { Card } from '../models/Card.js';
import { Category } from '../models/Category.js';
import { HomeCat } from '../models/HomeCat.js';
import { Cert } from '../models/Cert.js';
import { FAQ } from '../models/FAQ.js';
import { Blog } from '../models/Blog.js';
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

// FAQs list (active only)
r.get('/faqs', asyncHandler(async (_req, res) => {
  const data = await FAQ.find({ isActive: true }).sort({ displayOrder: 1, id: 1 }).lean({ virtuals: true });
  res.json({ ok: true, count: data.length, data });
}));

// Blogs list (published only)
r.get('/blogs', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const count = await Blog.countDocuments({ isPublished: true });
  const data = await Blog.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean({ virtuals: true });

  res.json({
    ok: true,
    count: data.length,
    total: count,
    page,
    pages: Math.ceil(count / limit),
    data
  });
}));

// Single blog details by slug
r.get('/blogs/:slug', asyncHandler(async (req, res) => {
  const data = await Blog.findOne({ slug: req.params.slug, isPublished: true }).lean({ virtuals: true });
  if (!data) return res.status(404).json({ ok: false, error: 'Blog not found' });
  res.json({ ok: true, data });
}));

// Contact form submission.
r.post('/inquiries', validate(inquiryPublicSchema), submitInquiry);

export default r;
