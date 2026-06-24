import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Inquiry } from '../models/Inquiry.js';
import { nextSeq } from '../utils/counter.js';

const AVA = ['C9A84C', 'B65C3A', 'D98E73', '3D6FA8', '9A4A2C', '3F8F5F', 'C0432F'];

// PUBLIC — website contact form submits here.
export const submitInquiry = asyncHandler(async (req, res) => {
  const { name, email, company, phone, country, product, orderType, qty, market, message } = req.body;
  const subjBits = [product, orderType].filter(Boolean).join(' · ');
  const inq = await Inquiry.create({
    id: await nextSeq('inquiry'),
    name,
    email: email || '',
    company: company || '',
    country,
    phone: phone || '',
    subj: subjBits || 'New Inquiry',
    msg: message,
    cc: AVA[Math.floor(Math.random() * AVA.length)],
    meta: { product, orderType, qty, market },
    read: false,
    archived: false,
  });
  res.status(201).json({ ok: true, data: { id: inq.id }, message: 'Inquiry received' });
});

// ADMIN — list with optional ?archived=true / ?read=false filters.
export const listInquiries = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.archived !== undefined) filter.archived = req.query.archived === 'true';
  if (req.query.read !== undefined) filter.read = req.query.read === 'true';
  const docs = await Inquiry.find(filter).sort({ createdAt: -1 }).lean({ virtuals: true });
  res.json({ ok: true, count: docs.length, data: docs });
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const doc = await Inquiry.findOneAndUpdate(
    { id: Number(req.params.id) },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!doc) throw ApiError.notFound();
  res.json({ ok: true, data: doc });
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  const doc = await Inquiry.findOneAndDelete({ id: Number(req.params.id) });
  if (!doc) throw ApiError.notFound();
  res.json({ ok: true, data: { id: doc.id } });
});
