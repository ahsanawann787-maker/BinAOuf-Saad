import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { UPLOAD_DIR } from './utils/upload.js';
import api from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);

  // Security & infra
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.use(morgan(env.isProd ? 'combined' : 'dev'));

  // CORS
  const allowAll = env.corsOrigins.includes('*');
  app.use(
    cors({
      origin(origin, cb) {
        if (allowAll || !origin || env.corsOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
    })
  );

  // Body parsing — generous limit because product/cert images may arrive as base64.
  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: true, limit: '12mb' }));

  // Rate limit the API surface (uploads/auth especially).
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: env.isProd ? 300 : 1000,
      standardHeaders: true,
      legacyHeaders: false,
      message: { ok: false, error: 'Too many requests, slow down.' },
    })
  );

  // Static uploads
  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', immutable: false }));

  // API
  app.use('/api', api);
  app.get('/', (_req, res) => res.json({ ok: true, service: 'Bin Aouf API', docs: '/api/health' }));

  // 404 + errors
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
