// Verbatim seed data lifted from BinAouf-Admin.html so Mongo mirrors the panel 1:1.

export const SEED_CATS = [
  { id: 'edible', name: 'Edible Salt', emoji: '🧂', desc: 'Food-grade fine & coarse salt for cooking and retail' },
  { id: 'animal', name: 'Animal Lick Salt', emoji: '🐄', desc: 'Mineral salt licks for livestock & horses' },
  { id: 'bath', name: 'Bath & Spa', emoji: '🛁', desc: 'Bath soaks, scrubs and spa-grade wellness salt' },
  { id: 'tiles', name: 'Salt Tiles & Bricks', emoji: '🧱', desc: 'Construction, sauna bricks and wall tiles' },
  { id: 'decor', name: 'Decor & Lamps', emoji: '💡', desc: 'Natural & carved Himalayan salt lamps and décor' },
  { id: 'candle', name: 'Salt Candle Holders', emoji: '🕯️', desc: 'Carved tea-light & pillar candle holders' },
  { id: 'rock', name: 'Rock Salt', emoji: '⛏️', desc: 'Raw natural rock salt lumps & bulk grades' },
  { id: 'kitchen', name: 'Kitchen & Accessories', emoji: '🍽️', desc: 'Serving blocks, grinders & kitchenware' },
  { id: 'custom', name: 'Custom & Bulk', emoji: '📦', desc: 'Buyer-spec mixed loads & bulk export orders' },
  { id: 'private', name: 'Private Labeling', emoji: '🏷️', desc: 'White-label branding & export-ready packaging' },
];

export const SEED_PRODUCTS = [
  { id: 1, cat: 'edible', name: 'Fine Edible Salt 1kg', desc: 'Food-grade fine pink salt, retail packed.', tags: 'food-grade, retail', status: 'Active' },
  { id: 2, cat: 'edible', name: 'Coarse Edible Salt 25kg', desc: 'Bulk coarse grain for food processing.', tags: 'bulk, export', status: 'Active' },
  { id: 3, cat: 'kitchen', name: 'Himalayan Salt Grinder', desc: 'Refillable grinder with crystal salt.', tags: 'retail', status: 'Active' },
  { id: 4, cat: 'decor', name: 'Natural Shape Lamp 2-3kg', desc: 'Hand-mined natural lamp with wood base.', tags: 'export, décor', status: 'Active' },
  { id: 5, cat: 'decor', name: 'Carved Sphere Lamp', desc: 'Precision-carved sphere, dimmable cord.', tags: 'premium', status: 'Active' },
  { id: 6, cat: 'decor', name: 'USB Mini Lamp', desc: 'Desktop USB lamp with color LED.', tags: 'retail', status: 'Draft' },
  { id: 7, cat: 'animal', name: 'Square', desc: 'Animal lick salt — square block.', tags: 'lick, livestock', status: 'Active', specs: { art: 'LS-A', weight: '1-2', size: '10×11', packing: '—' } },
  { id: 8, cat: 'animal', name: 'Cylinder', desc: 'Animal lick salt — cylinder block.', tags: 'lick, livestock', status: 'Active', specs: { art: 'LS-B', weight: '1-2', size: '10×11', packing: '—' } },
  { id: 24, cat: 'animal', name: 'Natural Cylinder', desc: 'Natural cylinder lick salt.', tags: 'lick, livestock', status: 'Active', specs: { art: 'LS-C', weight: '1-1.5', size: '10×11', packing: '—' } },
  { id: 25, cat: 'animal', name: 'Natural Cylinder', desc: 'Natural cylinder lick salt.', tags: 'lick, livestock', status: 'Active', specs: { art: 'LS-D', weight: '2-3', size: '10×15', packing: '—' } },
  { id: 26, cat: 'animal', name: 'Natural Cylinder', desc: 'Natural cylinder lick salt.', tags: 'lick, livestock', status: 'Active', specs: { art: 'LS-E', weight: '3-4', size: '12×15', packing: '—' } },
  { id: 27, cat: 'animal', name: 'Natural Cylinder', desc: 'Natural cylinder lick salt.', tags: 'lick, livestock', status: 'Active', specs: { art: 'LS-F', weight: '4-5', size: '12×18', packing: '—' } },
  { id: 28, cat: 'animal', name: 'Natural Cylinder', desc: 'Natural cylinder lick salt.', tags: 'lick, livestock', status: 'Active', specs: { art: 'LS-G', weight: '5-6', size: '15×20', packing: '—' } },
  { id: 29, cat: 'animal', name: 'Rock Salt Lumps', desc: 'Natural rock salt lumps for licking.', tags: 'lick, raw', status: 'Active', specs: { art: 'LS-H', weight: '2-10', size: '-', packing: '—' } },
  { id: 30, cat: 'animal', name: 'Rock Salt Lumps', desc: 'Large natural rock salt lumps.', tags: 'lick, raw', status: 'Active', specs: { art: 'LS-I', weight: '10-20', size: '-', packing: '—' } },
  { id: 31, cat: 'animal', name: 'Feed Additive', desc: 'Crushed salt feed additive.', tags: 'feed, additive', status: 'Active', specs: { art: 'LS-J', weight: '-', size: '0.5-5.0mm', packing: '—' } },
  { id: 9, cat: 'bath', name: 'Bath Soak Crystals 5kg', desc: 'Coarse bath crystals, spa grade.', tags: 'spa, bulk', status: 'Active' },
  { id: 10, cat: 'bath', name: 'Lavender Body Scrub', desc: 'Fine salt scrub blended with oils.', tags: 'retail, spa', status: 'Active' },
  { id: 11, cat: 'tiles', name: 'Salt Wall Brick 8x4x2', desc: 'Polished sauna & wall brick.', tags: 'construction', status: 'Active' },
  { id: 12, cat: 'tiles', name: 'Cooking Salt Tile', desc: 'Grill & serving tile, heat resistant.', tags: 'retail', status: 'Active' },
  { id: 13, cat: 'tiles', name: 'Sauna Brick Pallet', desc: 'Bulk pallet for sauna installations.', tags: 'bulk, export', status: 'Active' },
  { id: 14, cat: 'candle', name: 'Tea Light Holder', desc: 'Carved candle holder, warm glow.', tags: 'décor, retail', status: 'Active' },
  { id: 15, cat: 'candle', name: 'Pillar Candle Holder', desc: 'Carved salt pillar holder, soft ambient glow.', tags: 'décor, gift', status: 'Active' },
  { id: 16, cat: 'rock', name: 'Raw Rock Salt Lumps 50kg', desc: 'Unprocessed natural rock salt chunks for bulk export.', tags: 'bulk, raw', status: 'Active' },
  { id: 17, cat: 'rock', name: 'Water Softener Salt', desc: 'Bulk natural salt for softening systems.', tags: 'industrial, bulk', status: 'Active' },
  { id: 18, cat: 'bath', name: 'Ceramic Salt Inhaler', desc: 'Salt pipe for respiratory & spa therapy.', tags: 'wellness', status: 'Active' },
  { id: 19, cat: 'decor', name: 'Carved Heart Décor', desc: 'Decorative carved salt heart.', tags: 'gift', status: 'Active' },
  { id: 20, cat: 'private', name: 'Custom Branded Lamp Box', desc: 'Your logo on premium gift packaging.', tags: 'custom, export', status: 'Active' },
  { id: 21, cat: 'private', name: 'Private Label Edible Pack', desc: 'White-label retail edible salt range.', tags: 'white-label', status: 'Active' },
  { id: 22, cat: 'kitchen', name: 'Salt Serving Block', desc: 'Heat & chill-safe Himalayan serving block.', tags: 'retail, kitchen', status: 'Active' },
  { id: 23, cat: 'custom', name: 'Mixed Container Load 20ft', desc: 'Custom-mixed bulk container to buyer spec.', tags: 'bulk, export', status: 'Active' },
];

export const SEED_HOMECATS = [
  { id: 1, title: 'Edible Salt', desc: 'Food-grade pink salt for cooking & retail', link: 'edible', emoji: '🧂', img: '' },
  { id: 2, title: 'Salt Lamps & Decor', desc: 'Hand-carved lamps that warm any space', link: 'decor', emoji: '💡', img: '' },
  { id: 3, title: 'Bath & Spa', desc: 'Spa-grade soaks, scrubs & wellness salt', link: 'bath', emoji: '🛁', img: '' },
  { id: 4, title: 'Tiles & Bricks', desc: 'Sauna walls, cooking tiles & construction', link: 'tiles', emoji: '🧱', img: '' },
  { id: 5, title: 'Animal Lick Salt', desc: 'Mineral licks for livestock & horses', link: 'animal', emoji: '🐄', img: '' },
  { id: 6, title: 'Private Labeling', desc: 'White-label & export-ready custom packaging', link: 'private', emoji: '🏷️', img: '' },
];

export const SEED_CERTS = [
  { id: 1, emoji: '🏅', title: 'ISO 22000', desc: 'Food Safety Management System certified. Our processing facility meets international food handling standards.', img: '' },
  { id: 2, emoji: '🌙', title: 'Halal Certified', desc: 'All edible products carry a valid Halal certificate, suitable for Muslim-majority markets worldwide.', img: '' },
  { id: 3, emoji: '🇺🇸', title: 'FDA Compliant', desc: 'Our edible salt products comply with US FDA food safety regulations for North American distribution.', img: '' },
  { id: 4, emoji: '🌿', title: 'Natural and Organic', desc: 'No additives, no artificial colouring, no anti-caking agents. Pure as nature intended.', img: '' },
];

export const SEED_ORDERS = [
  { id: 'BA-1042', cust: 'Hamburg Salt GmbH', cc: 'C9A84C', country: '🇩🇪 Germany', prod: 'Salt Lamps', qty: '500 pc', amt: '$4,900', status: 'shipped', date: 'Jun 21' },
  { id: 'BA-1041', cust: 'Gulf Trading FZE', cc: 'B65C3A', country: '🇦🇪 UAE', prod: 'Edible Salt', qty: '12,000 kg', amt: '$5,040', status: 'pending', date: 'Jun 20' },
  { id: 'BA-1040', cust: 'Saltworks LLC', cc: 'D98E73', country: '🇺🇸 USA', prod: 'Bath & Spa', qty: '2,000 kg', amt: '$2,400', status: 'paid', date: 'Jun 19' },
  { id: 'BA-1039', cust: 'Nordic Wellness', cc: '3D6FA8', country: '🇸🇪 Sweden', prod: 'Salt Inhalers', qty: '800 pc', amt: '$2,480', status: 'processing', date: 'Jun 18' },
  { id: 'BA-1038', cust: 'BritStone Ltd', cc: '9A4A2C', country: '🇬🇧 UK', prod: 'Bricks & Tiles', qty: '1,200 pc', amt: '$2,520', status: 'shipped', date: 'Jun 16' },
  { id: 'BA-1037', cust: 'Maple Foods Inc', cc: '3F8F5F', country: '🇨🇦 Canada', prod: 'Edible Salt', qty: '8,000 kg', amt: '$3,360', status: 'paid', date: 'Jun 14' },
  { id: 'BA-1036', cust: 'Doha Décor Co', cc: 'C0432F', country: '🇶🇦 Qatar', prod: 'Decorative', qty: '600 pc', amt: '$1,440', status: 'pending', date: 'Jun 12' },
];

export const SEED_CUSTOMERS = [
  { id: 1, name: 'Hamburg Salt GmbH', cc: 'C9A84C', type: 'B2B Importer', country: 'Germany', email: 'orders@hamburgsalt.de', orders: 14, spent: '$38.2k', since: '2023' },
  { id: 2, name: 'Gulf Trading FZE', cc: 'B65C3A', type: 'Distributor', country: 'UAE', email: 'info@gulftrade.ae', orders: 9, spent: '$24.6k', since: '2024' },
  { id: 3, name: 'Saltworks LLC', cc: 'D98E73', type: 'Retail Chain', country: 'USA', email: 'buy@saltworks.com', orders: 6, spent: '$14.1k', since: '2024' },
  { id: 4, name: 'Nordic Wellness Co', cc: '3D6FA8', type: 'Wellness Brand', country: 'Sweden', email: 'hello@nordicwell.se', orders: 5, spent: '$11.8k', since: '2025' },
  { id: 5, name: 'BritStone Ltd', cc: '9A4A2C', type: 'Builder Supply', country: 'UK', email: 'sales@britstone.co.uk', orders: 4, spent: '$9.4k', since: '2025' },
  { id: 6, name: 'Maple Foods Inc', cc: '3F8F5F', type: 'Food Processor', country: 'Canada', email: 'procure@maplefoods.ca', orders: 7, spent: '$16.7k', since: '2023' },
];

export const SEED_INQ = [
  { id: 1, name: 'Lena Fischer', cc: 'C9A84C', company: 'Hamburg Salt GmbH', country: 'Germany', subj: 'Bulk Salt Lamps — Q3 Order', msg: 'We are interested in placing a 1,000-unit order of natural shape salt lamps for Q3. Could you share FOB pricing and lead time to Hamburg port?', read: false, archived: false },
  { id: 2, name: 'Omar Al-Rashid', cc: 'B65C3A', company: 'Gulf Trading FZE', country: 'UAE', subj: 'Private Label Edible Salt', msg: 'Looking for a white-label partner for retail edible salt in the GCC. Do you offer custom branded 500g & 1kg retail packs? Please send MOQ details.', read: false, archived: false },
  { id: 3, name: 'Sarah Lindqvist', cc: '3D6FA8', company: 'Nordic Wellness', country: 'Sweden', subj: 'Salt Inhaler Samples', msg: 'We would love to evaluate your ceramic salt inhalers before a larger order. Can you ship 5 samples to Stockholm?', read: false, archived: false },
  { id: 4, name: 'James Carter', cc: '3F8F5F', company: 'Maple Foods Inc', country: 'Canada', subj: 'Re: Coarse Edible Salt Quote', msg: 'Thanks for the quote — the pricing works for us. Please proceed with the 8,000kg order and share the proforma invoice.', read: true, archived: false },
  { id: 5, name: 'Priya Nair', cc: 'D98E73', company: 'Saltworks LLC', country: 'USA', subj: 'Re: Bath Salt Range', msg: 'Confirmed receipt of samples, quality looks great. We will finalize SKUs by next week.', read: true, archived: false },
];

export const DEFAULT_COLS = [
  { key: 'art', label: 'Art#' },
  { key: 'weight', label: 'Weight (kg)' },
  { key: 'size', label: 'Size (cm)' },
  { key: 'packing', label: 'Packing' },
];
