import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import api, { API } from '../services/api'

const TIMELINE = [
  { year: '2017', title: 'Founded in Punjab', desc: 'Started as a wholesale supplier of raw Himalayan salt to local distributors.' },
  { year: '2018', title: 'Processing Facility', desc: 'Built our own grading, washing, and packaging facility in Khushab district.' },
  { year: '2026', title: '', desc: 'Now exporting worldwide with full private label services for international brands.' },
]

const STATS = [
  { n: '99.9%', l: 'NaCl Purity' },
  { n: '84+', l: 'Trace Minerals' },
  { n: '250M', l: 'Years Old Salt' },
]

const CERTS = [
  { icon: '🏅', name: 'ISO 22000:2018', desc: 'Food Safety Management System certified. Our processing facility meets international food handling standards.' },
  { icon: '🏅', name: 'ISO 9001:2015', desc: 'Quality Management System certified. Our processes meet international quality standards.' },
  { icon: '🌙', name: 'Halal Certified', desc: 'All edible products carry a valid Halal certificate, suitable for Muslim-majority markets worldwide.' },
  { icon: '🛡️', name: 'FDA Compliant', desc: 'Our edible salt products comply with US FDA food safety regulations for North American distribution.' },
  { icon: '🌿', name: 'Natural and Organic', desc: 'No additives, no artificial colouring, no anti-caking agents. Pure as nature intended.' },
  { icon: '🏆', name: 'Pakistan Standards', desc: 'Our edible salt products comply with Pakistan\'s national food safety regulations.' },
  { icon: '✡️', name: 'Kosher Certificate', desc: 'Our edible salt is certified Kosher, produced and handled in accordance with Jewish dietary laws for trusted global export.' },
]

const MINES = [
  {
    n: '01', icon: '⛰️', name: 'Khewra Salt Mine', loc: '📍 Jhelum District, Punjab',
    desc: 'The second largest salt mine on Earth and most famous source of Himalayan pink salt. Primary source for edible salt, décor lamps, and bath salt ranges.',
    stats: [{ n: '99%', l: 'NaCl Purity' }, { n: 'Deep', l: 'Pink Crystals' }, { n: 'Food', l: 'Grade' }],
  },
  {
    n: '02', icon: '🏔️', name: 'Warcha Salt Mine', loc: '📍 Sargodha District, Punjab',
    desc: 'Known for deep White and Pink crystals with up to 99% NaCl content. Primary source for food-grade iodized salt and high-purity animal lick blocks.',
    stats: [{ n: '99%', l: 'NaCl Purity' }, { n: 'Deep', l: 'White and Pink Crystals' }, { n: 'Food', l: 'Grade' }],
  },
  {
    n: '03', icon: '💎', name: 'Kalabagh Salt Mine', loc: '📍 Mianwali District, Punjab',
    desc: 'Situated along the Indus River, it produces food-grade salt with 84+ minerals and deep red crystals.',
    stats: [{ n: '84+', l: 'Minerals' }, { n: 'Deep', l: 'Red Crystals' }, { n: 'Food', l: 'Grade' }],
  },
]

export default function About() {
  useReveal()
  const navigate = useNavigate()
  const [certs, setCerts] = useState([])  // start empty, always filled by API
  const [certsLoaded, setCertsLoaded] = useState(false)

  useEffect(() => {
    async function loadCerts() {
      try {
        const res = await api.getPublicCertifications()
        if (res?.data) {
          setCerts(res.data)  // always use DB data - all certs, any count
        } else {
          setCerts(CERTS)  // fallback only if API returns nothing
        }
      } catch (err) {
        console.error('Failed to load certs:', err)
        setCerts(CERTS)  // fallback on error
      } finally {
        setCertsLoaded(true)
      }
    }
    loadCerts()
  }, [])

  // Re-run reveal observer after certs load so all cards animate in
  useEffect(() => {
    if (!certsLoaded) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el) => {
      if (!el.classList.contains('visible')) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [certsLoaded])

  function getImageUrl(img) {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
      return img;
    }
    const base = API.replace(/\/api$/, '');
    return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
  }

  return (
    <div id="page-about" className="page active">
      {/* BANNER */}
      <div className="about-banner">
        <div className="tag">Who We Are</div>
        <h1 className="sec-title white">Born from the<br /><em>Mountains of Pakistan</em></h1>
        <p>Bin Aouf is a Pakistan-based manufacturer,local supplier, and exporter of premium Himalayan salt products, sourcing directly from Khewra, Warcha, and Kalabagh since 2008.</p>
      </div>

      {/* SPLIT */}
      <div className="about-split">
        <div className="about-split-left reveal-l">
          <div className="tag">Our Mission</div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(24px,3vw,40px)', marginBottom: 20 }}>Bringing Pakistan's<br /><em>Mineral Heritage</em> to the World</h2>
          <p>Bin Aouf was founded by a family with deep roots in the salt trade. Over 15 years, we have grown from a local wholesale supplier into a fully integrated Himalayan salt manufacturer,local supplier, and exporter, operating our own processing facility and shipping to countries worldwide.</p>
          <p style={{ marginTop: 14 }}>Our mission is simple: deliver the purest, most authentic Himalayan salt products on earth, with integrity, transparency, and quality that speaks for itself.</p>
          <div className="about-boxes">
            {STATS.map(({ n, l }) => (
              <div key={l} className="about-box">
                <span className="ab-n">{n}</span>
                <div className="ab-l">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRIVATE LABEL */}
        <div className="about-split-right reveal-r" id="privatelabel">
          <div className="tag">Private Labelling</div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(24px,3vw,40px)', marginBottom: 20 }}>Your Brand on the<br /><em>World's Finest Salt</em></h2>
          <p>We manufacture, you brand. Bin Aouf runs a complete private-label and white-label programme — your logo, your packaging, your market, backed by our own mines, processing facility, and full export infrastructure.</p>
          <div className="feats">
            <div className="feat">
              <div className="feat-icon">🏷️</div>
              <h4>Custom Branding</h4>
              <p>Your logo, colours, and identity on every pack. You own the brand; we handle the salt.</p>
            </div>
            <div className="feat">
              <div className="feat-icon">🚢</div>
              <h4>Export-Ready Delivery</h4>
              <p>Production to Ex-Factory or FOB shipping with full documentation, delivered to your port.</p>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <button className="btn-primary" onClick={() => navigate('/contact')}>Start Your Private Label →</button>
          </div>
        </div>
      </div>

      {/* STORY / TIMELINE */}
      <div className="about-story-sec">
        <div className="story-inner">
          <div className="reveal-l">
            <div className="story-card">
              <span className="story-big-icon">⛰️</span>
              <div className="story-caption">Khewra Salt Mines</div>
              <div className="story-sub">Punjab, Pakistan. 2nd Largest in the World</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', lineHeight: 1.8, fontWeight: 300, marginTop: 16, position: 'relative', zIndex: 1 }}>
                From deep within the ancient Himalayan salt range, we bring nature's finest mineral treasure to the world, untouched, unprocessed, and full of life-giving minerals.
              </div>
            </div>
          </div>
          <div className="reveal-r">
            <div className="tag">Our Journey</div>
            <h2 className="sec-title" style={{ fontSize: 'clamp(26px,3vw,42px)', marginBottom: 20 }}>A Legacy of<br /><em>Salt and Trust</em></h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, marginBottom: 14 }}>
              Bin Aouf began as a small family operation supplying local markets in Punjab. Over the years, we grew our expertise, invested in modern processing facilities, and began exporting to international buyers worldwide.
            </p>
            <div className="timeline">
              {TIMELINE.map(({ year, title, desc }) => (
                <div key={year} className="tl-item">
                  <div className="tl-year">{year}</div>
                  <div className="tl-text">
                    {title && <h5>{title}</h5>}
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CERTIFICATIONS */}
      <div className="certs-sec">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="tag center" style={{ color: 'var(--gold-lt)' }}>Our Credentials</div>
          <h2 className="sec-title white" style={{ textAlign: 'center' }}>Certified, Tested and<br /><em>Globally Compliant</em></h2>
        </div>
        <div className="certs-grid">
          {certs.map(({ icon, emoji, title, name, desc, img }, idx) => {
            const displayImg = getImageUrl(img)
            return (
              <div key={idx} className="cert-card reveal">
                {displayImg ? (
                  <div style={{ width: 48, height: 48, marginBottom: 16, backgroundImage: `url("${displayImg}")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center' }} />
                ) : (
                  <div className="cert-icon">{emoji || icon || '🏅'}</div>
                )}
                <div className="cert-name">{title || name}</div>
                <div className="cert-desc">{desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* MINES */}
      <div className="mines-sec">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="tag center">Our Salt Sources</div>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>Three World-Class<br /><em>Mine Sources</em></h2>
        </div>
        <div className="mines-grid">
          {MINES.map(({ n, icon, name, loc, desc, stats }) => (
            <div key={n} className="mine-card reveal">
              <div className="mine-bg-n">{n}</div>
              <span className="mine-icon">{icon}</span>
              <div className="mine-name">{name}</div>
              <div className="mine-loc">{loc}</div>
              <div className="mine-desc">{desc}</div>
              <div className="mine-stats">
                {stats.map(({ n: sn, l }) => (
                  <div key={l} className="mine-stat">
                    <span className="mine-stat-n">{sn}</span>
                    <span className="mine-stat-l">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
