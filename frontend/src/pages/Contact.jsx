import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import api from '../services/api'

const FAQS = [
  { q: 'What is the minimum order quantity (MOQ)?', a: 'MOQ varies by product. Samples start from 5 to 10kg. Wholesale from 100 to 500kg. Full container orders from 5 to 10 tons depending on product.' },
  { q: 'Can you do private label / white label packaging?', a: 'Yes. We offer full private label services including custom label design, box printing, and packaging in your brand name. MOQ is usually 100 to 200 units per SKU. NDA available.' },
  { q: 'How long does shipping take?', a: 'Production and packing: 7 to 15 days. Sea freight to Europe and USA: 20 to 30 days. Middle East: 10 to 15 days. Air freight: 3 to 7 days.' },
  { q: 'What certifications do your products have?', a: 'ISO 22000 certified, Halal certified, FDA compliant (edible), and full Certificate of Analysis (COA) from a certified lab.' },
  { q: 'Do you offer product samples before bulk orders?', a: 'Yes. Sample packs available for all categories. Dispatched via DHL or FedEx within 3 to 5 business days. Sample cost is refunded on your first bulk order.' },
  { q: 'What are your payment terms?', a: 'Standard: 30% advance + 70% balance against BL copy (T/T). LC at sight for large orders. PayPal and bank transfer for samples.' },
  { q: 'Can I mix different product categories in one order?', a: 'Absolutely. We specialise in mixed consignments. Combine edible salt, lick blocks, bath salt, and décor in a single container with one invoice and full docs.' },
  { q: 'Do you accept third-party inspection?', a: 'Yes. We welcome pre-shipment inspection by SGS, Bureau Veritas, or any inspector of your choice at buyer\'s cost.' },
]

const ORDER_TYPES = ['Sample Order', 'Wholesale', 'Bulk / Container', 'Private Label', 'Retail / Small', 'Just Enquiring']

export default function Contact() {
  useReveal()

  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', country: '',
    product: '', qty: '', market: '', message: ''
  })
  const [orderType, setOrderType] = useState('Sample Order')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [lastWaUrl, setLastWaUrl] = useState('')

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async () => {
    const { name, email, country, product, message } = form
    if (!name || !email || !country || !product || !message) {
      setError('Please fill in all required fields marked with *.')
      return
    }
    setError('')
    setSubmitting(true)

    const waMessage = `*New Inquiry from Bin Aouf Website*

*Name:* ${name}
*Company:* ${form.company || '—'}
*Email:* ${email}
*WhatsApp/Phone:* ${form.phone || '—'}
*Country:* ${country}
*Product Interest:* ${product}
*Order Type:* ${orderType}
*Approximate Quantity:* ${form.qty || '—'}
*Target Market:* ${form.market || '—'}

*Message:*
${message}`;

    const whatsappUrl = `https://wa.me/923110282668?text=${encodeURIComponent(waMessage)}`;
    setLastWaUrl(whatsappUrl)

    // 1. Send email via Web3Forms (blocking so it registers before redirects)
    try {
      const web3FormsData = {
        access_key: '58261e39-6653-4168-98c0-f684c48b2fa4',
        subject: `New Inquiry from ${name} (${country})`,
        from_name: 'Bin Aouf Website',
        name: name,
        email: email,
        phone: form.phone || '—',
        company: form.company || '—',
        country: country,
        product: product,
        order_type: orderType,
        quantity: form.qty || '—',
        market: form.market || '—',
        message: message
      }
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(web3FormsData)
      })
    } catch (e) {
      console.error('Web3Forms dispatch error:', e)
    }

    // 2. Try sending to database backend (non-blocking so local/database issues do not halt flow)
    try {
      await api.submitInquiry({ ...form, orderType })
    } catch (err) {
      console.error('Backend database submit error (continuing anyway):', err)
    }

    // 3. Open WhatsApp in new tab
    try {
      window.open(whatsappUrl, '_blank')
    } catch (e) {
      console.error('Popup blocker window.open error:', e)
    }

    setSuccess(true)
    setForm({ name: '', company: '', email: '', phone: '', country: '', product: '', qty: '', market: '', message: '' })
    setSubmitting(false)
    setTimeout(() => setSuccess(false), 30000)
  }

  return (
    <div id="page-contact" className="page active">
      {/* BANNER */}
      <div className="contact-banner">
        <div className="tag">Get In Touch</div>
        <h1 className="sec-title white">Let's Do Business<br /><em>Together</em></h1>
        <p>Whether you're placing your first order, requesting samples, or looking for a long-term supply partner, our team responds to every inquiry within 24 hours.</p>
      </div>

      {/* CONTACT CARDS */}
      <div className="cm-cards">
        <div className="cm-grid">
          <a href="https://wa.me/923110282668" target="_blank" rel="noreferrer" className="cmc reveal">
            <span className="cmc-icon">💬</span>
            <div className="cmc-title">WhatsApp</div>
            <div className="cmc-val">+92 311 028 2668</div>
            <div className="cmc-desc">Also available: +92 325 151 2035. Fastest response within 1 hour.</div>
            <span className="cmc-btn">Chat Now →</span>
          </a>
          <a href="tel:+923110282668" className="cmc reveal">
            <span className="cmc-icon">📞</span>
            <div className="cmc-title">Call Us</div>
            <div className="cmc-val">+92 311 028 2668</div>
            <div className="cmc-desc">Also: +92 325 151 2035. Mon to Sat, 9 AM to 6 PM PKT.</div>
            <span className="cmc-btn">Call Now →</span>
          </a>
          <a href="mailto:binaoufchemicals.pk@gmail.com" className="cmc reveal">
            <span className="cmc-icon">✉️</span>
            <div className="cmc-title">Email</div>
            <div className="cmc-val">binaoufchemicals.pk@gmail.com</div>
            <div className="cmc-desc">Send detailed inquiries, attach specifications, or request our full product catalogue and price list.</div>
            <span className="cmc-btn">Email Us →</span>
          </a>
          <div className="cmc reveal">
            <span className="cmc-icon">📍</span>
            <div className="cmc-title">Our Location</div>
            <div className="cmc-val">Sargodha, Punjab</div>
            <div className="cmc-desc">Processing facility near Warcha Salt Mine. Exporting from Port Qasim, Karachi. Visitors by appointment.</div>
            <span className="cmc-btn" style={{ background: 'var(--cream2)', color: 'var(--terra)' }}>View Map →</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTACT SECTION */}
      <div className="contact-main">
        {/* INFO COL */}
        <div className="contact-info-col reveal-l">
          <div className="ci-tag">Contact Information</div>
          <h2 className="ci-title">We're Ready to<br /><em>Assist You</em></h2>
          <p className="ci-p">Our dedicated export team is available six days a week to answer questions, prepare custom quotes, arrange samples, and guide you through the entire ordering process from first contact to delivery.</p>

          <div className="info-blocks">
            {[
              { icon: '💬', label: 'WhatsApp (Preferred)', val: '+92 311 028 2668', sub: '+92 325 151 2035' },
              { icon: '📞', label: 'Phone / Voice Call', val: '+92 311 028 2668', sub: 'Mon to Sat, 9:00 AM to 6:00 PM PKT' },
              { icon: '📞', label: 'Phone / Voice Call', val: '+92 325 151 2035', sub: 'Mon to Sat, 9:00 AM to 6:00 PM PKT' },
              { icon: '✉️', label: 'Email', val: 'binaoufchemicals.pk@gmail.com', sub: 'For all inquiries and shipment queries' },
              { icon: '📍', label: 'Processing Facility', val: 'Khushab, Punjab, Pakistan', sub: 'Near Warcha Salt Mine, visitors by appointment' },
              { icon: '🚢', label: 'Export Port', val: 'Port Qasim, Karachi', sub: 'Air freight: Allama Iqbal International, Lahore' },
            ].map(({ icon, label, val, sub }) => (
              <div key={val + label} className="ib">
                <div className="ib-icon">{icon}</div>
                <div>
                  <div className="ib-label">{label}</div>
                  <div className="ib-val">{val}</div>
                  <div className="ib-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="wh-box">
            <div className="wh-title">Working Hours (PKT, GMT+5)</div>
            <div className="wh-row"><span className="wh-day">Monday to Thursday</span><span className="wh-time">9:00 AM to 6:00 PM <span className="wh-badge">Open</span></span></div>
            <div className="wh-row"><span className="wh-day">Friday</span><span className="wh-time">9:00 AM to 12:30 PM</span></div>
            <div className="wh-row"><span className="wh-day">Saturday</span><span className="wh-time">10:00 AM to 4:00 PM</span></div>
            <div className="wh-row"><span className="wh-day">Sunday</span><span className="wh-time">Closed, WhatsApp available</span></div>
          </div>

          <div className="soc-row">
            <button className="soc-btn">in</button>
            <button className="soc-btn">fb</button>
            <button className="soc-btn">ig</button>
            <button className="soc-btn">yt</button>
          </div>
        </div>

        {/* QUOTE FORM */}
        <div className="quote-form-col reveal-r">
          <div className="qf-title">Request a Quote</div>
          <p className="qf-sub">Fill in the form below. Our export team will prepare a detailed quote and reply within 24 hours.</p>

          <div className="form-row">
            <div className="fg"><label>Full Name *</label><input type="text" placeholder="Your full name" value={form.name} onChange={update('name')} /></div>
            <div className="fg"><label>Company Name</label><input type="text" placeholder="Your company (optional)" value={form.company} onChange={update('company')} /></div>
          </div>
          <div className="form-row">
            <div className="fg"><label>Email Address *</label><input type="email" placeholder="you@company.com" value={form.email} onChange={update('email')} /></div>
            <div className="fg"><label>WhatsApp / Phone</label><input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={update('phone')} /></div>
          </div>
          <div className="form-row">
            <div className="fg"><label>Country *</label><input type="text" placeholder="Your country" value={form.country} onChange={update('country')} /></div>
            <div className="fg">
              <label>Product Interest *</label>
              <select value={form.product} onChange={update('product')}>
                <option value="">Select a product</option>
                <option>Edible Himalayan Salt</option>
                <option>Animal Lick Salt Blocks</option>
                <option>Bath and Spa Salt</option>
                <option>Salt Lamps and Décor</option>
                <option>Custom / Private Label</option>
                <option>Multiple Products / Container</option>
              </select>
            </div>
          </div>

          <div className="fg full">
            <label>Order Type *</label>
            <div className="order-types">
              {ORDER_TYPES.map((t) => (
                <button
                  key={t}
                  className={`ot-btn ${orderType === t ? 'sel' : ''}`}
                  onClick={() => setOrderType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="fg"><label>Approximate Quantity</label><input type="text" placeholder="e.g. 500kg, 1 FCL, 200 units..." value={form.qty} onChange={update('qty')} /></div>
            <div className="fg"><label>Target Market / Country</label><input type="text" placeholder="Where will products be sold?" value={form.market} onChange={update('market')} /></div>
          </div>
          <div className="fg full">
            <label>Your Message *</label>
            <textarea placeholder="Describe your requirements including product specs, packaging preferences, shipping destination, budget, and timeline." value={form.message} onChange={update('message')} />
          </div>

          {error && <p style={{ color: 'var(--danger, #c0432f)', fontSize: 13, marginBottom: 8 }}>{error}</p>}

          <button className="form-submit" onClick={submit} disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Inquiry →'}
          </button>

          {success && (
            <div className="form-success" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>Thank you! Our export team has received your inquiry. We will reply within 24 hours.</div>
              {lastWaUrl && (
                <a 
                  href={lastWaUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-primary" 
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', background: '#25D366', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 600, gap: 8, width: 'fit-content' }}
                >
                  💬 Chat on WhatsApp Now
                </a>
              )}
            </div>
          )}
          <p className="form-note">Your information is confidential. We never share client details. NDA available on request.</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-sec">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="tag center">Common Questions</div>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>Frequently Asked<br /><em>Questions</em></h2>
        </div>
        <div className="faq-grid">
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="faq-q-text">{q}</span>
                <span className="faq-chevron">▾</span>
              </div>
              <div className="faq-a"><p>{a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
