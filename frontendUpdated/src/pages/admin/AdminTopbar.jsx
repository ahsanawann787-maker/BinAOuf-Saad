const TITLES = {
  dashboard: ['Dashboard', 'Welcome back 👋'],
  products: ['Products', 'Manage your salt catalog'],
  orders: ['Orders', 'Track export & retail orders'],
  customers: ['Customers', 'Your importers & buyers'],
  inquiries: ['Inquiries', 'Quote requests & messages'],
  site: ['Site Settings', 'Public website content'],
  admin: ['Admin Settings', 'Account & preferences'],
}

export default function AdminTopbar({ page, setPage, inquiriesCount, adminName }) {
  const firstName = adminName ? adminName.split(' ')[0] : 'Admin'
  const [title, crumbTemplate] = TITLES[page] || ['Dashboard', '']
  const crumb = page === 'dashboard' ? `Welcome back, ${firstName} 👋` : crumbTemplate

  return (
    <header className="topbar" id="topbar">
      <button
        className="menu-btn tb-icon"
        onClick={() => document.getElementById('sidebar').classList.toggle('open')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16M4 6h16M4 18h16"/></svg>
      </button>
      <div>
        <div className="tb-title">{title}</div>
        <div className="tb-crumb">{crumb}</div>
      </div>
      <div className="tb-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input placeholder="Search orders, products, customers…" />
      </div>
      <button className="tb-icon" title="Inquiries" onClick={() => setPage('inquiries')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        {inquiriesCount > 0 && <span className="badge" id="bellBadge">{inquiriesCount}</span>}
      </button>
    </header>
  )
}
