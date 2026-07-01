import { useNavigate } from 'react-router-dom'

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

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <span className="fl">Bin <span>Aouf</span></span>
          <p>Premium Himalayan salt products exported worldwide. Sourced from Khewra, Warcha and Kalabagh mines, Punjab, Pakistan.</p>
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
            <li><a href="mailto:binaoufchemicals.pk@gmail.com">binaoufchemicals.pk@gmail.com</a></li>
            <li><a href="tel:+923110282668">+92 311 028 2668</a></li>
            <li><a href="tel:+923251512035">+92 325 151 2035</a></li>
            <li><button onClick={() => navigate('/contact')}>Request Quote</button></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Bin Aouf. All rights reserved.</p>
        <div className="footer-socials">
          <button className="fsoc">in</button>
          <button className="fsoc">fb</button>
          <button className="fsoc">ig</button>
        </div>
      </div>
    </footer>
  )
}
