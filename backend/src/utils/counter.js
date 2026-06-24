import { Counter } from '../models/Counter.js';

// Atomic auto-increment. Returns the next integer for a named sequence.
export async function nextSeq(name, start = 1) {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  // First-ever call returns 1; if you need a custom start, seed the counter.
  return doc.value < start ? start : doc.value;
}

// Ensure a counter is at least `value` (used by seed to avoid id collisions).
export async function ensureCounter(name, value) {
  const doc = await Counter.findById(name);
  if (!doc || doc.value < value) {
    await Counter.findByIdAndUpdate(name, { value }, { upsert: true });
  }
}
