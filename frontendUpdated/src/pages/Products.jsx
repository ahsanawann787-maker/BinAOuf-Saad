import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import pinkTiles from '../assets/images/pink_salt_tiles.jpg'
import cookingSlab from '../assets/images/cooking_slab.jpg'

const TABS = [
  { id: 'edible', label: 'Edible Salt' },
  { id: 'animal', label: 'Animal Lick' },
  { id: 'bath', label: 'Bath & Spa' },
  { id: 'decor', label: 'Décor & Lamps' },
  { id: 'tilesbricks', label: 'Tiles & Bricks' },
  { id: 'kitchen', label: 'Kitchen & Accessories' },
  { id: 'candles', label: 'Salt Candle Holders' },
  { id: 'rocksalt', label: 'Rock Salt' },
  { id: 'custom', label: 'Custom & Bulk' },
]

// Product items per category
const PRODUCTS = {
  edible: {
    title: 'Edible Himalayan Salt',
    pshGrad: '#f0c0a0,#c07050',
    desc: 'Food-grade fine and coarse Himalayan pink salt. Available in various grind sizes, grades and packaging for retail, food service and bulk export.',
    items: [
      { name: 'Fine Edible Salt', grad: '#e8c090,#9a4828' },
      { name: 'Coarse Edible Salt', grad: '#d4876b,#7a3020' },
      { name: 'Extra Coarse Salt', grad: '#c09070,#6a3018' },
      { name: 'Iodised Fine Salt', grad: '#e0a880,#8a4828' },
      { name: 'Iodised Coarse Salt', grad: '#c9a96e,#7a4020' },
      { name: 'Smoked Himalayan Salt', grad: '#d4a07a,#8a5030' },
    ],
    table: [
      { name: 'Fine Edible Salt', size: '0.5–1 mm', packing: '1kg / 5kg / 25kg', moq: '500kg' },
      { name: 'Coarse Edible Salt', size: '1–3 mm', packing: '5kg / 25kg / bulk', moq: '500kg' },
      { name: 'Extra Coarse Salt', size: '3–5 mm', packing: '25kg / 50kg', moq: '1,000kg' },
      { name: 'Iodised Fine Salt', size: '0.5–1 mm', packing: '1kg / 5kg', moq: '500kg' },
      { name: 'Iodised Coarse Salt', size: '1–3 mm', packing: '25kg', moq: '500kg' },
      { name: 'Smoked Himalayan Salt', size: '1–3 mm', packing: '100g / 500g', moq: '200 units' },
    ],
  },
  animal: {
    title: 'Animal Lick Salt',
    pshGrad: '#c47058,#5c2318',
    desc: 'Mineral-rich Himalayan salt lick blocks for cattle, horses and livestock. Available in squares, cylinders, natural chunks and specialty shapes.',
    items: [
      { name: 'Square Lick Block 1-2kg', grad: '#e8b070,#9a5020', art: 'LS-A', weight: '1–2', size: '10×11' },
      { name: 'Cylinder Lick Block 1-2kg', grad: '#d4906a,#7a3820', art: 'LS-B', weight: '1–2', size: '10×11' },
      { name: 'Natural Cylinder 1–1.5kg', grad: '#c09070,#6a3018', art: 'LS-C', weight: '1–1.5', size: '10×11' },
      { name: 'Natural Cylinder 2–3kg', grad: '#e0a880,#8a4828', art: 'LS-D', weight: '2–3', size: '10×15' },
      { name: 'Natural Cylinder 3–4kg', grad: '#c9a96e,#7a4020', art: 'LS-E', weight: '3–4', size: '12×15' },
      { name: 'Natural Cylinder 4–5kg', grad: '#d4a07a,#8a5030', art: 'LS-F', weight: '4–5', size: '12×18' },
      { name: 'Natural Cylinder 5–6kg', grad: '#d4a07a,#8a5030', art: 'LS-G', weight: '5–6', size: '15×20' },
      { name: 'Rock Salt Lumps 2–10kg', grad: '#c09070,#6a3018', art: 'LS-H', weight: '2–10', size: '—' },
      { name: 'Rock Salt Lumps 10–20kg', grad: '#e8b070,#9a5020', art: 'LS-I', weight: '10–20', size: '—' },
      { name: 'Feed Additive Crushed 0.5–5mm', grad: '#c9a96e,#7a4020', art: 'LS-J', weight: '—', size: '0.5–5mm' },
    ],
    table: [
      { name: 'Square Block', art: 'LS-A', weight: '1–2 kg', size: '10×11 cm', packing: 'Polybag / carton' },
      { name: 'Cylinder Block', art: 'LS-B', weight: '1–2 kg', size: '10×11 cm', packing: 'Polybag / carton' },
      { name: 'Natural Cylinder', art: 'LS-G', weight: '5–6 kg', size: '15×20 cm', packing: 'Net / polybag' },
      { name: 'Rock Salt Lumps', art: 'LS-H', weight: '2–10 kg', size: 'Natural', packing: '25kg / 50kg bag' },
    ],
  },
  bath: {
    title: 'Bath & Spa Salt',
    pshGrad: '#e8b090,#7a3828',
    desc: 'Premium bath soaks, scrubs, and spa-grade wellness salt for boutique and retail. Available in grain sizes from ultra-fine to large coarse crystals.',
    items: [
      { name: 'Bath Salt Crystals 1kg', grad: '#e8b070,#9a5020' },
      { name: 'Coarse Bath Crystals 5kg', grad: '#d4906a,#7a3820' },
      { name: 'Lavender Detox Soak', grad: '#c09070,#6a3018' },
      { name: 'Rose Petal Bath Salt', grad: '#e0a880,#8a4828' },
      { name: 'Exfoliating Body Scrub', grad: '#c9a96e,#7a4020' },
      { name: 'Salt Body Bar 200g', grad: '#d4a07a,#8a5030' },
      { name: 'Salt Inhaler (Ceramic)', grad: '#e8b070,#9a5020' },
      { name: 'Spa Gift Set', grad: '#d4906a,#7a3820' },
    ],
    table: [
      { name: 'Bath Salt Crystals 1kg', size: '2–4 mm', packing: 'Kraft bag / jar', moq: '200 units' },
      { name: 'Coarse Bath Crystals 5kg', size: '4–8 mm', packing: '5kg bag', moq: '100 units' },
      { name: 'Exfoliating Body Scrub', size: 'Fine + oil', packing: 'Jar 200g', moq: '200 units' },
      { name: 'Salt Body Bar 200g', size: 'Block', packing: 'Wrapped bar', moq: '100 units' },
    ],
  },
  decor: {
    title: 'Décor & Lamps',
    pshGrad: '#d4876b,#5c2318',
    desc: 'Natural and hand-carved Himalayan salt lamps. Explore our full sub-categories below.',
    subcats: [
      { id: 'naturalshape', label: 'Natural Shape', desc: 'Hand-picked, uncarved Himalayan salt lamps in their raw natural form. Each piece is unique, graded by weight, and finished with a wooden base and UL/CE-certified fitting.', grad: 'd4876b,5c2318' },
      { id: 'geometrical', label: 'Geometrical Shape', desc: 'Precision-carved lamps in clean geometric forms — spheres, pyramids, cubes and more — polished for a refined, modern interior look.', grad: 'c9a96e,7a4020' },
      { id: 'usb', label: 'USB Lamps', desc: 'Compact USB-powered salt lamps for desks, cars and bedside tables. Plug-and-glow convenience with optional RGB colour-changing bulbs.', grad: 'c09070,6a3018' },
      { id: 'firebowl', label: 'Fire Bowl', desc: 'Metal bowls filled with glowing Himalayan salt chunks — a warm, ambient centrepiece for homes, spas and lounges.', grad: 'e08850,7a3018' },
      { id: 'ironbasket', label: 'Iron Basket', desc: 'Powder-coated iron baskets packed with rough salt chunks, casting a soft glow through the mesh. Durable and decorative.', grad: 'b88a6a,5c2818' },
      { id: 'woodenbasket', label: 'Wooden Basket', desc: 'Rustic wooden baskets and trays holding natural salt chunks — a warm, organic décor piece for living spaces and retail gifting.', grad: 'cba078,7a4a28' },
      { id: 'nightlight', label: 'Night Light Lamps', desc: 'Low-glow plug-in and mini salt night lights — gentle, calming illumination perfect for nurseries, hallways and bedrooms.', grad: 'd4a07a,8a5030' },
      { id: 'figure', label: 'Figure Shapes', desc: 'Artisan-carved salt lamps in decorative figures — hearts, stars, moons, animals and custom shapes for gifting and statement décor.', grad: 'd4906a,7a3820' },
    ],
    subItems: {
      naturalshape: ['Natural Lamp 2–3 KG', 'Natural Lamp 3–5 KG', 'Natural Lamp 5–7 KG', 'Natural Lamp 7–10 KG', 'Giant Natural Lamp 10 KG+', 'Natural Lamp Gift Pack'],
      geometrical: ['Sphere / Ball Lamp', 'Pyramid Lamp', 'Cube Lamp', 'Cylinder Lamp', 'Egg Lamp', 'Obelisk Lamp'],
      usb: ['USB Mini Lamp', 'USB Sphere Lamp', 'USB Pyramid Lamp', 'USB Heart Lamp', 'USB RGB Colour-Changing Lamp', 'USB Aroma Diffuser Lamp'],
      firebowl: ['Fire Bowl – Small', 'Fire Bowl – Medium', 'Fire Bowl – Large', 'Mesh Fire Bowl', 'Fire Bowl with Salt Chunks Refill'],
      ironbasket: ['Round Iron Basket Lamp', 'Square Iron Basket Lamp', 'Heart Iron Basket Lamp', 'Large Iron Basket Lamp', 'Iron Mesh Basket with Chunks'],
      woodenbasket: ['Round Wooden Basket Lamp', 'Rectangular Wooden Basket Lamp', 'Wooden Tray Lamp', 'Wooden Crate Lamp', 'Wooden Base Chunk Lamp'],
      nightlight: ['Mini Night Light', 'Plug-in Night Light', 'Heart Night Light', 'Colour-Changing Night Light', 'Animal-Shape Night Light'],
      figure: ['Heart Lamp', 'Star Lamp', 'Moon / Crescent Lamp', 'Animal Figure Lamp', 'Bottle / Decanter Lamp', 'Custom Carved Figure'],
    },
  },
  tilesbricks: {
    title: 'Salt Tiles & Bricks',
    pshGrad: '#e8c0a0,#c07850',
    desc: 'Polished Himalayan salt tiles and bricks for saunas, halotherapy rooms, and feature walls. Available in standard and custom sizes.',
    items: [
      { name: 'Standard Pink Salt Tiles', img: pinkTiles },
      { name: 'Himalayan Salt Cooking Slab', img: cookingSlab },
      { name: 'Sauna Salt Bricks', grad: '#d4876b,#5c2318' },
      { name: 'White Himalayan Tiles', grad: '#f0e0d0,#a06040' },
      { name: 'Backlit Panel Tiles', grad: '#e8a870,#7a3820' },
      { name: 'Salt Floor Tiles', grad: '#c9a96e,#7a4020' },
    ],
    table: [
      { name: 'Pink Salt Tiles 8×4×2"', size: '8×4×2 in', packing: 'Palletised', moq: '200 tiles' },
      { name: 'Cooking Slab 12×8×1.5"', size: '12×8×1.5 in', packing: 'Individual box', moq: '50 slabs' },
      { name: 'Sauna Brick', size: '8×4×2 in', packing: 'Palletised', moq: '500 bricks' },
    ],
  },
  kitchen: {
    title: 'Kitchen & Accessories',
    pshGrad: '#d9bb98,#8a5a35',
    desc: 'Serving blocks, grinders and kitchenware. Content coming soon — contact us for details.',
    items: [{ name: 'Kitchen and Accessories Range', grad: '#d9bb98,#8a5a35' }],
    table: [{ name: 'Kitchen and Accessories Range', size: '—', packing: '—', moq: '—' }],
  },
  candles: {
    title: 'Salt Candle Holders',
    pshGrad: '#e0a880,#8a4828',
    desc: 'Hand-carved tea-light and pillar candle holders in pink and white Himalayan salt. Content coming soon.',
    items: [{ name: 'Salt Candle Holders Range', grad: '#e0a880,#8a4828' }],
    table: [{ name: 'Salt Candle Holders Range', size: '—', packing: '—', moq: '—' }],
  },
  rocksalt: {
    title: 'Rock Salt',
    pshGrad: '#d4a882,#9b5040',
    desc: 'Raw natural rock salt lumps and bulk grades for industrial, water-softening and specialty food use.',
    items: [{ name: 'Rock Salt Range', grad: '#d4a882,#9b5040' }],
    table: [{ name: 'Rock Salt Range', size: '—', packing: '—', moq: '—' }],
  },
  custom: {
    title: 'Custom & Bulk Orders',
    pshGrad: '#c9a96e,#5c2318',
    desc: 'Private label, white label, mixed containers, FCL and LCL — all handled end-to-end.',
    items: [
      { name: 'Build Your Own Brand', grad: '#c9a96e,#5c2318' },
      { name: 'Full Container Orders', grad: '#d4876b,#6c3020' },
      { name: 'Product Sample Kits', grad: '#b06040,#3c1a08' },
      { name: 'Mixed Consignment Orders', grad: '#e8c080,#9a4828' },
      { name: 'Label and Packaging Design', grad: '#c0a080,#7a4828' },
      { name: 'Full Document Package', grad: '#d4a070,#8a5030' },
    ],
    table: [
      { name: 'Build Your Own Brand', size: 'Custom', packing: 'Custom', moq: 'Custom' },
      { name: 'Full Container Orders', size: '20ft / 40ft', packing: 'Bulk', moq: '5–10 tons' },
      { name: 'Product Sample Kits', size: 'Varies', packing: 'Gift set', moq: '1 set' },
    ],
  },
}

const GRADS = [
  '#e8b070,#9a5020', '#d4906a,#7a3820', '#c09070,#6a3018',
  '#e0a880,#8a4828', '#c9a96e,#7a4020', '#d4a07a,#8a5030',
]

function ProductItem({ item, idx, navigate }) {
  const grad = item.grad || GRADS[idx % GRADS.length]
  const bg = item.img
    ? `url(${item.img}) center/cover`
    : `linear-gradient(155deg,#${grad})`

  return (
    <div className="prod-item reveal">
      <div className="prod-item-img" style={{ background: bg }} />
      <div className="prod-item-body">
        <div className="prod-item-name">{item.name}</div>
        <div className="prod-item-cta">
          <button onClick={() => navigate('/contact')}>Get Quote →</button>
        </div>
      </div>
    </div>
  )
}

function OnDemand() {
  return (
    <div className="prod-demand">
      <div className="prod-demand-text">
        <div className="prod-demand-title">On <em>Demand</em></div>
        <ul>
          <li>Any size, weight, and shape can be produced to your specification.</li>
          <li>Private labels and brands can be placed on every order.</li>
        </ul>
      </div>
      <div className="prod-demand-img" role="img" aria-label="Bulk export packaging" />
    </div>
  )
}

export default function Products() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('edible')
  const [decorSub, setDecorSub] = useState(null)
  useReveal()

  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab)
  }, [location.state])

  // Re-run reveal when tab changes
  useEffect(() => {
    const t = setTimeout(() => {
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
        { threshold: 0.1 }
      )
      document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el) => {
        if (!el.classList.contains('visible')) obs.observe(el)
      })
    }, 80)
    return () => clearTimeout(t)
  }, [activeTab, decorSub])

  const cat = PRODUCTS[activeTab]

  return (
    <div id="page-products" className="page active">
      {/* BANNER */}
      <div className="prod-hero-banner">
        <div className="tag">Our Products</div>
        <h1 className="sec-title white">Complete Himalayan Salt<br /><em>Product Range</em></h1>
        <p>Every product sourced directly from Pakistan's finest mines, processed in our own facility, and available in custom packaging.</p>
      </div>

      {/* TABS */}
      <div className="prod-tabs-wrap">
        <div className="prod-tabs">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              className={`prod-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => { setActiveTab(id); setDecorSub(null) }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* PANEL */}
      <div className="prod-panel-page active" id={`pp-${activeTab}`}>
        <div className="prod-section">

          {/* DECOR: top-level subcategories */}
          {activeTab === 'decor' && !decorSub && (
            <>
              <div className="prod-section-header reveal">
                <div className="psh-left">
                  <div className="tag">Décor and Lamps</div>
                  <h2 className="sec-title">Hand-Carved Salt<br /><em>Décor and Lighting</em></h2>
                  <p>Beautifully hand-carved Himalayan salt products for home, hotel, and spa. Browse by category below — every piece is available with UL and CE-certified fittings, in custom sizes and private-label packaging.</p>
                </div>
                <div className="psh-img" style={{ background: `linear-gradient(155deg,${cat.pshGrad})` }} />
              </div>
              <div id="decorLanding" className="decor-subcat-grid">
                {cat.subcats.map(({ id, label, grad }) => (
                  <div key={id} className="subcat-card reveal" onClick={() => setDecorSub(id)}>
                    <div className="subcat-img" style={{ background: `linear-gradient(155deg,#${grad})` }} />
                    <div className="subcat-ov" />
                    <div className="subcat-body">
                      <div className="subcat-name">{label}</div>
                      <span className="subcat-cta">View Products →</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* DECOR: sub-panel */}
          {activeTab === 'decor' && decorSub && (
            <div className="decor-sub-panel active">
              <button className="decor-back" onClick={() => setDecorSub(null)}>← All Décor Categories</button>
              <div className="decor-sub-head reveal">
                <div className="tag">Décor and Lamps · {cat.subcats.find(s => s.id === decorSub)?.label}</div>
                <h2 className="sec-title" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>
                  {cat.subcats.find(s => s.id === decorSub)?.label}<br /><em>Salt Lamps</em>
                </h2>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, maxWidth: 620, marginTop: 12 }}>
                  {cat.subcats.find(s => s.id === decorSub)?.desc}
                </p>
              </div>
              <div className="prod-items-grid">
                {(cat.subItems[decorSub] || []).map((name, i) => (
                  <div key={name} className="prod-item reveal">
                    <div className="prod-item-img" style={{ background: `linear-gradient(155deg,#${GRADS[i % GRADS.length]})` }} />
                    <div className="prod-item-body">
                      <div className="prod-item-name">{name}</div>
                      <div className="prod-item-cta">
                        <button onClick={() => navigate('/contact')}>Get Quote →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <OnDemand />
              <div className="prod-table-wrap">
                <table className="prod-table">
                  <thead><tr><th>Product Name</th><th>Size / Grade</th><th>Packaging</th><th>MOQ (Min Order)</th><th>Price</th></tr></thead>
                  <tbody>
                    {(cat.subItems[decorSub] || []).map(name => (
                      <tr key={name}>
                        <td>{name}</td><td>—</td><td>—</td><td>—</td>
                        <td className="pt-action"><button onClick={() => navigate('/contact')}>Get Quote →</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ALL OTHER CATEGORIES */}
          {activeTab !== 'decor' && (
            <>
              <div className="prod-section-header reveal">
                <div className="psh-left">
                  <div className="tag">{cat.title}</div>
                  <h2 className="sec-title">{cat.title.split(' ').slice(0,2).join(' ')}<br /><em>{cat.title.split(' ').slice(2).join(' ') || cat.title}</em></h2>
                  <p>{cat.desc}</p>
                </div>
                <div className="psh-img" style={{ background: `linear-gradient(155deg,${cat.pshGrad})` }} />
              </div>
              <div className="prod-items-grid">
                {(cat.items || []).map((item, i) => (
                  <ProductItem key={item.name} item={item} idx={i} navigate={navigate} />
                ))}
              </div>
              <OnDemand />
              <div className="prod-table-wrap">
                <table className="prod-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      {cat.table?.[0]?.art && <th>Art#</th>}
                      {cat.table?.[0]?.weight && <th>Weight (kg)</th>}
                      <th>Size / Grade</th>
                      <th>Packaging</th>
                      {cat.table?.[0]?.moq && <th>MOQ (Min Order)</th>}
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(cat.table || []).map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        {row.art !== undefined && <td>{row.art}</td>}
                        {row.weight !== undefined && <td>{row.weight}</td>}
                        <td>{row.size || '—'}</td>
                        <td>{row.packing || '—'}</td>
                        {row.moq !== undefined && <td>{row.moq}</td>}
                        <td className="pt-action">
                          <button onClick={() => navigate('/contact')}>Get Quote →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
