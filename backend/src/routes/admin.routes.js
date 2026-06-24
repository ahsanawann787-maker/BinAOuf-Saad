import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../utils/upload.js';
import {
  productSchema, productUpdateSchema,
  categorySchema, categoryUpdateSchema,
  homeCatSchema, homeCatUpdateSchema,
  certSchema, certUpdateSchema,
  orderSchema, orderUpdateSchema,
  customerSchema, customerUpdateSchema,
  inquiryUpdateSchema, columnsSchema, settingsSchema,
} from '../validators/schemas.js';
import {
  productCtrl, categoryCtrl, homeCatCtrl, certCtrl, orderCtrl, customerCtrl,
} from '../controllers/resources.js';
import { listInquiries, updateInquiry, deleteInquiry } from '../controllers/inquiry.controller.js';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { getAllColumns, getColumns, setColumns } from '../controllers/columns.controller.js';
import { getStats } from '../controllers/dashboard.controller.js';
import { uploadImage } from '../controllers/upload.controller.js';
import { bulkReplace, bulkColumns } from '../controllers/bulk.controller.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { HomeCat } from '../models/HomeCat.js';
import { Cert } from '../models/Cert.js';
import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';
import { Inquiry } from '../models/Inquiry.js';
import { ProductColumns } from '../models/ProductColumns.js';

const r = Router();
r.use(requireAuth); // everything below requires a valid admin token

// Helper to register a standard CRUD resource.
function resource(path, ctrl, createSchema, updateSchema, { idNum = true } = {}) {
  const idRe = idNum ? ':id(\\d+)' : ':id';
  r.get(`/${path}`, ctrl.list);
  r.get(`/${path}/${idRe}`, ctrl.getOne);
  r.post(`/${path}`, validate(createSchema), ctrl.create);
  r.patch(`/${path}/${idRe}`, validate(updateSchema), ctrl.update);
  r.delete(`/${path}/${idRe}`, ctrl.remove);
}

resource('products', productCtrl, productSchema, productUpdateSchema);
resource('home-categories', homeCatCtrl, homeCatSchema, homeCatUpdateSchema);
resource('certifications', certCtrl, certSchema, certUpdateSchema);
resource('customers', customerCtrl, customerSchema, customerUpdateSchema);
resource('categories', categoryCtrl, categorySchema, categoryUpdateSchema, { idNum: false });
resource('orders', orderCtrl, orderSchema, orderUpdateSchema, { idNum: false });

// Inquiries (custom: query filters, no create here — created via public route).
r.get('/inquiries', listInquiries);
r.patch('/inquiries/:id(\\d+)', validate(inquiryUpdateSchema), updateInquiry);
r.delete('/inquiries/:id(\\d+)', deleteInquiry);

// Per-category product table columns.
r.get('/product-columns', getAllColumns);
r.get('/product-columns/:catId', getColumns);
r.put('/product-columns/:catId', validate(columnsSchema), setColumns);

// Settings (singleton).
r.get('/settings', getSettings);
r.put('/settings', validate(settingsSchema), updateSettings);

// Dashboard stats.
r.get('/dashboard/stats', getStats);

// Image upload (multipart, field name: "file").
r.post('/upload', upload.single('file'), uploadImage);

// ── Bulk replace (matches the admin panel's whole-collection persist) ──
// Body: an array, or { items: [...] }. Upserts by id, deletes the rest.
r.put('/bulk/products', bulkReplace(Product));
r.put('/bulk/categories', bulkReplace(Category));
r.put('/bulk/home-categories', bulkReplace(HomeCat));
r.put('/bulk/certifications', bulkReplace(Cert));
r.put('/bulk/orders', bulkReplace(Order));
r.put('/bulk/customers', bulkReplace(Customer));
r.put('/bulk/inquiries', bulkReplace(Inquiry));
r.put('/bulk/product-columns', bulkColumns(ProductColumns));

export default r;
