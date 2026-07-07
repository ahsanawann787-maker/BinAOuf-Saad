import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import api, { API } from '../services/api'

// Fallback steps in case of load delay or API issue
const FALLBACK_STEPS = [
  {
    n: '01', title: 'Extraction and Mining',
    desc: 'Our mining operations at Khewra, Warcha, and Kalabagh follow strict ethical and environmental standards.',
    list: ['Room-and-pillar mining method', 'Skilled miners with 20+ years experience', 'Three mine sources for different grades'],
    grad: 'd4876b,5c2318',
    img: ''
  },
  {
    n: '02', title: 'Processing and Grading',
    desc: 'At our Sargodha facility, raw salt is washed, dried, then crushed and sieved to consistent particle sizes.',
    list: ['Purified water washing only', 'Separate food-grade and décor lines'],
    grad: 'c9a96e,7a4020',
    img: ''
  },
  {
    n: '03', title: 'Laboratory Testing',
    desc: 'Before any batch is packaged, it undergoes comprehensive testing at our in-house and independent certified lab.',
    list: ['NaCl purity minimum 99.9%', '84 trace mineral ICP analysis', 'Heavy metals within WHO limits'],
    grad: 'e8b090,7a3828',
    img: ''
  },
  {
    n: '04', title: 'Packaging and Branding',
    desc: 'From bulk sack filling to premium retail gift box assembly with custom labels for private label clients.',
    list: ['Food-grade inner lining for edible products', 'Custom label design and digital printing'],
    grad: 'e0a880,8a4828',
    img: ''
  },
  {
    n: '05', title: 'Documentation',
    desc: 'Complete trade documents for every shipment, experienced with customs across all major markets.',
    list: ['Commercial Invoice and Packing List', 'COA and MSDS', 'Phytosanitary and Halal Certificate', 'Certificate of Origin, SGS on request'],
    grad: 'c47058,5c2318',
    img: ''
  },
  {
    n: '06', title: 'Worldwide Shipping',
    desc: 'Shipping from Port Qasim Karachi via sea freight and Lahore and Karachi airports via air.',
    list: ['FCL and LCL sea freight', 'Air freight for urgent orders', 'FOB Karachi, CIF, DDP available', 'Real-time shipment tracking provided'],
    grad: 'e89a7a,7a3020',
    img: ''
  },
]

const QA_CHECKS = [
  { label: 'NaCl Purity Test:', detail: 'Minimum 99.9%, typically 99.95% for food grade' },
  { label: '84 Trace Mineral ICP Analysis:', detail: 'Full mineral profile in COA' },
  { label: 'Heavy Metals Screening:', detail: 'As, Pb, Cd, Hg all within WHO safe limits' },
  { label: 'Moisture and pH:', detail: 'Consistent results batch to batch' },
  { label: 'Inspection:', detail: 'All Raw Salt from mines is visually inspected and batch-sampled before processing.' },
]

const QA_STEPS = [
  { n: 1, title: 'Raw Material Inspection', desc: 'All raw salt from mines is visually inspected and batch-sampled before processing.' },
  { n: 2, title: 'In-Process Quality Checks', desc: 'Grading machines calibrated daily.' },
  { n: 3, title: 'Pre-Packaging Lab Test', desc: 'A sample from every production batch sent to our lab before packaging is approved.' },
  { n: 4, title: 'Pre-Shipment Final Check', desc: 'Packed cartons randomly opened and inspected for weight, integrity, and labelling.' },
]

function getImageUrl(img) {
  if (!img) return '';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  const base = API.replace(/\/api$/, '');
  return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
}

export default function Process() {
  const [steps, setSteps] = useState(FALLBACK_STEPS)

  useReveal()

  useEffect(() => {
    document.title = 'Our Extraction, Processing & Export Process — Bin Aouf'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Understand how we extract Himalayan salt ethically and wash, test, grade, package, and ship it to clients globally from Sargodha & Khewra.')
    }

    async function loadSteps() {
      try {
        const res = await api.getPublicProcessSteps()
        if (res?.data && res.data.length > 0) {
          setSteps(res.data)
        }
      } catch (err) {
        console.error('Failed to load dynamic process steps:', err)
      }
    }
    loadSteps()
  }, [])




  return (
    <div id="page-process" className="page active">
      {/* BANNER */}
      <div className="process-banner">
        <div className="tag">How It Works</div>
        <h1 className="sec-title white">From Ancient Mine<br /><em>to Your Doorstep</em></h1>
        <p>Every Bin Aouf product follows a rigorous 6-step journey from hand-picked raw salt inside Pakistan's mines, through our processing facility, quality lab, and packaging centre, to delivery at your port worldwide.</p>
      </div>

      {/* STEP NUMBERS */}
      <div className="proc-steps-sec">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="tag center">The Journey</div>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>Our 6-Step<br /><em>Process</em></h2>
        </div>
        <div className="proc-steps-grid reveal">
          {steps.map(({ n, title }, idx) => (
            <div key={idx} className="proc-step">
              <div className="proc-num">{n}</div>
              <div className="proc-step-title">{title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP DETAILS */}
      <div className="proc-detail-sec">
        <div className="proc-detail-grid">
          {steps.map(({ n, title, desc, list, grad, img, fit }, i) => {
            const displayImg = getImageUrl(img)
            return (
              <div key={i} className="pdc">
                <div 
                  className="pdc-img" 
                  style={displayImg 
                    ? { backgroundImage: `url("${displayImg}")`, backgroundSize: fit || 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
                    : { background: `linear-gradient(155deg,#${grad || 'd4876b,5c2318'})` }
                  }
                />
                <div className="pdc-body">
                  <div className="pdc-title">{title}</div>
                  <div className="pdc-desc">{desc}</div>
                  <ul className="pdc-list">
                    {Array.isArray(list) ? list.map((item, liIdx) => <li key={liIdx}>{item}</li>) : null}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* QUALITY ASSURANCE */}
      <div className="quality-sec">
        <div className="quality-inner">
          <div className="quality-visual reveal-l">
            <span className="q-big-icon">🔬</span>
            <h3>Our Quality Promise</h3>
            <p>Every batch of Bin Aouf salt is independently tested before it leaves our facility.</p>
            <div className="q-checks">
              {QA_CHECKS.map(({ label, detail }) => (
                <div key={label} className="qc">
                  <div className="qc-icon">✅</div>
                  <div className="qc-text"><strong>{label}</strong> {detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-r">
            <div className="tag">Quality Assurance</div>
            <h2 className="sec-title" style={{ fontSize: 'clamp(26px,3vw,42px)', marginBottom: 18 }}>Tested at Every<br /><em>Stage</em></h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, marginBottom: 24 }}>
              We welcome pre-shipment inspection by SGS, Bureau Veritas, or any third-party inspector of your choice at buyer's cost.
            </p>
            <div className="quality-steps">
              {QA_STEPS.map(({ n, title, desc }) => (
                <div key={n} className="qs">
                  <div className="qs-num">{n}</div>
                  <div className="qs-content">
                    <h5>{title}</h5>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
