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
  { id: 1, emoji: '🏅', title: 'ISO 22000:2018', desc: 'Food Safety Management System certified. Our processing facility meets international food handling standards.', img: '' },
  { id: 2, emoji: '🏅', title: 'ISO 9001:2015', desc: 'Quality Management System certified. Our processes meet international quality standards.', img: '' },
  { id: 3, emoji: '🌙', title: 'Halal Certified', desc: 'All edible products carry a valid Halal certificate, suitable for Muslim-majority markets worldwide.', img: '' },
  { id: 4, emoji: '🛡️', title: 'FDA Compliant', desc: 'Our edible salt products comply with US FDA food safety regulations for North American distribution.', img: '' },
  { id: 5, emoji: '🌿', title: 'Natural and Organic', desc: 'No additives, no artificial colouring, no anti-caking agents. Pure as nature intended.', img: '' },
  { id: 6, emoji: '🏆', title: 'Pakistan Standards', desc: 'Our edible salt products comply with Pakistan\'s national food safety regulations.', img: '' },
  { id: 7, emoji: '✡️', title: 'Kosher Certificate', desc: 'Our edible salt is certified Kosher, produced and handled in accordance with Jewish dietary laws for trusted global export.', img: '' },
];

export const SEED_ORDERS = [];

export const SEED_CUSTOMERS = [];

export const SEED_INQ = [];

export const DEFAULT_COLS = [
  { key: 'art', label: 'Art#' },
  { key: 'weight', label: 'Weight (kg)' },
  { key: 'size', label: 'Size (cm)' },
  { key: 'packing', label: 'Packing' },
];

export const SEED_FAQS = [
  { id: 1, question: 'Where is your Himalayan salt sourced from?', answer: 'All our Himalayan salt is sourced directly from the historic Khewra Salt Mine in Punjab, Pakistan (the second largest salt mine in the world), as well as Warcha and Kalabagh mines, ensuring authentic and premium quality mineral salt.', displayOrder: 1, isActive: true },
  { id: 2, question: 'What is your minimum order quantity (MOQ) for exports?', answer: 'Our standard MOQ is one 20ft container load (typically 18 to 25 tons depending on packaging). However, we also offer mixed containers where you can combine different product categories (e.g. edible salt, animal lick blocks, and lamps) in a single shipment.', displayOrder: 2, isActive: true },
  { id: 3, question: 'Do you offer private labeling and custom packaging?', answer: 'Yes, we specialize in private labeling. We can pack edible salt, bath salts, and lamps in custom-branded retail boxes, bags, jars, or grinders with your design and brand identity.', displayOrder: 3, isActive: true },
  { id: 4, question: 'Are your edible salt products certified?', answer: 'Yes, all our food-grade salt products are certified by ISO 22000, Halal certified, and compliant with US FDA regulations, meeting strict global food safety standards.', displayOrder: 4, isActive: true },
  { id: 5, question: 'Do you offer product samples before bulk orders?', answer: 'Yes, we offer sample packs for all our product categories. Samples are typically dispatched via DHL or FedEx within 3-5 business days. The cost of samples is fully refundable on your first bulk container order.', displayOrder: 5, isActive: true }
];

export const SEED_BLOGS = [
  {
    id: 1,
    title: 'The Health Benefits of Himalayan Pink Salt vs Table Salt',
    slug: 'health-benefits-himalayan-pink-salt-vs-table-salt',
    excerpt: 'Discover why culinary experts and health enthusiasts prefer raw Himalayan pink salt over processed table salt, and how it retains its mineral-rich benefits.',
    content: '<p>Himalayan pink salt is harvested from the Khewra Salt Mine in Pakistan. Unlike regular table salt, which is heavily processed and stripped of its natural minerals, pink salt is unrefined and contains over 84 trace minerals, including iron, magnesium, and potassium. These minerals give it its characteristic pink color and provide a range of health benefits.</p><h3>Why it\'s better than table salt:</h3><ul><li><b>Rich in trace minerals:</b> Retains its natural composition.</li><li><b>Fewer additives:</b> Contains no anti-caking agents or chemicals.</li><li><b>Better hydration:</b> Promotes electrolyte balance.</li></ul>',
    category: 'Health & Wellness',
    tags: 'pink salt, health, wellness',
    metaTitle: 'Himalayan Pink Salt vs Table Salt: Health Benefits',
    metaDescription: 'Learn about the health benefits of Himalayan pink salt vs processed table salt. Discover its trace minerals and why it is the healthier choice.',
    isPublished: true
  },
  {
    id: 2,
    title: 'The Complete Guide to Decorating with Himalayan Salt Lamps',
    slug: 'decorating-with-himalayan-salt-lamps',
    excerpt: 'Transform your living space with the warm, therapeutic amber glow of hand-carved Himalayan salt lamps. Learn how to style and care for them.',
    content: '<p>Himalayan salt lamps are more than just beautiful light fixtures; they are natural air purifiers and wellness accessories. Made from solid blocks of pink salt with a small light bulb inside, they emit a soft, amber glow that mimics firelight. In this guide, we will explore the best places to position your salt lamps and how to take care of them.</p><h3>Top locations for salt lamps:</h3><ol><li><b>Bedrooms:</b> The warm glow is perfect as a nightlight that does not disrupt sleep patterns.</li><li><b>Living Rooms:</b> Position near electronics to neutralize positive ions.</li><li><b>Home Offices:</b> Enhances productivity and reduces ambient stress.</li></ol>',
    category: 'Home Decor',
    tags: 'salt lamps, home decor, wellness',
    metaTitle: 'Himalayan Salt Lamps Decoration Guide & Care',
    metaDescription: 'How to decorate your home with natural hand-carved Himalayan salt lamps. Learn styling tips, placement, and proper care instructions.',
    isPublished: true
  }
];

export const SEED_PROCESS_STEPS = [
  {
    id: 1,
    n: '01',
    title: 'Extraction and Mining',
    desc: 'Our mining operations at Khewra, Warcha, and Kalabagh follow strict ethical and environmental standards.',
    list: ['Room-and-pillar mining method', 'Skilled miners with 20+ years experience', 'Three mine sources for different grades'],
    grad: 'd4876b,5c2318',
    img: ''
  },
  {
    id: 2,
    n: '02',
    title: 'Processing and Grading',
    desc: 'At our Sargodha facility, raw salt is washed, dried, then crushed and sieved to consistent particle sizes.',
    list: ['Purified water washing only', 'Separate food-grade and décor lines'],
    grad: 'c9a96e,7a4020',
    img: ''
  },
  {
    id: 3,
    n: '03',
    title: 'Laboratory Testing',
    desc: 'Before any batch is packaged, it undergoes comprehensive testing at our in-house and independent certified lab.',
    list: ['NaCl purity minimum 99.9%', '84 trace mineral ICP analysis', 'Heavy metals within WHO limits'],
    grad: 'e8b090,7a3828',
    img: ''
  },
  {
    id: 4,
    n: '04',
    title: 'Packaging and Branding',
    desc: 'From bulk sack filling to premium retail gift box assembly with custom labels for private label clients.',
    list: ['Food-grade inner lining for edible products', 'Custom label design and digital printing'],
    grad: 'e0a880,8a4828',
    img: ''
  },
  {
    id: 5,
    n: '05',
    title: 'Documentation',
    desc: 'Complete trade documents for every shipment, experienced with customs across all major markets.',
    list: ['Commercial Invoice and Packing List', 'COA and MSDS', 'Phytosanitary and Halal Certificate', 'Certificate of Origin, SGS on request'],
    grad: 'c47058,5c2318',
    img: ''
  },
  {
    id: 6,
    n: '06',
    title: 'Worldwide Shipping',
    desc: 'Shipping from Port Qasim Karachi via sea freight and Lahore and Karachi airports via air.',
    list: ['FCL and LCL sea freight', 'Air freight for urgent orders', 'FOB Karachi, CIF, DDP available', 'Real-time shipment tracking provided'],
    grad: 'e89a7a,7a3020',
    img: ''
  }
];


