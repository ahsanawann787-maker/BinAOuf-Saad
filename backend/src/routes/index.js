import { Router } from 'express';
import authRoutes from './auth.routes.js';
import publicRoutes from './public.routes.js';
import adminRoutes from './admin.routes.js';

const api = Router();

api.get('/health', (_req, res) =>
  res.json({ ok: true, service: 'binaouf-api', time: new Date().toISOString() })
);

api.use('/auth', authRoutes);     // /api/auth/login, /api/auth/me
api.use('/public', publicRoutes); // /api/public/* (website, unauthenticated)
api.use('/admin', adminRoutes);   // /api/admin/* (JWT protected)

export default api;
