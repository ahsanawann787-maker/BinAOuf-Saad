// Wires each resource to the CRUD factory with its id-generation strategy.
import { crudController } from './crudFactory.js';
import { nextSeq } from '../utils/counter.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { HomeCat } from '../models/HomeCat.js';
import { Cert } from '../models/Cert.js';
import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';

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
