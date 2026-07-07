// Wires each resource to the CRUD factory with its id-generation strategy.
import { crudController } from './crudFactory.js';
import { nextSeq } from '../utils/counter.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { HomeCat } from '../models/HomeCat.js';
import { Cert } from '../models/Cert.js';
import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';
import { Card } from '../models/Card.js';
import { FAQ } from '../models/FAQ.js';
import { Blog } from '../models/Blog.js';
import { ProcessStep } from '../models/ProcessStep.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const AVA = ['C9A84C', 'B65C3A', 'D98E73', '3D6FA8', '9A4A2C', '3F8F5F', 'C0432F', 'C19A4B'];
const randCc = () => AVA[Math.floor(Math.random() * AVA.length)];

export const productCtrl = crudController({
  Model: Product,
  genId: () => nextSeq('product'),
  defaultSort: { id: 1 },
  transform: (body) => {
    if (body.specs && typeof body.specs !== 'object') body.specs = {};
    return body;
  },
});

export const categoryCtrl = crudController({
  Model: Category,
  idIsNumber: false,
  genId: (body) => body.id, // slug supplied by client
  defaultSort: { order: 1, name: 1 },
});

export const homeCatCtrl = crudController({
  Model: HomeCat,
  genId: () => nextSeq('homecat'),
  defaultSort: { order: 1, id: 1 },
});

export const certCtrl = crudController({
  Model: Cert,
  genId: () => nextSeq('cert'),
  defaultSort: { order: 1, id: 1 },
});

export const orderCtrl = crudController({
  Model: Order,
  idIsNumber: false,
  genId: async () => `BA-${await nextSeq('order')}`,
  defaultSort: { createdAt: -1 },
  transform: (body) => {
    if (!body.cc) body.cc = randCc();
    if (!body.date) body.date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return body;
  },
});

export const customerCtrl = crudController({
  Model: Customer,
  genId: () => nextSeq('customer'),
  defaultSort: { id: 1 },
  transform: (body) => {
    if (!body.cc) body.cc = randCc();
    return body;
  },
});

export const cardCtrl = {
  ...crudController({
    Model: Card,
    genId: () => nextSeq('card'),
    defaultSort: { id: 1 },
  }),
  list: asyncHandler(async (req, res) => {
    const cards = await Card.find().sort({ id: 1 }).lean({ virtuals: true });
    const productIds = cards.map(c => c.productId);
    const products = await Product.find({ id: { $in: productIds } }).lean();
    const productsMap = new Map(products.map(p => [p.id, p]));
    const data = cards.map(c => ({
      ...c,
      product: productsMap.get(c.productId) || null
    }));
    res.json({ ok: true, count: data.length, data });
  }),
  getOne: asyncHandler(async (req, res) => {
    const card = await Card.findOne({ id: Number(req.params.id) }).lean({ virtuals: true });
    if (!card) throw ApiError.notFound();
    const product = await Product.findOne({ id: card.productId }).lean();
    res.json({ ok: true, data: { ...card, product } });
  }),
};

/**
 * POST /admin/products/:id/publish-card
 * Creates a card for the product (or makes visible if one already exists).
 * The product itself is never touched.
 */
export const publishCard = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  const product = await Product.findOne({ id: productId }).lean();
  if (!product) throw ApiError.notFound('Product not found');

  let card = await Card.findOne({ productId });
  if (card) {
    // Already exists — just make it visible
    card = await Card.findOneAndUpdate(
      { productId },
      { $set: { visible: true } },
      { new: true }
    );
  } else {
    // Create a fresh card
    const cardId = await nextSeq('card');
    card = await Card.create({ id: cardId, productId, visible: true });
  }
  res.json({ ok: true, data: card });
});

/**
 * DELETE /admin/products/:id/publish-card
 * Removes the card linked to this product.
 * The product itself remains untouched in the Products collection.
 */
export const unpublishCard = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  const card = await Card.findOneAndDelete({ productId });
  // No error if card doesn't exist — idempotent
  res.json({ ok: true, data: { productId, cardDeleted: !!card } });
});

export const faqCtrl = crudController({
  Model: FAQ,
  genId: () => nextSeq('faq'),
  defaultSort: { displayOrder: 1, id: 1 },
});

export const blogCtrl = crudController({
  Model: Blog,
  genId: () => nextSeq('blog'),
  defaultSort: { createdAt: -1 },
  transform: (body) => {
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    return body;
  },
});

export const processStepCtrl = crudController({
  Model: ProcessStep,
  genId: () => nextSeq('processstep'),
  defaultSort: { id: 1 },
});

