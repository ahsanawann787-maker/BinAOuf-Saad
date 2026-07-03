import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import api from '../services/api'
import HomeTicker from '../components/HomeTicker'
import cooking from '../assets/images/cooking_slider.jpg'
import bath from '../assets/images/bath_slider.jpg'
import wallPanels from '../assets/images/wall_panels_slider.jpg'
import bulkExport from '../assets/images/bulk_export_slider.jpg'
import colorGraded from '../assets/images/color_graded_slider.jpg'
import spaWalls from '../assets/images/spa_walls_slider.jpg'
import saltTherapy from '../assets/images/salt_therapy_slider.jpg'
import saunaRetreat from '../assets/images/sauna_retreat_slider.jpg'

const SLIDER_CATEGORIES = [
  { id: 'decor', title: 'Décor and Lamps', desc: 'Hand-carved salt lamps, fire bowls and ambient lighting pieces.', grad: 'd4876b,5c2318' },
  { id: 'bath', title: 'Bath and Spa', desc: 'Therapeutic bath salts, body scrubs and spa wellness sets.', grad: 'e8b090,7a3828' },
  { id: 'decor', title: 'Candle Salt Holders', desc: 'Tea light holders carved in round, heart and cube shapes.', grad: 'e0a880,8a4828' },
  { id: 'animal', title: 'Animal Lick Salt', desc: 'Natural mineral blocks for cattle, horses, sheep and goats.', grad: 'c47058,5c2318' },
  { id: 'edible', title: 'Edible Salt', desc: 'Fine grain, coarse, iodized and gourmet cooking salt.', grad: 'e89a7a,7a3020' },
  { id: 'edible', title: 'Rock Salt', desc: 'Raw natural rock salt lumps and bulk grades for grinders and gourmet use.', grad: 'd4a882,9b5040' },
  { id: 'decor', title: 'Kitchen and Accessories', desc: 'Cooking slabs and serving accessories for chefs.', grad: 'c9a96e,7a4020' },
  { id: 'tilesbricks', title: 'Salt Tiles and Bricks', desc: 'The Building Blocks of Glowing warmth and Lasting wellness.', grad: 'c9a96e,7a4020' },
]

const SLIDES = [
  { img: cooking, alt: 'Cooking on Pure Salt', tag: 'In Every Setting', title: 'Sear on Salt Blocks', desc: 'Sear and grill directly on a Himalayan salt block for a natural seasoning no pan can match.' },
  { img: bath, alt: 'Bath & Spa Bars', tag: 'In Every Setting', title: 'Spa Salt Bars', desc: 'Hand-cut salt bars for spas, gifting and wellness retail, tied and tagged for shipping.' },
  { img: wallPanels, alt: 'Backlit Wall Panels', tag: 'In Every Setting', title: 'Illuminated Walls', desc: 'Custom salt panels installed and illuminated for a warm, ambient glow in any room.' },
  { img: bulkExport, alt: 'Bulk Export Packaging', tag: 'In Every Setting', title: 'Bulk Export Ready', desc: '25KG and 50KG export-ready bags, palletized and forklift-loaded for worldwide shipping.' },
  { img: colorGraded, alt: 'Graded by Colour', tag: 'In Every Setting', title: 'Colour Graded Salt', desc: 'From deep rose to soft ivory, every batch is hand-sorted by grade and mineral tone.' },
  { img: spaWalls, alt: 'Spa & Wellness Walls', tag: 'In Every Setting', title: 'Therapeutic Salt Walls', desc: 'Therapeutic salt-tile walls and soaking tubs designed for luxury bathrooms and spas.' },
  { img: saltTherapy, alt: 'Salt Therapy Rooms', tag: 'In Every Setting', title: 'Halotherapy Rooms', desc: 'Calming backlit salt brick walls built for massage suites and halotherapy treatments.' },
  { img: saunaRetreat, alt: 'Sauna & Retreat Interiors', tag: 'In Every Setting', title: 'Sauna Interiors', desc: 'Premium salt sauna walls and retreat room builds from custom-cut bricks.' },
]

const GRADS = [
  'd4876b,5c2318',
  'e8b090,7a3828',
  'e0a880,8a4828',
  'c47058,5c2318',
  'e89a7a,7a3020',
  'd4a882,9b5040',
  'c9a96e,7a4020'
]

export default function Home() {
  useReveal()
  const navigate = useNavigate()
  const [slideIdx, setSlideIdx] = useState(0)
  const [homeCats, setHomeCats] = useState(SLIDER_CATEGORIES)

  useEffect(() => {
    let active = true
    async function fetchHomeCats() {
      try {
        const res = await api.getPublicCategories()
        if (active && res?.data && res.data.length > 0) {
          const mapped = res.data.map((item, idx) => ({
            id: item.id,
            title: item.name,
            desc: item.desc,
            img: item.img || '',
            grad: GRADS[idx % GRADS.length]
          }))
          setHomeCats(mapped)
        }
      } catch (err) {
        console.error('Failed to load home categories from DB:', err)
      }
    }
    fetchHomeCats()
    return () => { active = false }
  }, [])

  const goSlide = (dir) => {
    setSlideIdx((i) => (i + dir + SLIDES.length) % SLIDES.length)
  }

  const navToProducts = (tab) => navigate('/products', { state: { tab } })

  return (
    <div id="page-home" className="page active">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-tag">Straight from Khewra, Warcha and Kalabagh.</div>
          <h1 className="hero-h1">Nature's Purest<br /><em>Salt</em> Delivered<br />to the World</h1>
          <p className="hero-sub">Crafted by Nature. Delivered by Bin Aouf.</p>

          <p className="hero-p">
            Bin Aouf brings you the finest Himalayan pink salt, ethically sourced from Pakistan's ancient mines.
            Edible, wellness, décor, and livestock salt for global buyers.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/products')}>Explore Products →</button>
            <button className="btn-outline" onClick={() => navigate('/contact')}>Request a Quote</button>
          </div>
          <div className="hero-stats">
            <div><span className="stat-n">250M+</span><span className="stat-l">Years Old Salt</span></div>
            <div><span className="stat-n">99.9%</span><span className="stat-l">NaCl Purity</span></div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <HomeTicker />

      {/* ── SHOP BY CATEGORY ── */}
      <section className="home-cats">
        <div className="home-cats-header reveal">
          <div className="tag center">Product Categories</div>
          <h2 className="sec-title">Salt in Every<br /><em>Form and Purpose</em></h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '500px', margin: '16px auto 0', fontWeight: 300, lineHeight: 1.85 }}>
            Seven complete product ranges sourced from Pakistan's finest mines.
          </p>
          <div style={{ marginTop: '28px' }}>
            <button className="btn-primary" onClick={() => navigate('/products')}>
              View All Products →
            </button>
          </div>
        </div>
        <div className="cats-slider-outer">
          <div className="cats-slider-track" id="catsSliderTrack">
            {homeCats.map(({ id, title, desc, grad, img }, index) => (
              <div
                key={`${id}-${index}`}
                className="cat-card cat-slide-card"
                onClick={() => navToProducts(id)}
              >
                <div
                  className="cat-img-bg"
                  style={img
                    ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: `linear-gradient(155deg,#${grad})` }
                  }
                />
                <div className="cat-overlay" />
                <div className="cat-body">
                  <div className="cat-name">{title}</div>
                  <div className="cat-desc">{desc}</div>
                  <span className="cat-cta">View Products →</span>
                </div>
              </div>
            ))}
            {/* Duplicate for infinite loop */}
            {homeCats.map(({ id, title, desc, grad, img }, index) => (
              <div
                key={`${id}-${index}-dup`}
                className="cat-card cat-slide-card"
                onClick={() => navToProducts(id)}
                aria-hidden="true"
              >
                <div
                  className="cat-img-bg"
                  style={img
                    ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: `linear-gradient(155deg,#${grad})` }
                  }
                />
                <div className="cat-overlay" />
                <div className="cat-body">
                  <div className="cat-name">{title}</div>
                  <div className="cat-desc">{desc}</div>
                  <span className="cat-cta">View Products →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVATE LABEL & BRANDING ── */}
      <section className="home-why">
        <div className="pl-split">
          <div className="pl-left reveal">
            <div className="tag">Private Label &amp; Branding</div>
            <h2 className="sec-title">Your Brand,<br /><em>On Our Salt</em></h2>
            <p className="pl-intro">
              We handle the salt — you own the shelf. From label and packaging design to finished,
              retail-ready units, Bin Aouf produces private-label Himalayan salt under your name, built to sell the day it lands.
            </p>
            <div className="pl-feats">
              <div className="pl-feat">
                <div className="pl-feat-ico">✦</div>
                <div className="pl-feat-txt">
                  <h4>Custom Packaging &amp; Label Design</h4>
                  <p>Pouches, jars, grinders and gift sets designed around your brand identity.</p>
                </div>
              </div>
              <div className="pl-feat">
                <div className="pl-feat-ico">✦</div>
                <div className="pl-feat-txt">
                  <h4>Low MOQs, Built to Scale</h4>
                  <p>Friendly minimums let new and growing brands start small and grow fast.</p>
                </div>
              </div>
              <div className="pl-feat">
                <div className="pl-feat-ico">✦</div>
                <div className="pl-feat-txt">
                  <h4>100% Your Brand</h4>
                  <p>Your logo, colours and story on every unit — we stay completely invisible.</p>
                </div>
              </div>
              <div className="pl-feat">
                <div className="pl-feat-ico">✦</div>
                <div className="pl-feat-txt">
                  <h4>Sample to Shelf, Fast</h4>
                  <p>Sample kits in 3–5 days, production dispatched within 7–15 days.</p>
                </div>
              </div>
            </div>
            <button className="btn-primary" onClick={() => navigate('/contact')}>Start Your Private Label →</button>
          </div>

          <div className="pl-right reveal">
            <div className="pl-accent"></div>
            <div className="pl-frame">
              <div className="pl-ph">
                <div className="pl-ph-ico">🏷️</div>
                <span>Private Label Visual</span>
              </div>
            </div>
            <div className="pl-badge"><b>Low MOQ</b><small>Start Small, Scale Fast</small></div>
          </div>
        </div>
      </section>

      {/* ── FULL-BLEED SLIDER ── */}
      <section className="full-slider-sec">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`full-slide${i === slideIdx ? ' slide-active' : ''}`}
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="full-slide-overlay" />
            <div className="full-slide-cap">
              <div className="full-slide-tag">{slide.tag}</div>
              <div className="full-slide-name">{slide.title}</div>
              <div className="full-slide-desc">{slide.desc}</div>
            </div>
          </div>
        ))}
        <div className="slide-controls">
          <button className="slide-btn" onClick={() => goSlide(-1)}>‹</button>
          <span className="slide-counter">{slideIdx + 1} / {SLIDES.length}</span>
          <button className="slide-btn" onClick={() => goSlide(1)}>›</button>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="home-testi">
        <div className="reveal">
          <div className="tag center">Why Choose Us</div>
          <h2 className="sec-title" style={{ textAlign: 'center', color: 'white', marginBottom: '50px' }}>
            Why Global Buyers<br /><em style={{ color: 'var(--gold-lt)' }}>Choose Bin Aouf</em>
          </h2>
        </div>
        <div className="whyus-grid">
          {[
            { icon: '🏭', title: 'Direct From Source', desc: 'We source directly from Khewra, Warcha and Kalabagh mines, no middlemen, so pricing and purity stay in your control.' },
            { icon: '🔬', title: 'Lab Tested Every Batch', desc: 'Every batch is independently tested for NaCl purity, 84 trace minerals and heavy metals before it ever leaves our facility.' },
            { icon: '📦', title: 'Private Label and Custom Packaging', desc: 'Your brand, your packaging design, our salt. Low MOQs make it easy for new and growing brands to start.' },
            { icon: '🚢', title: 'Global Export Ready', desc: 'FOB Karachi or CIF to your port, with full documentation including COA, Halal certificate and phytosanitary handled by us.' },
            { icon: '🤝', title: 'Dedicated Account Manager', desc: 'A single point of contact via WhatsApp, email or video call guides you from first sample to final shipment.' },
            { icon: '⚡', title: 'Fast Turnaround', desc: 'Standard orders are dispatched in 7 to 15 days, and sample kits ship within 3 to 5 business days.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="cert-card reveal">
              <div className="cert-icon">{icon}</div>
              <div className="cert-name">{title}</div>
              <div className="cert-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="tag center reveal" style={{ color: 'var(--gold-lt)' }}>Ready to Start?</div>
          <h2 className="sec-title white reveal" style={{ marginTop: 12 }}>
            Get a Free Quote in <em>24 Hours</em>
          </h2>
          <p className="reveal" style={{ color: 'rgba(255,255,255,.72)', marginTop: 16, marginBottom: 32, fontSize: 15 }}>
            Sample kits ship within 3 to 5 business days. Full orders within 7 to 15 days.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/contact')}>Request a Quote →</button>
            <a href="https://wa.me/923110282668" target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
