import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [solid, setSolid] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About Us', path: '/about' },
    { label: 'Process', path: '/process' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ]

  return (
    <>
      <nav id="mainNav" className={solid ? 'solid' : ''}>
        <div
          className="nav-logo"
          onClick={() => navigate('/')}
        >
          Bin <span>Aouf</span>
        </div>
        <ul className="nav-links">
          {navLinks.map(({ label, path }) => (
            <li key={path}>
              <button
                className={isActive(path) ? 'active-nav' : ''}
                onClick={() => { navigate(path); setMobileOpen(false) }}
              >
                {label}
              </button>
            </li>
          ))}
          <li>
            <button
              className="nav-quote-btn"
              onClick={() => { navigate('/contact'); setMobileOpen(false) }}
            >
              Request Quote
            </button>
          </li>
        </ul>
        <div className="burger" onClick={() => setMobileOpen(true)}>
          <span /><span /><span />
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mob-close" onClick={() => setMobileOpen(false)}>✕</button>
        {navLinks.map(({ label, path }) => (
          <button key={path} onClick={() => { navigate(path); setMobileOpen(false) }}>
            {label}
          </button>
        ))}
      </div>
    </>
  )
}
