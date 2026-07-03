// Vercel serverless entry. All requests route here (see vercel.json).
import 'dotenv/config';

// Guard: if required env vars are missing, respond with a clear 503
// instead of crashing the whole function (which gives a confusing 500).
const missing = ['MONGO_URI', 'JWT_SECRET'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[api/index] Missing env vars: ${missing.join(', ')}`);
}

let _app = null;
let _ready = null;

async function getApp() {
  if (!_app) {
    const { createApp } = await import('../src/app.js');
    _app = createApp();
  }
  return _app;
}

async function getDB() {
  if (!_ready) {
    const { connectDB } = await import('../src/config/db.js');
    _ready = connectDB();
  }
  return _ready;
}

export default async function handler(req, res) {
  // Return a helpful error if env vars aren't configured yet
  if (missing.length) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      ok: false,
      error: `Server misconfigured — missing: ${missing.join(', ')}. Add them in the Vercel dashboard under Settings → Environment Variables, then redeploy.`,
    }));
    return;
  }

  try {
    await getDB();
  } catch (e) {
    _ready = null;
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Database connection failed: ' + e.message }));
    return;
  }

  const app = await getApp();
  return app(req, res);
}
