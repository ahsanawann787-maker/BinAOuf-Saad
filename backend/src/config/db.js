import mongoose from 'mongoose';
import dns from 'node:dns';
import { env } from './env.js';

// ISP/serverless DNS sometimes refuses Atlas SRV lookups. Force public resolvers.
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch { /* ignore */ }

mongoose.set('strictQuery', true);

// Cache the connection across (warm) serverless invocations.
let cached = global.__binaoufMongoose;
if (!cached) cached = global.__binaoufMongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    mongoose.connection.on('error', (e) => console.error('✖ MongoDB error:', e.message));
    cached.promise = mongoose
      .connect(env.mongoUri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10 })
      .then((m) => {
        console.log('✔ MongoDB connected');
        return m;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // allow retry on next request
    throw e;
  }
  return cached.conn;
}

export async function disconnectDB() {
  if (cached.conn) await mongoose.connection.close();
  cached.conn = null;
  cached.promise = null;
}
