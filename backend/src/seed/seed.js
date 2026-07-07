import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { HomeCat } from '../models/HomeCat.js';
import { Cert } from '../models/Cert.js';
import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';
import { Inquiry } from '../models/Inquiry.js';
import { ProductColumns } from '../models/ProductColumns.js';
import { Settings } from '../models/Settings.js';
import { AdminUser } from '../models/AdminUser.js';
import { Card } from '../models/Card.js';
import { FAQ } from '../models/FAQ.js';
import { Blog } from '../models/Blog.js';
import { ProcessStep } from '../models/ProcessStep.js';
import { ensureCounter } from '../utils/counter.js';
import {
  SEED_CATS, SEED_PRODUCTS, SEED_HOMECATS, SEED_CERTS,
  SEED_ORDERS, SEED_CUSTOMERS, SEED_INQ, DEFAULT_COLS,
  SEED_FAQS, SEED_BLOGS, SEED_PROCESS_STEPS,
} from './data.js';

const FRESH = process.argv.includes('--fresh');

// Normalize products like the admin does: ensure specs{} fills its category's columns.
function normalizeProducts(products) {
  return products.map((p) => {
    const specs = { ...(p.specs || {}) };
    for (const col of DEFAULT_COLS) if (specs[col.key] == null) specs[col.key] = '—';
    return { ...p, specs, img: p.img || '' };
  });
}

async function upsertMany(Model, docs, key = 'id') {
  let inserted = 0, updated = 0;
  for (const d of docs) {
    const res = await Model.updateOne({ [key]: d[key] }, { $set: d }, { upsert: true });
    if (res.upsertedCount) inserted++; else if (res.modifiedCount) updated++;
  }
  return { inserted, updated, total: docs.length };
}

async function run() {
  await connectDB();
  console.log(`\n🌱 Seeding Bin Aouf database${FRESH ? ' (FRESH — wiping content collections)' : ''}…\n`);

  if (FRESH) {
    await Promise.all([
      Category.deleteMany({}), Product.deleteMany({}), Card.deleteMany({}), HomeCat.deleteMany({}),
      Cert.deleteMany({}), Order.deleteMany({}), Customer.deleteMany({}),
      Inquiry.deleteMany({}), ProductColumns.deleteMany({}),
      FAQ.deleteMany({}), Blog.deleteMany({}), ProcessStep.deleteMany({}),
    ]);
    console.log('   ✔ content collections cleared');
  }

  const cats = await upsertMany(Category, SEED_CATS);
  const prods = await upsertMany(Product, normalizeProducts(SEED_PRODUCTS));
  const home = await upsertMany(HomeCat, SEED_HOMECATS);
  const certs = await upsertMany(Cert, SEED_CERTS);
  const orders = await upsertMany(Order, SEED_ORDERS);
  const custs = await upsertMany(Customer, SEED_CUSTOMERS);
  const inq = await upsertMany(Inquiry, SEED_INQ);
  const faqs = await upsertMany(FAQ, SEED_FAQS);
  const blogs = await upsertMany(Blog, SEED_BLOGS);
  const steps = await upsertMany(ProcessStep, SEED_PROCESS_STEPS);

  const cardsToInsert = SEED_PRODUCTS.map((p, idx) => ({
    id: idx + 1,
    productId: p.id,
    visible: true
  }));
  const cards = await upsertMany(Card, cardsToInsert);

  // Per-category default columns (one doc per category).
  for (const c of SEED_CATS) {
    await ProductColumns.updateOne(
      { catId: c.id },
      { $setOnInsert: { columns: DEFAULT_COLS } },
      { upsert: true }
    );
  }

  // Counters → max existing id so future creates never collide.
  const maxNum = (arr) => arr.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0);
  await ensureCounter('product', maxNum(SEED_PRODUCTS));
  await ensureCounter('homecat', maxNum(SEED_HOMECATS));
  await ensureCounter('cert', maxNum(SEED_CERTS));
  await ensureCounter('customer', maxNum(SEED_CUSTOMERS));
  await ensureCounter('inquiry', maxNum(SEED_INQ));
  await ensureCounter('card', maxNum(cardsToInsert));
  await ensureCounter('faq', maxNum(SEED_FAQS));
  await ensureCounter('blog', maxNum(SEED_BLOGS));
  await ensureCounter('processstep', maxNum(SEED_PROCESS_STEPS));
  const maxOrder = SEED_ORDERS.reduce((m, o) => Math.max(m, Number(String(o.id).replace('BA-', '')) || 0), 0);
  await ensureCounter('order', maxOrder);

  // Default site settings (only fills blanks; won't overwrite your edits).
  await Settings.updateOne(
    { key: 'site' },
    {
      $setOnInsert: {
        key: 'site',
        siteTitle: 'Bin Aouf — Premium Himalayan Salt Exporter',
        tagline: 'Premium Himalayan salt products exported worldwide.',
        metaDesc: 'Bin Aouf exports premium Himalayan salt — edible, lamps, bath & spa, tiles, and private label — worldwide from Khewra, Pakistan.',
        address: 'Khewra, Punjab, Pakistan',
        email: 'binaoufchemicals.pk@gmail.com',
        phone1: '+92 311 028 2668',
        phone2: '+92 325 151 2035',
        whatsapp: '+92 311 028 2668',
        adminName: env.admin.name,
        adminEmail: env.admin.email,
        notifyInquiries: true, notifyOrders: true,
      },
    },
    { upsert: true }
  );

  // Admin user — create or reset password to match .env.
  const passwordHash = await AdminUser.hashPassword(env.admin.password);
  await AdminUser.updateOne(
    { email: env.admin.email },
    { $set: { name: env.admin.name, passwordHash, role: 'admin' } },
    { upsert: true }
  );

  console.log('   ✔ categories      ', cats);
  console.log('   ✔ products        ', prods);
  console.log('   ✔ home-categories ', home);
  console.log('   ✔ certifications  ', certs);
  console.log('   ✔ orders          ', orders);
  console.log('   ✔ customers       ', custs);
  console.log('   ✔ inquiries       ', inq);
  console.log('   ✔ cards           ', cards);
  console.log('   ✔ faqs            ', faqs);
  console.log('   ✔ blogs           ', blogs);
  console.log('   ✔ process-steps   ', steps);
  console.log('   ✔ product-columns  seeded for', SEED_CATS.length, 'categories');
  console.log('   ✔ settings + admin user ready');
  console.log(`\n🔑 Admin login → ${env.admin.email} / (ADMIN_PASSWORD from .env)\n`);

  await disconnectDB();
  process.exit(0);
}

run().catch((err) => {
  console.error('✖ Seed failed:', err);
  process.exit(1);
});
