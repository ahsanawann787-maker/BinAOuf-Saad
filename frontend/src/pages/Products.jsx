import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import api, { API } from '../services/api'
import pinkTiles from '../assets/images/pink_salt_tiles.jpg'
import cookingSlab from '../assets/images/cooking_slab.jpg'

const GRADS = [
  '#e8c0a0,#c07050',
  '#c47058,#5c2318',
  '#e8b090,#7a3828',
  '#d4876b,#5c2318',
  '#e8c0a0,#c07850',
  '#d9bb98,#8a5a35',
  '#e0a880,#8a4828',
  '#d4a882,#9b5040',
  '#c9a96e,#5c2318'
]

function getImageUrl(img) {
  if (!img) return '';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  const base = API.replace(/\/api$/, '');
  return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
}

function ProductItem({ item, idx, navigate }) {
  const grad = GRADS[idx % GRADS.length];
  
  // High-fidelity fallback for seeded demo items
  let displayImg = getImageUrl(item.img);
  if (!displayImg) {
    if (item.name?.includes('Pink Salt Tiles')) displayImg = pinkTiles;
    if (item.name?.includes('Cooking Slab')) displayImg = cookingSlab;
  }

  const bg = displayImg
    ? `url(${displayImg}) center/cover`
    : `linear-gradient(155deg,#${grad})`;

  return (
    <div className="prod-item reveal">
      <div className="prod-item-img" style={{ background: bg }} />
      <div className="prod-item-body">
        <div className="prod-item-name">{item.name}</div>
        <div className="prod-item-desc" style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 12px', fontWeight: 300, lineHeight: 1.5 }}>
          {item.desc || 'Premium quality Himalayan salt product.'}
        </div>
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
  
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('edible')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useReveal()

  const mapTabId = (id) => {
    if (id === 'tilesbricks') return 'tiles';
    if (id === 'candles') return 'candle';
    if (id === 'rocksalt') return 'rock';
    return id;
  }

  useEffect(() => {
    let active = true
    async function loadData() {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.getPublicCategories(),
          api.getPublicProducts()
        ])
        if (active) {
          if (catsRes?.data) {
            setCategories(catsRes.data)
            // Default activeTab to the first category if available
            if (catsRes.data.length > 0) {
              setActiveTab(catsRes.data[0].id)
            }
          }
          if (prodsRes?.data) {
            setProducts(prodsRes.data)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error('Error loading API data:', err)
        if (active) {
          setError('Failed to load products from database.')
          setLoading(false)
        }
      }
    }
    loadData()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(mapTabId(location.state.tab))
    }
  }, [location.state, categories])

  // Re-run reveal when tab changes
  useEffect(() => {
    if (loading) return
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
  }, [activeTab, loading])

  if (loading) {
    return (
      <div id="page-products" className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--muted)' }}>
        <div style={{ fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Loading Products...</div>
      </div>
    )
  }

  if (error || categories.length === 0) {
    return (
      <div id="page-products" className="page active" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--muted)', gap: 16 }}>
        <div style={{ fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{error || 'No categories found.'}</div>
        <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  const currentCat = categories.find(c => c.id === activeTab) || categories[0]
  const catIndex = categories.findIndex(c => c.id === currentCat.id)
  const catGrad = GRADS[catIndex % GRADS.length]
  const activeProducts = products.filter(p => p.cat === currentCat.id)

  // Dynamically determine table columns based on specifications populated in active products
  const hasSpec = (key) => activeProducts.some(p => p.specs?.[key] && p.specs[key] !== '—' && p.specs[key] !== '-')

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
          {categories.map((c) => (
            <button
              key={c.id}
              className={`prod-tab ${currentCat.id === c.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(c.id) }}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* PANEL */}
      <div className="prod-panel-page active" id={`pp-${currentCat.id}`}>
        <div className="prod-section">
          <div className="prod-section-header reveal">
            <div className="psh-left">
              <div className="tag">{currentCat.name}</div>
              <h2 className="sec-title">
                {currentCat.name.split(' ').slice(0, 2).join(' ')}
                <br />
                <em>{currentCat.name.split(' ').slice(2).join(' ') || 'Range'}</em>
              </h2>
              <p>{currentCat.desc || 'Premium grade Himalayan salt solutions.'}</p>
            </div>
            <div className="psh-img" style={{ background: `linear-gradient(155deg,${catGrad})` }} />
          </div>

          {activeProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontWeight: 300 }}>
              No products found in this category. Use the Admin Panel to add them!
            </div>
          ) : (
            <>
              <div className="prod-items-grid">
                {activeProducts.map((product, i) => (
                  <ProductItem key={product.id || i} item={product} idx={i} navigate={navigate} />
                ))}
              </div>

              <OnDemand />

              <div className="prod-table-wrap">
                <table className="prod-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      {hasSpec('art') && <th>Art#</th>}
                      {hasSpec('weight') && <th>Weight (kg)</th>}
                      {hasSpec('size') && <th>Size / Grade</th>}
                      {hasSpec('packing') && <th>Packaging</th>}
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        {hasSpec('art') && <td>{product.specs?.art || '—'}</td>}
                        {hasSpec('weight') && <td>{product.specs?.weight || '—'}</td>}
                        {hasSpec('size') && <td>{product.specs?.size || '—'}</td>}
                        {hasSpec('packing') && <td>{product.specs?.packing || '—'}</td>}
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
