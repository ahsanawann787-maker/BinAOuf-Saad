import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
const products = [
  { key: 'edible', label: 'Edible Salt' },
  { key: 'animal', label: 'Animal Lick' },
  { key: 'bath', label: 'Bath and Spa' },
  { key: 'decor', label: 'Décor and Lamps' },
  { key: 'tilesbricks', label: 'Salt Tiles and Bricks' },
  { key: 'kitchen', label: 'Kitchen and Accessories' },
  { key: 'candles', label: 'Salt Candle Holders' },
  { key: 'rocksalt', label: 'Rock Salt' },
  { key: 'custom', label: 'Custom and Bulk' },
]

export default function Footer() {
  const navigate = useNavigate()
  const { settings } = useSettings()

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          {settings?.logo ? (
            <div style={{ marginBottom: 12 }}><img src={settings.logo} alt={settings?.siteTitle || 'Logo'} style={{ height: 48, width: 'auto', objectFit: 'contain' }} /></div>
          ) : (
            <span className="fl">Bin <span>Aouf</span></span>
          )}
          <p>{settings?.tagline || 'Premium Himalayan salt products exported worldwide. Sourced from Khewra, Warcha and Kalabagh mines, Punjab, Pakistan.'}</p>
        </div>
        <div className="footer-col">
          <h5>Products</h5>
          <ul>
            {products.map(({ key, label }) => (
              <li key={key}>
                <button onClick={() => navigate('/products', { state: { tab: key } })}>{label}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><button onClick={() => navigate('/about')}>About Us</button></li>
            <li><button onClick={() => navigate('/process')}>Our Process</button></li>
            <li><button onClick={() => navigate('/contact')}>Contact</button></li>
            <li><button onClick={() => navigate('/about', { state: { scrollTo: 'privatelabel' } })}>Private Label</button></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <ul>
            <li><a href={`mailto:${settings?.email || 'binaoufsalts@gmail.com'}`}>{settings?.email || 'binaoufsalts@gmail.com'}</a></li>
            <li><a href={`tel:${(settings?.phone1 || '+923359217277').replace(/[^0-9+]/g, '')}`}>{settings?.phone1 || '+92 335 921 7277'}</a></li>
            {settings?.phone2 && <li><a href={`tel:${settings?.phone2.replace(/[^0-9+]/g, '')}`}>{settings?.phone2}</a></li>}
            <li><button onClick={() => navigate('/contact')}>Request Quote</button></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '80px' }}>
        <p>© {new Date().getFullYear()} {settings?.siteTitle || 'Bin Aouf'}. All rights reserved.</p>
        <div className="footer-socials" style={{ display: 'flex', gap: '24px' }}>
          {settings?.linkedin && (
            <a href={settings.linkedin} target="_blank" rel="noreferrer" className="fsoc" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          )}
          <a href={settings?.fb || 'https://www.facebook.com/share/1D9APs8Z24/'} target="_blank" rel="noreferrer" className="fsoc" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
          </a>
          <a href={settings?.ig || 'https://www.instagram.com/binaouf.chemicals?igsh=eGlkZWtoMjBtYmg4'} target="_blank" rel="noreferrer" className="fsoc" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
