import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import api from '../services/api'

export default function FAQ() {
  const navigate = useNavigate()
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useReveal()

  useEffect(() => {
    // Inject page title & meta description
    document.title = 'Frequently Asked Questions (FAQ) — Bin Aouf'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get answers to common queries regarding Himalayan salt export, wholesale orders, private labeling options, shipping schedules, and packaging specifications.')
    }

    async function loadFaqs() {
      try {
        const res = await api.getPublicFaqs()
        if (res?.data) {
          setFaqs(res.data)
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err)
        setError('Unable to load FAQ list. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadFaqs()
  }, [])

  // Inject FAQPage JSON-LD Structured Data
  useEffect(() => {
    if (!faqs.length) return
    const schemaId = 'faq-jsonld-schema'
    let script = document.getElementById(schemaId)
    if (!script) {
      script = document.createElement('script')
      script.id = schemaId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.answer
        }
      }))
    }
    script.textContent = JSON.stringify(structuredData)

    return () => {
      const existing = document.getElementById(schemaId)
      if (existing) existing.remove()
    }
  }, [faqs])

  return (
    <div id="page-faq" className="page active" style={{ background: 'var(--cream)' }}>
      {/* BANNER */}
      <div className="contact-banner" style={{ background: 'linear-gradient(135deg, var(--terra) 0%, var(--terra-deep) 100%)', padding: '140px 80px 70px', textAlign: 'left' }}>
        <div className="tag" style={{ color: 'var(--gold-lt)' }}>Information hub</div>
        <h1 className="sec-title white" style={{ color: 'white' }}>Frequently Asked<br /><em>Questions</em></h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, maxWidth: 580, marginTop: 16 }}>
          Find complete details about minimum orders, certifications, custom labeling, payment terms, and logistics for our Himalayan salt export catalog.
        </p>
      </div>

      {/* Accordion list */}
      <div className="faq-sec" style={{ padding: '80px 0', minHeight: '40vh' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>Loading FAQs...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>
              <p>{error}</p>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : faqs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No questions published yet.</div>
          ) : (
            <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, maxWidth: 800, margin: '0 auto' }}>
              {faqs.map((faq, i) => (
                <div 
                  key={faq.id || i} 
                  className={`faq-item ${openFaq === i ? 'open' : ''}`}
                  style={{ 
                    background: 'white', 
                    borderLeft: '4px solid var(--rose)', 
                    borderRadius: 4, 
                    boxShadow: '0 2px 8px rgba(90,30,10,0.04)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div 
                    className="faq-q" 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ 
                      padding: '24px 28px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      gap: 20 
                    }}
                  >
                    <span className="faq-q-text" style={{ fontSize: 15, fontWeight: 600, color: 'var(--terra-deep)' }}>
                      {faq.question}
                    </span>
                    <span 
                      className="faq-chevron" 
                      style={{ 
                        fontSize: 18, 
                        color: 'var(--rose)', 
                        transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease' 
                      }}
                    >
                      ▼
                    </span>
                  </div>
                  <div 
                    className="faq-a" 
                    style={{ 
                      maxHeight: openFaq === i ? '500px' : '0px', 
                      overflow: 'hidden', 
                      transition: 'max-height 0.4s ease' 
                    }}
                  >
                    <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.8, padding: '0 28px 24px', margin: 0, fontWeight: 300 }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to action section */}
          <div className="reveal" style={{ textAlign: 'center', marginTop: 80, padding: 40, background: 'var(--cream2)', borderRadius: 8, border: '1px solid var(--sand)' }}>
            <h3 className="sec-title" style={{ fontSize: 24, marginBottom: 12 }}>Still Have Questions?</h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 500, margin: '0 auto 24px' }}>
              If you need custom dimensions, specific lab reports, or a custom volume quotation, get in touch directly.
            </p>
            <button className="btn-primary" onClick={() => navigate('/contact')}>Send Your Inquiry →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
