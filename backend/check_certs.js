import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Cert } from './src/models/Cert.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const certs = await Cert.find().lean();
  console.log('--- Current Certifications in DB ---');
  console.log(JSON.stringify(certs, null, 2));
  await mongoose.disconnect();
}

run().catch(console.error);
