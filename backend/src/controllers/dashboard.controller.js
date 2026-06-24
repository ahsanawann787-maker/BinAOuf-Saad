import { asyncHandler } from '../utils/asyncHandler.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Inquiry } from '../models/Inquiry.js';

const parseAmt = (a) => parseFloat(String(a || '').replace(/[^0-9.]/g, '')) || 0;

// Mirrors the admin's updateStats(): orders, revenue, active products, unread inquiries.
export const getStats = asyncHandler(async (_req, res) => {
  const [orders, activeProducts, customers, unread, inquiries] = await Promise.all([
    Order.find().lean(),
    Product.countDocuments({ status: 'Active' }),
    Customer.countDocuments(),
    Inquiry.countDocuments({ read: false, archived: false }),
    Inquiry.countDocuments({ archived: false }),
  ]);

  const revenue = orders.reduce((s, o) => s + parseAmt(o.amt), 0);
  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    ok: true,
    data: {
      orders: orders.length,
      revenue,
      revenueDisplay: revenue >= 1000 ? `$${(revenue / 1000).toFixed(1)}k` : `$${revenue.toFixed(0)}`,
      activeProducts,
      customers,
      unreadInquiries: unread,
      totalInquiries: inquiries,
      ordersByStatus: byStatus,
    },
  });
});
