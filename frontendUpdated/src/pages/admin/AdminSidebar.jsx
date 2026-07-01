import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
  )},
  { id: 'products', label: 'Products', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/><path d="M12 22.08V12"/></svg>
  )},
  { id: 'orders', label: 'Orders', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  )},
  { id: 'customers', label: 'Customers', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
  { id: 'inquiries', label: 'Inquiries', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
  )},
]

const SYSTEM_NAV = [
  { id: 'site', label: 'Site Settings', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  )},
  { id: 'admin', label: 'Admin Settings', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  )},
]

export default function AdminSidebar({ page, setPage, ordersCount, inquiriesCount, adminName, cats, activeCat, setActiveCat }) {
  const { logout } = useAuth()
  const [prodOpen, setProdOpen] = useState(() => page === 'products')

  const initials = adminName
    ? adminName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'RA'

  return (
    <aside className="sidebar" id="sidebar">
      {/* Header */}
      <div className="sb-head">
        <div className="sb-logo">BA</div>
        <div className="sb-brand">
          <b>Bin Aouf</b>
          <span>ADMIN</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="sb-nav">


        {NAV.map(({ id, label, icon }) =>
          id === 'products' ? (
            <div key={id}>
              <button
                className={`nav-item ${page === id ? 'active' : ''} ${prodOpen ? 'open' : ''}`}
                onClick={() => { setProdOpen(o => !o); setPage('products') }}
              >
                {icon}{label}
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <div className={`subnav ${prodOpen ? 'open' : ''}`}>
                <button
                  className={`sub-item ${page === 'products' && !activeCat ? 'active' : ''}`}
                  onClick={() => { setActiveCat(null); setPage('products') }}
                >
                  <span className="dot" /> All Categories
                </button>
                {cats && cats.map(cat => (
                  <button
                    key={cat.id}
                    className={`sub-item ${page === 'products' && activeCat?.id === cat.id ? 'active' : ''}`}
                    onClick={() => { setActiveCat(cat); setPage('products') }}
                  >
                    <span className="dot" /> {cat.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => setPage(id)}
            >
              {icon}{label}
              {id === 'orders' && ordersCount > 0 && <span className="nav-count" id="ordCount">{ordersCount}</span>}
              {id === 'inquiries' && inquiriesCount > 0 && <span className="nav-count" id="inqCount">{inquiriesCount}</span>}
            </button>
          )
        )}

        {/* System Section */}
        <div className="sb-label" style={{ marginTop: 16 }}>System</div>
        {SYSTEM_NAV.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? 'active' : ''}`}
            onClick={() => setPage(id)}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="sb-foot">
        <button className="sb-user" onClick={logout} title="Click to logout">
          <div className="sb-ava" id="sbAva">{initials}</div>
          <div>
            <b id="sbName">{adminName || 'Roman A.'}</b>
            <span>Super Admin</span>
          </div>
        </button>
      </div>
    </aside>
  )
}
