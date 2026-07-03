import dotenv from 'dotenv';
dotenv.config();

const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  const msg = `Missing required env vars: ${missing.join(', ')} — copy .env.example → .env and fill them in.`;
  console.error('✖ ' + msg);
  // Use throw instead of process.exit so serverless handlers can catch this gracefully.
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    throw new Error(msg);
  } else {
    process.exit(1);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI,
  publicUrl: (process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 4000}`).replace(/\/$/, ''),
  corsOrigins: (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  admin: {
    name: process.env.ADMIN_NAME || 'Roman Amjid',
    email: (process.env.ADMIN_EMAIL || 'admin@binaouf.com').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Binaoufsaltcompany123',
  },
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 5,
  isProd: (process.env.NODE_ENV || 'development') === 'production',
};
