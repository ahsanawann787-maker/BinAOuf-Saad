import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
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

function ProductItem({ item, idx, navigate, onSelect }) {
  const grad = GRADS[idx % GRADS.length];

  let displayImg = getImageUrl(item.img);
  if (!displayImg) {
    if (item.name?.includes('Pink Salt Tiles')) displayImg = pinkTiles;
    if (item.name?.includes('Cooking Slab')) displayImg = cookingSlab;
  }

  // Combine primary and gallery images
  const allImages = [];
  if (displayImg) allImages.push(displayImg);
  if (Array.isArray(item.imgs)) {
    item.imgs.forEach(i => {
      const u = getImageUrl(i);
      if (u && !allImages.includes(u)) allImages.push(u);
    });
  }

  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-play product card slideshow if there are multiple images
  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % allImages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [allImages.length]);

  const activeImg = allImages[currentIdx];
  const bg = activeImg
    ? `url("${activeImg}") center/cover no-repeat`
    : `linear-gradient(155deg,#${grad})`;

  return (
    <div
      className="prod-item reveal"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(item)
        }
      }}
    >
      <div className="prod-item-img" style={{ background: bg, transition: 'background 0.5s ease-in-out' }} />
      <div className="prod-item-body">
        <div className="prod-item-name">{item.name}</div>
        <div className="prod-item-desc" style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 12px', fontWeight: 300, lineHeight: 1.5 }}>
          {item.desc || 'Premium quality Himalayan salt product.'}
        </div>
        {allImages.length > 1 && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 8, justifyContent: 'center' }}>
            {allImages.map((_, dotIdx) => (
              <span
                key={dotIdx}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: dotIdx === currentIdx ? 'var(--terra)' : 'var(--border)',
                  transition: 'background 0.3s'
                }}
              />
            ))}
          </div>
        )}
        <div className="prod-item-cta">
          <button onClick={(e) => { e.stopPropagation(); navigate('/contact') }}>Get Quote →</button>
          <button className="prod-item-view" onClick={(e) => { e.stopPropagation(); onSelect(item) }}>View Details</button>
        </div>
      </div>
    </div>
  )
}

function ProductDetailModal({ product, onClose, navigate }) {
  if (!product) return null

  let displayImg = getImageUrl(product.img)
  if (!displayImg) {
    if (product.name?.includes('Pink Salt Tiles')) displayImg = pinkTiles
    if (product.name?.includes('Cooking Slab')) displayImg = cookingSlab
  }

  // Combine primary and gallery images
  const allImages = [];
  if (displayImg) allImages.push(displayImg);
  if (Array.isArray(product.imgs)) {
    product.imgs.forEach(i => {
      const u = getImageUrl(i);
      if (u && !allImages.includes(u)) allImages.push(u);
    });
  }

  const [activeIdx, setActiveIdx] = useState(0)

  const handlePrev = (e) => {
    e.stopPropagation()
    setActiveIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setActiveIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const specs = Object.entries(product.specs || {}).filter(([, value]) => {
    const text = String(value ?? '').trim()
    return text && text !== '—' && text !== '-'
  })

  const mediaBg = allImages.length > 0 && allImages[activeIdx]
    ? `url("${allImages[activeIdx]}")`
    : 'linear-gradient(155deg,#e8c0a0,#c07050)';

  return (
    <div className="product-detail-backdrop" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="product-detail-close" onClick={onClose} aria-label="Close product details">×</button>
        
        {/* Interactive Image Slider */}
        <div 
          className="product-detail-media" 
          style={{ 
            backgroundImage: mediaBg, 
            transition: 'background-image 0.4s ease-in-out',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px'
          }}
        >
          {allImages.length > 1 && (
            <>
              {/* Arrow Left */}
              <button 
                onClick={handlePrev}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontSize: 18,
                  color: 'var(--ink)',
                  fontWeight: 'bold',
                  zIndex: 2,
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ‹
              </button>

              {/* Arrow Right */}
              <button 
                onClick={handleNext}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontSize: 18,
                  color: 'var(--ink)',
                  fontWeight: 'bold',
                  zIndex: 2,
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ›
              </button>

              {/* Slide Indicators / Dots */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 8,
                  background: 'rgba(0,0,0,0.4)',
                  padding: '6px 12px',
                  borderRadius: 20,
                  zIndex: 2
                }}
              >
                {allImages.map((_, idx) => (
                  <span 
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveIdx(idx); }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: idx === activeIdx ? '#ffffff' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="product-detail-body">
          <div className="tag">Product Details</div>
          <h3>{product.name}</h3>
          <p>{product.desc || 'Premium quality Himalayan salt product crafted for demanding wholesale and private-label buyers.'}</p>
          {specs.length > 0 && (
            <div className="product-detail-specs">
              {specs.map(([key, value]) => (
                <div className="product-detail-spec" key={key}>
                  <strong>{key}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}
          <button className="btn-primary" onClick={() => navigate('/contact')}>Request a Quote</button>
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
  const { categoryId } = useParams()

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('edible')
  const [selectedSubcat, setSelectedSubcat] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useReveal()

  const mapTabId = (id) => {
    if (id === 'tilesbricks') return 'tiles';
    if (id === 'candles') return 'candle';
    if (id === 'rocksalt') return 'rock';
    return id;
  }

  const selectCategory = (id) => {
    const normalized = mapTabId(id)
    setActiveTab(normalized)
    navigate(`/products/${normalized}`)
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
            const requested = categoryId ? mapTabId(categoryId) : location.state?.tab ? mapTabId(location.state.tab) : null
            const fallback = requested && catsRes.data.some((c) => c.id === requested)
              ? requested
              : catsRes.data[0]?.id
            setActiveTab(fallback)
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
  }, [categoryId, location.state])

  useEffect(() => {
    if (!categories.length) return
    const requested = categoryId ? mapTabId(categoryId) : null
    const fallback = requested && categories.some((c) => c.id === requested)
      ? requested
      : activeTab
    if (fallback !== activeTab) {
      setActiveTab(fallback)
    }
    setSelectedProduct(null)
  }, [categories, categoryId, activeTab])

  useEffect(() => {
    if (!categories.length) return
    const current = categories.find(c => c.id === (categoryId ? mapTabId(categoryId) : activeTab)) || categories[0]
    const firstSub = current?.subcategories?.[0]?.id || ''
    setSelectedSubcat(firstSub)
  }, [categoryId, categories])

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
  }, [activeTab, selectedSubcat, loading])

  if (loading) {
  return (
    <div id="page-products" className="page active">

      <SEO
        title="Premium Himalayan Pink Salt Products | Bin Aouf Pakistan"
        description="Explore Bin Aouf's premium Himalayan Pink Salt collection including edible salt, salt lamps, bath salt, cooking slabs, animal lick salt, spa products, salt tiles, and wholesale export solutions worldwide."
        canonical="https://www.binaouf.com/products"
      />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--muted)' }}>
        <div style={{ fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Loading Products...
        </div>
      </div>

    </div>
  )
}

  if (error || categories.length === 0) {
  return (
    <div id="page-products" className="page active">

      <SEO
        title="Premium Himalayan Pink Salt Products | Bin Aouf Pakistan"
        description="Explore Bin Aouf's premium Himalayan Pink Salt collection including edible salt, salt lamps, bath salt, cooking slabs, animal lick salt, spa products, salt tiles, and wholesale export solutions worldwide."
        canonical="https://www.binaouf.com/products"
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          color: 'var(--muted)',
          gap: 16
        }}
      >
        <div style={{ fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {error || 'No categories found.'}
        </div>

        <button
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>

    </div>
  )
}

  const normalizeSubcat = (value) => {
    if (value === null || value === undefined || value === '') return ''
    return String(value)
      .trim()
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const isCardVisible = (p) => {
    // Undefined = legacy behavior -> show in cards
    if (p.showInCard === undefined) return true
    // Null or explicit null -> do not show
    if (p.showInCard === null) return false
    // Strings like 'false' should be treated as false
    if (typeof p.showInCard === 'string') {
      const v = p.showInCard.trim().toLowerCase()
      if (v === 'false' || v === '0' || v === 'no') return false
      if (v === 'true' || v === '1' || v === 'yes') return true
    }
    return Boolean(p.showInCard)
  }

  const currentCat = categories.find(c => c.id === activeTab) || categories[0]
  const catIndex = categories.findIndex(c => c.id === currentCat.id)
  const catGrad = GRADS[catIndex % GRADS.length]
  const activeProducts = products.filter(p => p.cat === currentCat.id)
  const currentSubcats = currentCat?.subcategories || []
  const filteredBySubcat = activeProducts.filter((p) => {
    // If no subcategories defined for this category, show all active products
    if (!currentSubcats.length) return true

    const productSubcat = normalizeSubcat(p.subcat || p.subCategory || p.subcategory || p.categorySubcat)
    const selectedValue = normalizeSubcat(selectedSubcat)

    if (!productSubcat) return false
    return productSubcat === selectedValue
  })

  // Cards should only show products explicitly allowed for card view. Existing products without the flag default to visible in cards.
  const visibleProducts = filteredBySubcat.filter((p) => isCardVisible(p))
  // Table shows all filtered products (both card + table-only)
  const tableProducts = filteredBySubcat

  // Dynamically determine table columns based on specifications populated in active products
  const hasSpec = (key) => visibleProducts.some(p => p.specs?.[key] && p.specs[key] !== '—' && p.specs[key] !== '-')

  return (
  <div id="page-products" className="page active">

    <SEO
      title="Premium Himalayan Pink Salt Products | Bin Aouf Pakistan"
      description="Explore Bin Aouf's premium Himalayan Pink Salt collection including edible salt, salt lamps, bath salt, cooking slabs, animal lick salt, spa products, salt tiles, and wholesale export solutions worldwide."
      canonical="https://www.binaouf.com/products"
    />

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
              onClick={() => selectCategory(c.id)}
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
            <div className="psh-img" style={currentCat.img
                ? { backgroundImage: `url(${currentCat.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: `linear-gradient(155deg,${catGrad})` }
              } />
          </div>

          {currentSubcats.length > 0 && (
            <div className="prod-subcat-filter reveal">
              {currentSubcats.map((sub) => (
                <button
                  key={sub.id}
                  className={`prod-subcat-pill ${selectedSubcat === sub.id ? 'active' : ''}`}
                  onClick={() => setSelectedSubcat(sub.id)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {visibleProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontWeight: 300 }}>
              No products found in this category. Use the Admin Panel to add them!
            </div>
          ) : (
            <>
              <div className="prod-items-grid">
                {visibleProducts.map((product, i) => (
                  <ProductItem key={product.id || i} item={product} idx={i} navigate={navigate} onSelect={setSelectedProduct} />
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
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableProducts.map((product) => (
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

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          navigate={navigate}
        />
      )}
    </div>
  )
}
