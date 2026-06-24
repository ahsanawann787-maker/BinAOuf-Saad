// Vercel serverless entry. All requests route here (see vercel.json).
import { createApp } from '../src/app.js';
import { connectDB } from '../src/config/db.js';

const app = createApp();
let ready = null;

export default async function handler(req, res) {
  try {
    if (!ready) ready = connectDB();
    await ready;
  } catch (e) {
    ready = null;
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Database connection failed' }));
    return;
  }
  return app(req, res);
}
