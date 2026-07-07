import { z } from 'zod';

const str = (max = 2000) => z.string().trim().max(max);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(200),
});

// Public contact form → inquiry. Mirrors the website's submitForm() fields.
export const inquiryPublicSchema = z.object({
  name: str(120),
  email: z.string().trim().toLowerCase().email().or(z.literal('')).optional(),
  company: str(160).optional().default(''),
  phone: str(60).optional().default(''),
  country: str(120),
  product: str(160).optional().default(''),
  orderType: str(80).optional().default(''),
  qty: str(120).optional().default(''),
  market: str(160).optional().default(''),
  message: str(5000),
});

export const categorySchema = z.object({
  id: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, 'slug: a-z, 0-9, dashes only'),
  name: str(120),
  emoji: str(16).optional(),
  desc: str(500).optional(),
  order: z.number().int().optional(),
});
export const categoryUpdateSchema = categorySchema.partial().omit({ id: true });

const specs = z.record(z.string(), z.any()).optional();
export const productSchema = z.object({
  cat: str(60),
  name: str(200),
  desc: str(2000).optional().default(''),
  tags: str(300).optional().default(''),
  status: z.enum(['Active', 'Draft']).optional().default('Active'),
  img: str(2_000_000).optional().default(''), // allow base64 data-URIs
  specs,
});
export const productUpdateSchema = productSchema.partial();

export const homeCatSchema = z.object({
  title: str(160),
  desc: str(500).optional().default(''),
  link: str(60).optional().default(''),
  emoji: str(16).optional(),
  img: str(2_000_000).optional().default(''),
  order: z.number().int().optional(),
});
export const homeCatUpdateSchema = homeCatSchema.partial();

export const certSchema = z.object({
  title: str(160),
  desc: str(800).optional().default(''),
  emoji: str(16).optional(),
  img: str(2_000_000).optional().default(''),
  order: z.number().int().optional(),
});
export const certUpdateSchema = certSchema.partial();

const orderStatus = z.enum(['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled']);
export const orderSchema = z.object({
  cust: str(160),
  cc: str(8).optional(),
  country: str(80).optional(),
  prod: str(160).optional(),
  qty: str(80).optional(),
  amt: str(40).optional(),
  status: orderStatus.optional().default('pending'),
  date: str(40).optional(),
});
export const orderUpdateSchema = orderSchema.partial();

export const customerSchema = z.object({
  name: str(160),
  cc: str(8).optional(),
  type: str(80).optional(),
  country: str(80).optional(),
  email: z.string().trim().toLowerCase().email().or(z.literal('')).optional(),
  orders: z.number().int().optional(),
  spent: str(40).optional(),
  since: str(20).optional(),
});
export const customerUpdateSchema = customerSchema.partial();

export const inquiryUpdateSchema = z.object({
  read: z.boolean().optional(),
  archived: z.boolean().optional(),
  subj: str(200).optional(),
});

export const columnsSchema = z.object({
  columns: z
    .array(z.object({ key: str(40), label: str(80) }))
    .max(20),
});

export const settingsSchema = z.record(z.string(), z.any());

export const cardSchema = z.object({
  productId: z.number().int(),
  visible: z.boolean().optional().default(true),
});
export const cardUpdateSchema = cardSchema.partial();

export const faqSchema = z.object({
  question: str(1000),
  answer: str(5000),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});
export const faqUpdateSchema = faqSchema.partial();

export const blogSchema = z.object({
  title: str(300),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, 'slug: a-z, 0-9, dashes only').optional(),
  excerpt: str(1000).optional().default(''),
  content: z.string().trim(),
  featuredImage: z.string().trim().optional().default(''),
  category: str(100),
  tags: str(300).optional().default(''),
  metaTitle: str(200).optional().default(''),
  metaDescription: str(500).optional().default(''),
  isPublished: z.boolean().optional().default(true),
});
export const blogUpdateSchema = blogSchema.partial();

