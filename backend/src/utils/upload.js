import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Vercel's project dir is read-only; only /tmp is writable (and ephemeral).
const onServerless = !!process.env.VERCEL;
export const UPLOAD_DIR = onServerless
  ? path.join(os.tmpdir(), 'uploads')
  : path.resolve(__dirname, '../../uploads');
try { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); } catch { /* read-only FS */ }

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    const base = (req.body?.field || file.fieldname || 'img').replace(/[^a-z0-9_-]/gi, '');
    cb(null, `${base}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
  },
});

// Build an absolute, servable URL for a stored file.
export const fileUrl = (filename) => `${env.publicUrl}/uploads/${filename}`;
