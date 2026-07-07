import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Cert } from './src/models/Cert.js';
import { SEED_CERTS } from './src/seed/data.js';

dotenv.config();

async function run() {
  console.log('Connecting to:', process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  // Clear existing certs
  await Cert.deleteMany({});
  console.log('Cleared existing Certs.');

  // Insert SEED_CERTS
  const certsToInsert = SEED_CERTS.map(c => ({
    id: c.id,
    emoji: c.emoji,
    title: c.title,
    desc: c.desc,
    img: c.img || '',
    order: c.id
  }));

  await Cert.insertMany(certsToInsert);
  console.log(`Successfully seeded ${certsToInsert.length} certifications!`);

  await mongoose.disconnect();
  console.log('Disconnected!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
