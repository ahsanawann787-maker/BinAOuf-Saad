import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../../services/api'

/* ─── helpers ─── */
const randCc = () => ['C9A84C','B65C3A','D98E73','3D6FA8','9A4A2C','3F8F5F','C0432F','C19A4B'][Math.floor(Math.random()*8)]
const esc = (s) => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
const parseAmt = (a) => parseFloat(String(a).replace(/[^0-9.]/g,'')) || 0
function useDebounce(fn, delay) {
  const t = useRef(null)
  return useCallback((...args) => { clearTimeout(t.current); t.current = setTimeout(() => fn(...args), delay) }, [fn, delay])
}

/* ─── status badge ─── */
function StatusTag({ status }) {
  const map = { pending:['warn','Pending'], processing:['info','Processing'], shipped:['info','Shipped'], paid:['ok','Paid'] }
  const [cls, label] = map[status] || ['mute', status]
  return <span className={`tag ${cls}`}><span className="dot" />{label}</span>
}

/* ─── toast ─── */
function Toast({ msg, show }) {
  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      <span>{msg}</span>
    </div>
  )
}

/* ─── modal wrapper ─── */
function Modal({ id, show, onClose, title, children, footer }) {
  useEffect(() => {
    if (!show) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [show, onClose])
  return (
    <div className={`modal-bg ${show ? 'show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-x" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

/* ─── confirm modal ─── */
function ConfirmModal({ show, msg, onConfirm, onCancel, okLabel = 'Delete' }) {
  return (
    <Modal show={show} onClose={onCancel} title="Please confirm" footer={
      <>
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>{okLabel}</button>
      </>
    }>
      <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{msg}</p>
    </Modal>
  )
}

/* ─── image upload field ─── */
function ImgUpload({ img, onImg, onRemove, phEmoji = '🧂' }) {
  const handleFile = (ev) => {
    const f = ev.target.files[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const im = new Image(); im.onload = () => {
        let { width: w, height: h } = im; const max = 640
        if (w > h && w > max) { h = h*max/w; w = max } else if (h > max) { w = w*max/h; h = max }
        const c = document.createElement('canvas'); c.width = w; c.height = h
        c.getContext('2d').drawImage(im, 0, 0, w, h)
        onImg(c.toDataURL('image/jpeg', 0.82))
      }; im.src = e.target.result
    }; reader.readAsDataURL(f); ev.target.value = ''
  }
  return (
    <div className="img-up">
      <div className="img-preview">
        {img ? <img src={img} alt="preview" style={{ width:'100%',height:'100%',objectFit:'cover' }} /> : <><span className="ph">{phEmoji}</span><span className="ph-txt">No image yet</span></>}
      </div>
      <div className="img-actions">
        <label className="up-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
          Upload
          <input type="file" accept="image/*" onChange={handleFile} hidden />
        </label>
        {img && <button type="button" className="btn" onClick={onRemove}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Remove
        </button>}
      </div>
    </div>
  )
}

/* ─── revenue chart ─── */
function RevenueChart() {
  const data = [{m:'Nov',v:62},{m:'Dec',v:71},{m:'Jan',v:58},{m:'Feb',v:79},{m:'Mar',v:84},{m:'Apr',v:73},{m:'May',v:91},{m:'Jun',v:100}]
  const max = Math.max(...data.map(d => d.v))
  const [heights, setHeights] = useState(data.map(() => 0))
  useEffect(() => { const t = setTimeout(() => setHeights(data.map(d => d.v/max*100)), 100); return () => clearTimeout(t) }, [])
  return (
    <div className="chart">
      {data.map((d, i) => (
        <div key={d.m} className="bar-wrap">
          <div className="bar-track">
            <div className="bar" style={{ height: heights[i]+'%', transition: 'height 1s cubic-bezier(.2,.8,.2,1)' }}>
              <div className="bar-tip">${(d.v*0.48).toFixed(1)}k</div>
            </div>
          </div>
          <div className="bar-lab">{d.m}</div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function AdminDashboard({ page, setPage, onDataLoaded, cats, setCats, activeCat, setActiveCat }) {
  /* ── data state ── */
  const [products, setProducts] = useState([])
  const [homecats, setHomecats] = useState([])
  const [certs, setCerts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [cols, setCols] = useState({})
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [bootError, setBootError] = useState(null)

  /* ── toast ── */
  const [toastMsg, setToastMsg] = useState('')
  const [toastShow, setToastShow] = useState(false)
  const toastTimer = useRef(null)
  const toast = (msg) => {
    setToastMsg(msg); setToastShow(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastShow(false), 2600)
  }

  /* ── confirm ── */
  const [confirm, setConfirm] = useState({ show: false, msg: '', cb: null, okLabel: 'Delete' })
  const askConfirm = (msg, cb, okLabel = 'Delete') => setConfirm({ show: true, msg, cb, okLabel })
  const doConfirm = () => { if (confirm.cb) confirm.cb(); setConfirm(c => ({ ...c, show: false, cb: null })) }

  /* ── bootstrap from API ── */
  useEffect(() => {
    const boot = async () => {
      try {
        const [c, p, h, ce, o, cu, inq, cl, s] = await Promise.all([
          api.getCategories(), api.getProducts(), 
          api.getHomeCategories(),
          api.getCertifications(),
          api.getOrders(), api.getCustomers(), api.getInquiries(),
          api.getProductColumns(),
          api.getSettings()
        ])
        setCats(Array.isArray(c?.data) ? c.data : [])
        const ps = Array.isArray(p?.data) ? p.data : []
        // ensure specs exists on each product
        setProducts(ps.map(pr => ({ ...pr, specs: pr.specs || {} })))
        setHomecats(Array.isArray(h?.data) ? h.data : [])
        setCerts(Array.isArray(ce?.data) ? ce.data : [])
        setOrders(Array.isArray(o?.data) ? o.data : [])
        setCustomers(Array.isArray(cu?.data) ? cu.data : [])
        setInquiries(Array.isArray(inq?.data) ? inq.data : [])
        setCols(cl?.data || {})
        setSettings(s?.data || {})
        setLoading(false)
      } catch(e) {
        console.error('Boot error:', e)
        setBootError(e.message)
        setLoading(false)
      }
    }
    boot()
  }, [])

  useEffect(() => {
    if (onDataLoaded && !loading) {
      onDataLoaded({
        ordersCount: orders.length,
        inquiriesCount: inquiries.filter(i => !i.read && !i.archived).length,
        adminName: settings.adminName || 'Admin',
        cats: cats
      })
    }
  }, [orders, inquiries, settings, loading, cats, onDataLoaded])

  /* ── sync helpers ── */
  const syncProducts = useDebounce((data) => api.bulkPush('products', data), 600)
  const syncOrders = useDebounce((data) => api.bulkPush('orders', data), 600)
  const syncCustomers = useDebounce((data) => api.bulkPush('customers', data), 600)
  const syncInquiries = useDebounce((data) => api.bulkPush('inquiries', data), 600)
  const syncHomecats = useDebounce((data) => api.bulkPush('home-categories', data), 600)
  const syncCerts = useDebounce((data) => api.bulkPush('certifications', data), 600)
  const syncCols = useDebounce((data) => api.bulkPush('product-columns', { map: data }), 600)

  /* ─── stats ─── */
  const unreadInq = inquiries.filter(i => !i.read && !i.archived).length
  const activeProds = products.filter(p => p.status === 'Active').length
  const totalRev = orders.reduce((s, o) => s + parseAmt(o.amt), 0)
  const revDisplay = totalRev >= 1000 ? '$'+(totalRev/1000).toFixed(1)+'k' : '$'+totalRev.toFixed(0)

  /* ─── PRODUCTS modals ─── */
  const DEFAULT_COLS = [{ key:'art', label:'Art#' },{ key:'weight', label:'Weight (kg)' },{ key:'size', label:'Size (cm)' },{ key:'packing', label:'Packing' }]
  const colsFor = (catId) => Array.isArray(cols[catId]) ? cols[catId] : DEFAULT_COLS
  const [prodView, setProdView] = useState('table')
  const [prodModal, setProdModal] = useState({ show: false, data: null })
  const [catModal, setCatModal] = useState({ show: false, data: null })
  const [colModal, setColModal] = useState({ show: false, catId: null })
  const [colName, setColName] = useState('')

  const openProductModal = (prod = null) => {
    const catId = prod?.cat || (activeCat?.id) || cats[0]?.id || ''
    const catCols = colsFor(catId)
    const specs = {}
    catCols.forEach(c => { specs[c.key] = prod?.specs?.[c.key] ?? '—' })
    setProdModal({ show: true, data: prod ? { ...prod, specs } : { cat: catId, name: '', desc: '', status: 'Active', tags: '', img: '', specs } })
  }
  const saveProduct = (formData) => {
    let updated
    if (formData.id) {
      updated = products.map(p => p.id === formData.id ? { ...p, ...formData } : p)
      toast('Product updated ✓')
    } else {
      updated = [...products, { ...formData, id: Date.now() }]
      toast('Product added ✓')
    }
    setProducts(updated); syncProducts(updated); setProdModal({ show: false, data: null })
  }
  const deleteProduct = (id) => {
    askConfirm('Delete this product? This cannot be undone.', () => {
      const updated = products.filter(p => p.id !== id)
      setProducts(updated); syncProducts(updated); toast('Product deleted')
    })
  }
  const updateProdField = (id, key, val) => {
    const updated = products.map(p => p.id === id ? { ...p, [key]: val } : p)
    setProducts(updated); syncProducts(updated)
  }
  const updateProdSpec = (id, specKey, val) => {
    const updated = products.map(p => p.id === id ? { ...p, specs: { ...p.specs, [specKey]: val } } : p)
    setProducts(updated); syncProducts(updated)
  }
  const saveCat = (formData) => {
    const updated = cats.map(c => c.id === formData.id ? { ...c, ...formData } : c)
    setCats(updated)
    api.bulkPush('categories', updated).catch(e => console.error('Category sync error:', e))
    setCatModal({ show: false, data: null }); toast('Category updated ✓')
  }
  const addColumn = (catId, label) => {
    const existing = colsFor(catId)
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/, '') || 'col'
    if (existing.some(c => c.key === key)) { toast('Column already exists'); return }
    const newCols = { ...cols, [catId]: [...existing, { key, label }] }
    const updProds = products.map(p => p.cat === catId ? { ...p, specs: { ...p.specs, [key]: '—' } } : p)
    setCols(newCols); setProducts(updProds); syncCols(newCols); syncProducts(updProds)
    setColModal({ show: false, catId: null }); setColName(''); toast('Column added ✓')
  }
  const deleteColumn = (catId, key) => {
    const existing = colsFor(catId)
    if (existing.length <= 1) { toast('Keep at least one column'); return }
    askConfirm(`Delete column "${existing.find(c=>c.key===key)?.label}"? Removes data from all products.`, () => {
      const newCols = { ...cols, [catId]: existing.filter(c => c.key !== key) }
      const updProds = products.map(p => { if (p.cat !== catId) return p; const s = { ...p.specs }; delete s[key]; return { ...p, specs: s } })
      setCols(newCols); setProducts(updProds); syncCols(newCols); syncProducts(updProds); toast('Column deleted')
    })
  }
  const renameColumn = (catId, key, label) => {
    const newCols = { ...cols, [catId]: colsFor(catId).map(c => c.key === key ? { ...c, label } : c) }
    setCols(newCols); syncCols(newCols)
  }

  /* ─── ORDERS ─── */
  const [ordFilter, setOrdFilter] = useState('all')
  const [orderModal, setOrderModal] = useState({ show: false, data: null })
  const saveOrder = (formData) => {
    let amt = formData.amt?.trim() || '$0'
    if (amt && !amt.startsWith('$')) amt = '$' + amt
    const d = { ...formData, amt }
    let updated
    if (d.id && orders.some(o => o.id === d.id)) {
      updated = orders.map(o => o.id === d.id ? { ...o, ...d } : o); toast('Order updated ✓')
    } else {
      const nums = orders.map(o => parseInt((o.id?.match(/\d+/)||[1000])[0])).filter(n => !isNaN(n))
      const nextId = 'BA-' + ((Math.max(1000, ...nums)) + 1)
      updated = [{ ...d, id: nextId, cc: randCc() }, ...orders]; toast('Order created ✓')
    }
    setOrders(updated); syncOrders(updated); setOrderModal({ show: false, data: null })
  }
  const deleteOrder = (id) => {
    askConfirm('Delete this order?', () => {
      const updated = orders.filter(o => o.id !== id)
      setOrders(updated); syncOrders(updated); setOrderModal({ show: false, data: null }); toast('Order deleted')
    })
  }

  /* ─── CUSTOMERS ─── */
  const [custModal, setCustModal] = useState({ show: false, data: null })
  const saveCustomer = (formData) => {
    let spent = formData.spent?.trim() || '$0'
    if (spent && !spent.startsWith('$')) spent = '$' + spent
    const d = { ...formData, spent }
    let updated
    if (d.id && customers.some(c => c.id === d.id)) {
      updated = customers.map(c => c.id === d.id ? { ...c, ...d } : c); toast('Customer updated ✓')
    } else {
      updated = [...customers, { ...d, id: Date.now(), cc: randCc(), since: new Date().getFullYear().toString() }]; toast('Customer added ✓')
    }
    setCustomers(updated); syncCustomers(updated); setCustModal({ show: false, data: null })
  }
  const deleteCustomer = (id) => {
    askConfirm('Delete this customer?', () => {
      const updated = customers.filter(c => c.id !== id)
      setCustomers(updated); syncCustomers(updated); setCustModal({ show: false, data: null }); toast('Customer deleted')
    })
  }

  /* ─── INQUIRIES ─── */
  const [inqFilter, setInqFilter] = useState('all')
  const [replyModal, setReplyModal] = useState({ show: false, data: null })
  const markRead = (id) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, read: true } : i)
    setInquiries(updated); syncInquiries(updated); toast('Marked as read')
  }
  const archiveInq = (id) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, archived: true } : i)
    setInquiries(updated); syncInquiries(updated); toast('Inquiry archived')
  }
  const deleteInquiry = (id) => {
    askConfirm('Delete this inquiry permanently? This cannot be undone.', () => {
      const updated = inquiries.filter(i => i.id !== id)
      setInquiries(updated); syncInquiries(updated); toast('Inquiry deleted')
    })
  }
  const sendReply = (id) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, read: true } : i)
    setInquiries(updated); syncInquiries(updated); setReplyModal({ show: false, data: null }); toast('Reply sent ✓')
  }

  /* ─── HOMECATS ─── */
  const [homecatModal, setHomecatModal] = useState({ show: false, data: null })
  const saveHomecat = (formData) => {
    let updated
    if (formData.id && homecats.some(h => h.id === formData.id)) {
      updated = homecats.map(h => h.id === formData.id ? { ...h, ...formData } : h); toast('Home card updated ✓')
    } else {
      updated = [...homecats, { ...formData, id: Date.now() }]; toast('Home card added ✓')
    }
    setHomecats(updated); syncHomecats(updated); setHomecatModal({ show: false, data: null })
  }
  const deleteHomecat = (id) => {
    askConfirm('Remove this homepage card?', () => {
      const updated = homecats.filter(h => h.id !== id)
      setHomecats(updated); syncHomecats(updated); toast('Home card removed')
    })
  }
  const moveHomecat = (id, dir) => {
    const idx = homecats.findIndex(h => h.id === id); const j = idx + dir
    if (j < 0 || j >= homecats.length) return
    const updated = [...homecats]; [updated[idx], updated[j]] = [updated[j], updated[idx]]
    setHomecats(updated); syncHomecats(updated)
  }

  /* ─── CERTS ─── */
  const [certModal, setCertModal] = useState({ show: false, data: null })
  const saveCert = (formData) => {
    let updated
    if (formData.id && certs.some(c => c.id === formData.id)) {
      updated = certs.map(c => c.id === formData.id ? { ...c, ...formData } : c); toast('Certificate updated ✓')
    } else {
      updated = [...certs, { ...formData, id: Date.now() }]; toast('Certificate added ✓')
    }
    setCerts(updated); syncCerts(updated); setCertModal({ show: false, data: null })
  }
  const deleteCert = (id) => {
    askConfirm('Remove this certificate?', () => {
      const updated = certs.filter(c => c.id !== id)
      setCerts(updated); syncCerts(updated); toast('Certificate removed')
    })
  }
  const moveCert = (id, dir) => {
    const idx = certs.findIndex(c => c.id === id); const j = idx + dir
    if (j < 0 || j >= certs.length) return
    const updated = [...certs]; [updated[idx], updated[j]] = [updated[j], updated[idx]]
    setCerts(updated); syncCerts(updated)
  }

  /* ─── SETTINGS ─── */
  const [siteTab, setSiteTab] = useState('home')
  const [adminTab, setAdminTab] = useState('profile')
  const saveSettings = async () => {
    try { await api.updateSettings(settings); toast('Settings saved ✓') }
    catch(e) { toast('Settings sync failed') }
  }

  if (loading) return <div style={{ padding: 40, textAlign:'center', color:'var(--muted)' }}>Loading admin data…</div>
  if (bootError) return <div style={{ padding: 40, textAlign:'center', color:'var(--danger)' }}>Could not reach API: {bootError}</div>

  /* ═══════════ RENDER SECTIONS ═══════════ */
  return (
    <>
      {/* ── DASHBOARD ── */}
      <section className={`page ${page === 'dashboard' ? 'active' : ''}`} id="page-dashboard">
        <div className="stat-grid">
          {[
            { cls:'t1', val: orders.length, lab:'Total Orders', trend:'up', note: '↑ 12.4% this month', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
            { cls:'t2', val: revDisplay, lab:'Revenue (USD)', trend:'up', note: '↑ 8.1% this month', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
            { cls:'t3', val: activeProds, lab:'Active Products', trend:'live', note: '✦ live count', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/></svg> },
            { cls:'t4', val: unreadInq, lab:'Unread Inquiries', trend:'down', note: '↓ needs reply', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg> }
          ].map(({ cls, val, lab, trend, note, icon }) => (
            <div key={lab} className={`stat ${cls}`}>
              <div className="stat-ico">{icon}</div>
              <div className="stat-val">{val}</div>
              <div className="stat-lab">{lab}</div>
              <div className={`stat-trend ${trend}`}>{note}</div>
            </div>
          ))}
        </div>
        <div className="grid-2">
          <div className="panel">
            <div className="panel-head">
              <div><div className="sec-title">Revenue Overview</div><div className="sec-sub">Monthly export revenue · last 8 months</div></div>
              <span className="tag ok"><span className="dot" /> Live</span>
            </div>
            <div className="panel-body"><RevenueChart /></div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="sec-title">Recent Activity</div><button className="btn-ghost btn-sm">View all</button></div>
            <div className="panel-body" style={{ paddingTop: 8 }}>
              {[
                {
                  c: 'g',
                  text: <>Order <b>#BA-1042</b> marked as shipped</>,
                  sub: 'Hamburg, Germany · 12 min ago',
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                },
                {
                  c: 'b',
                  text: <>New inquiry from <b>Nordic Wellness Co.</b></>,
                  sub: 'Salt Lamps · 48 min ago',
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
                },
                {
                  c: 'o',
                  text: <>Order <b>#BA-1041</b> awaiting payment</>,
                  sub: 'Dubai, UAE · 2 hrs ago',
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                },
                {
                  c: 'g',
                  text: <>New customer <b>Saltworks LLC</b> registered</>,
                  sub: 'Texas, USA · 5 hrs ago',
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                },
                {
                  c: 'r',
                  text: <><b>Coarse Edible Salt</b> low stock alert</>,
                  sub: 'Inventory · 8 hrs ago',
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                },
              ].map(({ c, text, sub, icon }, i) => (
                <div key={i} className="act">
                  <div className={`act-ico ${c}`}>{icon}</div>
                  <div className="act-body"><p>{text}</p><span>{sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel" style={{ marginTop: 18 }}>
          <div className="panel-head">
            <div className="sec-title">Recent Orders</div>
            <button className="btn btn-outline btn-sm" onClick={() => setPage('orders')}>View all orders</button>
          </div>
          <div className="tbl-wrap">
            <table><thead><tr><th>Order ID</th><th>Customer</th><th>Country</th><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id}>
                    <td><span className="t-id">#{o.id}</span></td>
                    <td><div className="cust-cell"><div className="cust-ava" style={{ background:'#'+o.cc }}>{o.cust?.[0]}</div>{o.cust}</div></td>
                    <td>{o.country}</td><td>{o.prod}</td>
                    <td><span className="t-amt">{o.amt}</span></td>
                    <td><StatusTag status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className={`page ${page === 'products' ? 'active' : ''}`} id="page-products">
        <div className="page-head">
          <div>
            <h2 id="prodHeading">{activeCat ? (activeCat.emoji+' '+activeCat.name) : 'All Categories'}</h2>
            <p>{activeCat ? activeCat.desc : 'Manage your full Himalayan salt product catalog'}</p>
          </div>
          <div className="gap-row">
            {activeCat && <button className="btn btn-outline" onClick={() => setActiveCat(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m15 18-6-6 6-6"/></svg> All Categories
            </button>}
            <button className="btn btn-primary" onClick={() => openProductModal()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg> Add Product
            </button>
          </div>
        </div>

        {!activeCat && (
          <div className="cat-grid">
            {cats.map(cat => {
              const count = products.filter(p => p.cat === cat.id).length
              return (
                <div key={cat.id} className="cat-card" onClick={() => setActiveCat(cat)} style={{ cursor:'pointer' }}>
                  <button className="cat-edit" onClick={(e) => { e.stopPropagation(); setCatModal({ show: true, data: { ...cat } }) }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                  </button>
                  {cat.img ? (
                    <div className="cat-emoji" style={{ background: `url(${cat.img}) center/cover`, borderRadius: 8, width: 48, height: 48, display: 'inline-block' }} />
                  ) : (
                    <div className="cat-emoji">{cat.emoji}</div>
                  )}
                  <h4>{cat.name}</h4>
                  <p>{cat.desc}</p>
                  <div className="cat-meta">
                    <b>{count} product{count !== 1 ? 's' : ''}</b>
                    <div className="cat-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeCat && (
          <>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom: 16 }}>
              <div className="prod-view-toggle">
                <button className={prodView === 'table' ? 'active' : ''} onClick={() => setProdView('table')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3h18v18H3z"/><path d="M3 9h18M3 15h18M9 3v18"/></svg> Table
                </button>
                <button className={prodView === 'cards' ? 'active' : ''} onClick={() => setProdView('cards')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> Cards
                </button>
              </div>
            </div>

            {/* Table view */}
            {prodView === 'table' && (() => {
              const catId = activeCat.id
              const list = products.filter(p => p.cat === catId)
              const catCols = colsFor(catId)
              return (
                <div className="aptbl-wrap">
                  <table className="aptbl">
                    <thead>
                      <tr>
                        <th className="c-sr">Sr#</th>
                        <th>Name</th>
                        {catCols.map(c => (
                          <th key={c.key} className="c-col">
                            <input className="col-head" defaultValue={c.label}
                              onBlur={(e) => renameColumn(catId, c.key, e.target.value)} />
                            <button className="col-del" onClick={() => deleteColumn(catId, c.key)}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                          </th>
                        ))}
                        <th>Status</th>
                        <th className="c-add">
                          <button className="col-add" onClick={() => setColModal({ show: true, catId })}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((p, i) => (
                        <tr key={p.id}>
                          <td className="c-sr">{i+1}</td>
                          <td className="c-name"><input defaultValue={p.name} onBlur={(e) => updateProdField(p.id, 'name', e.target.value.trim() || p.name)} /></td>
                          {catCols.map(c => (
                            <td key={c.key}><input defaultValue={p.specs?.[c.key] ?? '—'} onBlur={(e) => updateProdSpec(p.id, c.key, e.target.value)} /></td>
                          ))}
                          <td>
                            <select defaultValue={p.status} onChange={(e) => updateProdField(p.id, 'status', e.target.value)}>
                              {['Active','Draft','Out of Stock'].map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="c-act">
                            <div className="row-act">
                              <button className="ico-btn" title="Edit Product" onClick={() => openProductModal(p)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                              </button>
                              <button className="ico-btn del" title="Delete Product" onClick={() => deleteProduct(p.id)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="aptbl-foot">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg> {list.length} products · {catCols.length} columns · edits save automatically</span>
                    <button className="btn btn-primary btn-sm" onClick={() => openProductModal()}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg> Add Product
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* Cards view */}
            {prodView === 'cards' && (
              <div className="prod-grid">
                {products.filter(p => p.cat === activeCat.id).map(p => {
                  const [sc, st] = p.status === 'Active' ? ['ok','Active'] : p.status === 'Draft' ? ['warn','Draft'] : ['danger','Out of Stock']
                  return (
                    <div key={p.id} className="prod">
                      <div className="prod-img">{p.img ? <img src={p.img} alt={p.name} /> : <span className="ph">{activeCat.emoji}</span>}</div>
                      <div className="prod-body">
                        <div className="prod-cat">{activeCat.name}</div>
                        <div className="prod-name">{p.name}</div>
                        <div className="prod-desc">{p.desc}</div>
                        <div className="prod-foot">
                          <span className={`tag ${sc}`}><span className="dot" />{st}</span>
                          <div className="row-act">
                            <button className="ico-btn" onClick={() => openProductModal(p)}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                            </button>
                            <button className="ico-btn del" onClick={() => deleteProduct(p.id)}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* ── ORDERS ── */}
      <section className={`page ${page === 'orders' ? 'active' : ''}`} id="page-orders">
        <div className="stat-grid">
          <div className="stat t1">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg></div>
            <div className="stat-val">{orders.length}</div>
            <div className="stat-lab">Total Orders</div>
          </div>
          <div className="stat t2">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg></div>
            <div className="stat-val">{orders.filter(o=>o.status==='pending').length}</div>
            <div className="stat-lab">Pending</div>
          </div>
          <div className="stat t3">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
            <div className="stat-val">{orders.filter(o=>o.status==='shipped').length}</div>
            <div className="stat-lab">Shipped</div>
          </div>
          <div className="stat t4">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg></div>
            <div className="stat-val">{orders.filter(o=>o.status==='paid').length}</div>
            <div className="stat-lab">Paid</div>
          </div>
        </div>
        <div className="page-head">
          <div><h2>Orders</h2><p>Track and manage all export &amp; retail orders</p></div>
          <div className="gap-row">
            <button className="btn btn-primary" onClick={() => setOrderModal({ show: true, data: { status:'pending' } })}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg> New Order
            </button>
          </div>
        </div>
        <div className="tabs">
          {[['all','All'],['pending','Pending'],['processing','Processing'],['shipped','Shipped'],['paid','Paid']].map(([k,l]) => {
            const cnt = k === 'all' ? orders.length : orders.filter(o => o.status === k).length
            return <button key={k} className={`tab ${ordFilter === k ? 'active' : ''}`} onClick={() => setOrdFilter(k)}>{l} <span className="cnt">{cnt}</span></button>
          })}
        </div>
        <div className="panel">
          <div className="tbl-wrap">
            <table><thead><tr><th>Order ID</th><th>Customer</th><th>Country</th><th>Product</th><th>Qty</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {(ordFilter === 'all' ? orders : orders.filter(o => o.status === ordFilter)).map(o => (
                  <tr key={o.id}>
                    <td><span className="t-id">#{o.id}</span></td>
                    <td><div className="cust-cell"><div className="cust-ava" style={{ background:'#'+o.cc }}>{o.cust?.[0]}</div>{o.cust}</div></td>
                    <td>{o.country}</td><td>{o.prod}</td><td>{o.qty}</td>
                    <td><span className="t-amt">{o.amt}</span></td>
                    <td><StatusTag status={o.status} /></td>
                    <td style={{ color:'var(--muted)' }}>{o.date}</td>
                    <td><button className="ico-btn" onClick={() => setOrderModal({ show: true, data: { ...o } })}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                    </button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CUSTOMERS ── */}
      <section className={`page ${page === 'customers' ? 'active' : ''}`} id="page-customers">
        <div className="stat-grid">
          <div className="stat t1">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/></svg></div>
            <div className="stat-val">{customers.length}</div>
            <div className="stat-lab">Total Customers</div>
          </div>
          <div className="stat t2">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg></div>
            <div className="stat-val">{customers.filter(c => c.type === 'Retail').length}</div>
            <div className="stat-lab">Retail</div>
          </div>
        </div>
        <div className="page-head">
          <div><h2>Customers</h2><p>Your B2B importers and retail buyers</p></div>
          <button className="btn btn-primary" onClick={() => setCustModal({ show: true, data: {} })}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg> Add Customer
          </button>
        </div>
        <div className="cust-grid">
          {customers.map(c => (
            <div key={c.id} className="cust-card">
              <div className="cust-top">
                <div className="cust-ava" style={{ width:48, height:48, fontSize:17, background:'#'+c.cc }}>{c.name?.[0]}</div>
                <div><b>{c.name}</b><span>{c.type} · since {c.since}</span></div>
              </div>
              <div className="cust-stats">
                <div className="cust-stat"><b className="num">{c.orders}</b><span>Orders</span></div>
                <div className="cust-stat"><b className="num">{c.spent}</b><span>Spent</span></div>
              </div>
              <div className="cust-info">
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>{c.email}</div>
                <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{c.country}</div>
              </div>
              <div className="cust-actions">
                <button className="btn btn-outline btn-sm" onClick={() => setCustModal({ show: true, data: { ...c } })}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteCustomer(c.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INQUIRIES ── */}
      <section className={`page ${page === 'inquiries' ? 'active' : ''}`} id="page-inquiries">
        <div className="stat-grid">
          <div className="stat t1">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg></div>
            <div className="stat-val">{inquiries.length}</div>
            <div className="stat-lab">Total Inquiries</div>
          </div>
          <div className="stat t2">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg></div>
            <div className="stat-val">{inquiries.filter(i => !i.read && !i.archived).length}</div>
            <div className="stat-lab">Unread</div>
          </div>
          <div className="stat t3">
            <div className="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg></div>
            <div className="stat-val">{inquiries.filter(i => i.read && !i.archived).length}</div>
            <div className="stat-lab">Replied</div>
          </div>
        </div>
        <div className="page-head"><div><h2>Inquiries</h2><p>Quote requests and contact form submissions</p></div></div>
        <div className="tabs">
          {[['all','All'],['unread','Unread'],['replied','Replied']].map(([k,l]) => {
            const vis = inquiries.filter(i => !i.archived)
            const cnt = k === 'all' ? vis.length : k === 'unread' ? vis.filter(i => !i.read).length : vis.filter(i => i.read).length
            return <button key={k} className={`tab ${inqFilter === k ? 'active' : ''}`} onClick={() => setInqFilter(k)}>{l} <span className="cnt">{cnt}</span></button>
          })}
        </div>
        {inquiries.filter(i => !i.archived).filter(i => {
          if (inqFilter === 'unread') return !i.read
          if (inqFilter === 'replied') return i.read
          return true
        }).map(i => (
          <div key={i.id} className={`inq ${!i.read ? 'unread' : ''}`}>
            <div className="inq-ava" style={{ background:'#'+i.cc }}>{i.name?.[0]}</div>
            <div className="inq-body">
              <div className="inq-top">
                <div><b>{i.name}</b><div className="inq-meta">{i.company} · {i.country}</div></div>
                <div style={{ textAlign:'right' }}>
                  <div className="inq-time">{i.time}</div>
                  {i.read ? <span className="tag ok" style={{ marginTop:6 }}><span className="dot" />Replied</span> : <span className="tag warn" style={{ marginTop:6 }}><span className="dot" />Unread</span>}
                </div>
              </div>
              <div className="inq-subj">{i.subj}</div>
              <div className="inq-msg">{i.msg}</div>
              <div className="inq-foot">
                <button className="btn btn-primary btn-sm" onClick={() => setReplyModal({ show: true, data: i })}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg> Reply
                </button>
                {!i.read && <button className="btn btn-outline btn-sm" onClick={() => markRead(i.id)}>Mark as read</button>}
                <button className="btn-ghost btn-sm" onClick={() => archiveInq(i.id)}>Archive</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteInquiry(i.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── SITE SETTINGS ── */}
      <section className={`page ${page === 'site' ? 'active' : ''}`} id="page-site">
        <div className="page-head">
          <div><h2>Site Settings</h2><p>Content shown live on the public Bin Aouf website</p></div>
          <button className="btn btn-primary" onClick={saveSettings}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg> Save Changes
          </button>
        </div>
        <div className="set-grid">
          <div className="set-nav">
            {[['home','Home Categories'],['certs','Certifications'],['contact','Contact Info'],['social','Social Media'],['general','General']].map(([k,l]) => (
              <button key={k} className={siteTab === k ? 'active' : ''} onClick={() => setSiteTab(k)}>{l}</button>
            ))}
          </div>
          <div className="card" style={{ padding: 28 }}>
            {/* Home Categories */}
            {siteTab === 'home' && (
              <>
                <div className="set-card-head" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:14 }}>
                  <div><h3>Home Page Categories</h3><p>Category cards shown in the "Shop by Category" grid on your live homepage</p></div>
                  <button className="btn btn-primary btn-sm" onClick={() => setHomecatModal({ show: true, data: { emoji:'🧂', title:'', desc:'', link:'' } })}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg> Add Card
                  </button>
                </div>
                <div className="home-grid">
                  {homecats.map((h, i) => (
                    <div key={h.id} className="home-card">
                      <div className="hc-img">
                        {h.img ? <img src={h.img} alt={h.title} /> : <span className="ph">{h.emoji||'🧂'}</span>}
                        <div className="hc-reorder">
                          <button onClick={() => moveHomecat(h.id, -1)} disabled={i===0}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m18 15-6-6-6 6"/></svg>
                          </button>
                          <button onClick={() => moveHomecat(h.id, 1)} disabled={i===homecats.length-1}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 9 6 6 6-6"/></svg>
                          </button>
                        </div>
                      </div>
                      <div className="hc-body">
                        <b>{h.title}</b><p>{h.desc}</p>
                        <div className="hc-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => setHomecatModal({ show: true, data: { ...h } })}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteHomecat(h.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Certifications */}
            {siteTab === 'certs' && (
              <>
                <div className="set-card-head" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:14 }}>
                  <div><h3>Certifications &amp; Credentials</h3><p>The "Certified, Tested &amp; Globally Compliant" badges on your live site</p></div>
                  <button className="btn btn-primary btn-sm" onClick={() => setCertModal({ show: true, data: { emoji:'🏅', title:'', desc:'' } })}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg> Add Certificate
                  </button>
                </div>
                <div className="home-grid">
                  {certs.map((c, i) => (
                    <div key={c.id} className="home-card">
                      <div className="hc-img">
                        {c.img ? <img src={c.img} alt={c.title} /> : <span className="ph">{c.emoji||'🏅'}</span>}
                        <div className="hc-reorder">
                          <button onClick={() => moveCert(c.id, -1)} disabled={i===0}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m18 15-6-6-6 6"/></svg>
                          </button>
                          <button onClick={() => moveCert(c.id, 1)} disabled={i===certs.length-1}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 9 6 6 6-6"/></svg>
                          </button>
                        </div>
                      </div>
                      <div className="hc-body">
                        <b>{c.title}</b><p>{c.desc}</p>
                        <div className="hc-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => setCertModal({ show: true, data: { ...c } })}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteCert(c.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Contact Info */}
            {siteTab === 'contact' && (
              <>
                <div className="set-card-head"><h3>Contact Information</h3><p>These details appear in the footer and contact page across the live site</p></div>
                {[['email','Business Email'],['phone1','Phone 1'],['phone2','Phone 2'],['phone3','Phone 3'],['port','Export Port'],['airfreight','Air Freight Hub']].map(([k,l]) => (
                  <div key={k} className="field">
                    <label>{l}</label>
                    <input className="inp" value={settings[k]||''} onChange={(e) => setSettings(s => ({ ...s, [k]: e.target.value }))} />
                  </div>
                ))}
                <div className="field">
                  <label>Head Office Address</label>
                  <textarea className="inp" value={settings.address||''} onChange={(e) => setSettings(s => ({ ...s, address: e.target.value }))} />
                </div>
              </>
            )}
            {/* Social */}
            {siteTab === 'social' && (
              <>
                <div className="set-card-head"><h3>Social Media Links</h3><p>Icons link to these profiles in the site footer</p></div>
                {[['fb','Facebook'],['ig','Instagram'],['linkedin','LinkedIn'],['whatsapp','WhatsApp']].map(([k,l]) => (
                  <div key={k} className="field">
                    <label>{l}</label>
                    <input className="inp" value={settings[k]||''} onChange={(e) => setSettings(s => ({ ...s, [k]: e.target.value }))} />
                  </div>
                ))}
              </>
            )}
            {/* General */}
            {siteTab === 'general' && (
              <>
                <div className="set-card-head"><h3>General Site Info</h3><p>Branding and meta details for the public site</p></div>
                {[['siteTitle','Site Title'],['tagline','Tagline']].map(([k,l]) => (
                  <div key={k} className="field">
                    <label>{l}</label>
                    <input className="inp" value={settings[k]||''} onChange={(e) => setSettings(s => ({ ...s, [k]: e.target.value }))} />
                  </div>
                ))}
                <div className="field">
                  <label>Meta Description</label>
                  <textarea className="inp" value={settings.metaDesc||''} onChange={(e) => setSettings(s => ({ ...s, metaDesc: e.target.value }))} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── ADMIN SETTINGS ── */}
      <section className={`page ${page === 'admin' ? 'active' : ''}`} id="page-admin">
        <div className="page-head">
          <div><h2>Admin Settings</h2><p>Your account, security and panel preferences</p></div>
          <button className="btn btn-primary" onClick={saveSettings}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg> Save Changes
          </button>
        </div>
        <div className="set-grid">
          <div className="set-nav">
            {[['profile','Profile'],['security','Security'],['notify','Notifications']].map(([k,l]) => (
              <button key={k} className={adminTab === k ? 'active' : ''} onClick={() => setAdminTab(k)}>{l}</button>
            ))}
          </div>
          <div className="card" style={{ padding: 28 }}>
            {adminTab === 'profile' && (
              <>
                <div className="set-card-head"><h3>Admin Profile</h3><p>Update your personal admin details</p></div>
                <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:24 }}>
                  <div className="sb-ava" style={{ width:64, height:64, fontSize:24, background:'linear-gradient(135deg,var(--rose),var(--terra))' }}>
                    {((settings.adminName||'Admin').split(' ').map(w=>w[0]).join('').slice(0,2)).toUpperCase()}
                  </div>
                </div>
                <div className="field-row">
                  <div className="field"><label>Full Name</label><input className="inp" value={settings.adminName||''} onChange={(e) => setSettings(s => ({ ...s, adminName: e.target.value }))} /></div>
                  <div className="field"><label>Role</label><input className="inp" value="Super Admin" disabled style={{ opacity:.6 }} /></div>
                </div>
                <div className="field"><label>Email</label><input className="inp" value={settings.adminEmail||''} onChange={(e) => setSettings(s => ({ ...s, adminEmail: e.target.value }))} /></div>
                <div className="field mb-0"><label>Phone</label><input className="inp" value={settings.adminPhone||''} onChange={(e) => setSettings(s => ({ ...s, adminPhone: e.target.value }))} /></div>
              </>
            )}
            {adminTab === 'security' && (
              <>
                <div className="set-card-head"><h3>Security</h3><p>Keep your admin account protected</p></div>
                <div className="field"><label>Current Password</label><input className="inp" type="password" placeholder="••••••••" /></div>
                <div className="field-row">
                  <div className="field"><label>New Password</label><input className="inp" type="password" placeholder="••••••••" /></div>
                  <div className="field"><label>Confirm Password</label><input className="inp" type="password" placeholder="••••••••" /></div>
                </div>
                {[['Two-Factor Authentication','Add an extra layer of security on login',true],['Login Alerts','Email me when a new device signs in',true]].map(([b,sp,on]) => (
                  <div key={b} className="toggle-row">
                    <div><b>{b}</b><span>{sp}</span></div>
                    <div className={`switch ${on?'on':''}`} />
                  </div>
                ))}
                <button className="btn btn-primary" style={{ marginTop:20 }} onClick={() => toast('Password updated ✓')}>Update Password</button>
              </>
            )}
            {adminTab === 'notify' && (
              <>
                <div className="set-card-head"><h3>Notifications</h3><p>Choose what you get notified about</p></div>
                {[['New Orders','Email + panel alert on every new order',true],['New Inquiries','Notify me when a quote request comes in',true],['Low Stock Alerts','Warn me when a product runs low',true],['Weekly Summary','A digest of sales & traffic every Monday',false],['Marketing Tips','Occasional product & growth suggestions',false]].map(([b,sp,on]) => (
                  <div key={b} className="toggle-row">
                    <div><b>{b}</b><span>{sp}</span></div>
                    <div className={`switch ${on?'on':''}`} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══ MODALS ═══ */}

      {/* Product modal */}
      <ProductModal
        show={prodModal.show}
        data={prodModal.data}
        cats={cats}
        colsFor={colsFor}
        onSave={saveProduct}
        onClose={() => setProdModal({ show: false, data: null })}
      />

      {/* Category edit modal */}
      <Modal show={catModal.show} onClose={() => setCatModal({ show: false, data: null })} title="Edit Category"
        footer={<><button className="btn btn-outline" onClick={() => setCatModal({ show: false, data: null })}>Cancel</button><button className="btn btn-primary" onClick={() => saveCat(catModal.data)}>Save Category</button></>}>
        {catModal.data && (
          <>
            <div className="field"><label>Category Image <small>shown in category cards</small></label>
              <ImgUpload
                img={catModal.data.img || ''}
                onImg={(img) => setCatModal(m => ({ ...m, data: { ...m.data, img } }))}
                onRemove={() => setCatModal(m => ({ ...m, data: { ...m.data, img: '' } }))}
                phEmoji={catModal.data.emoji || '📦'}
              />
            </div>
            <div className="field"><label>Emoji / Icon <small>fallback if no image</small></label><input className="inp" value={catModal.data.emoji||''} maxLength={4} style={{ width:90, textAlign:'center', fontSize:20 }} onChange={(e) => setCatModal(m => ({ ...m, data: { ...m.data, emoji: e.target.value } }))} /></div>
            <div className="field"><label>Category Name</label><input className="inp" value={catModal.data.name||''} onChange={(e) => setCatModal(m => ({ ...m, data: { ...m.data, name: e.target.value } }))} /></div>
            <div className="field mb-0"><label>Description</label><textarea className="inp" value={catModal.data.desc||''} onChange={(e) => setCatModal(m => ({ ...m, data: { ...m.data, desc: e.target.value } }))} /></div>
          </>
        )}
      </Modal>

      {/* Add column modal */}
      <Modal show={colModal.show} onClose={() => setColModal({ show: false, catId: null })} title="Add Column"
        footer={<><button className="btn btn-outline" onClick={() => setColModal({ show: false, catId: null })}>Cancel</button><button className="btn btn-primary" onClick={() => addColumn(colModal.catId, colName)}>Add Column</button></>}>
        <div className="field mb-0">
          <label>Column Name <small>e.g. Packing, Color, HS Code</small></label>
          <input className="inp" value={colName} onChange={(e) => setColName(e.target.value)} placeholder="Type column name…" onKeyDown={(e) => { if (e.key === 'Enter') addColumn(colModal.catId, colName) }} />
        </div>
      </Modal>

      {/* Order modal */}
      <OrderModal show={orderModal.show} data={orderModal.data} onSave={saveOrder} onDelete={deleteOrder} onClose={() => setOrderModal({ show: false, data: null })} />

      {/* Customer modal */}
      <CustomerModal show={custModal.show} data={custModal.data} onSave={saveCustomer} onDelete={deleteCustomer} onClose={() => setCustModal({ show: false, data: null })} />

      {/* Reply modal */}
      <Modal show={replyModal.show} onClose={() => setReplyModal({ show: false, data: null })} title="Reply to Inquiry"
        footer={<><button className="btn btn-outline" onClick={() => setReplyModal({ show: false, data: null })}>Cancel</button><button className="btn btn-primary" onClick={() => sendReply(replyModal.data?.id)}>Send Reply</button></>}>
        {replyModal.data && (
          <>
            <div style={{ background:'var(--cream)', borderRadius:12, padding:16, marginBottom:18 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{replyModal.data.name} · {replyModal.data.company}</div>
              <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:4 }}>{replyModal.data.msg}</div>
            </div>
            <div className="field"><label>Subject</label><input className="inp" defaultValue={`Re: ${replyModal.data.subj}`} /></div>
            <div className="field mb-0"><label>Message</label><textarea className="inp" style={{ minHeight:130 }} defaultValue={`Dear ${replyModal.data.name?.split(' ')[0]},\n\nThank you for reaching out to Bin Aouf. We'd be glad to share a quote and product samples for your requirement.\n\nBest regards,\nBin Aouf Export Team`} /></div>
          </>
        )}
      </Modal>

      {/* Homecat modal */}
      <HomecatModal show={homecatModal.show} data={homecatModal.data} cats={cats} onSave={saveHomecat} onClose={() => setHomecatModal({ show: false, data: null })} />

      {/* Cert modal */}
      <CertModal show={certModal.show} data={certModal.data} onSave={saveCert} onClose={() => setCertModal({ show: false, data: null })} />

      {/* Confirm modal */}
      <ConfirmModal show={confirm.show} msg={confirm.msg} onConfirm={doConfirm} onCancel={() => setConfirm(c => ({ ...c, show: false }))} okLabel={confirm.okLabel} />

      <Toast msg={toastMsg} show={toastShow} />
    </>
  )
}

/* ── Product Form Modal ── */
function ProductModal({ show, data, cats, colsFor, onSave, onClose }) {
  const [form, setForm] = useState(data || {})
  useEffect(() => { if (data) setForm(data) }, [data])
  if (!data) return null
  const catCols = colsFor(form.cat || cats[0]?.id || '')
  const handleCatChange = (catId) => {
    const cols = colsFor(catId)
    const specs = {}
    cols.forEach(c => { specs[c.key] = form.specs?.[c.key] ?? '—' })
    setForm(f => ({ ...f, cat: catId, specs }))
  }
  return (
    <Modal show={show} onClose={onClose} title={data.id ? 'Edit Product' : 'Add Product'}
      footer={<><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => { if (!form.name?.trim()) return; onSave(form) }}>Save Product</button></>}>
      <div className="field"><label>Product Name</label><input className="inp" value={form.name||''} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Fine Edible Salt 1kg" /></div>
      <div className="field"><label>Category</label>
        <select className="inp" value={form.cat||''} onChange={(e) => handleCatChange(e.target.value)}>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="field"><label>Product Image</label>
        <ImgUpload img={form.img} onImg={(img) => setForm(f => ({ ...f, img }))} onRemove={() => setForm(f => ({ ...f, img:'' }))} phEmoji={cats.find(c => c.id === form.cat)?.emoji || '🧂'} />
      </div>
      <div className="field"><label>Description</label><textarea className="inp" value={form.desc||''} onChange={(e) => setForm(f => ({ ...f, desc: e.target.value }))} /></div>
      {catCols.length > 0 && (
        <div>
          {catCols.map((c, i) => i % 2 === 0 ? (
            <div key={c.key} className="field-row">
              <div className="field"><label>{c.label}</label><input className="inp" value={(form.specs?.[c.key]==='—')?'' : (form.specs?.[c.key]||'')} placeholder="—" onChange={(e) => setForm(f => ({ ...f, specs: { ...f.specs, [c.key]: e.target.value || '—' } }))} /></div>
              {catCols[i+1] && <div className="field"><label>{catCols[i+1].label}</label><input className="inp" value={(form.specs?.[catCols[i+1].key]==='—')?'' : (form.specs?.[catCols[i+1].key]||'')} placeholder="—" onChange={(e) => setForm(f => ({ ...f, specs: { ...f.specs, [catCols[i+1].key]: e.target.value || '—' } }))} /></div>}
            </div>
          ) : null)}
        </div>
      )}
      <div className="field"><label>Status</label>
        <select className="inp" value={form.status||'Active'} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
          {['Active','Draft','Out of Stock'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field mb-0"><label>Tags <small>comma separated</small></label><input className="inp" value={form.tags||''} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="export, food-grade, bulk" /></div>
    </Modal>
  )
}

/* ── Order Modal ── */
function OrderModal({ show, data, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(data || {})
  useEffect(() => { if (data) setForm(data) }, [data])
  if (!show) return null
  const isEdit = !!data?.id && data.id.toString().startsWith('BA-')
  return (
    <Modal show={show} onClose={onClose} title={isEdit ? `Edit Order #${data.id}` : 'New Order'}
      footer={<>
        {isEdit && <button className="btn btn-danger" onClick={() => onDelete(data.id)}>Delete</button>}
        <span className="spacer" />
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => { if (!form.cust?.trim()) return; onSave(form) }}>Save Order</button>
      </>}>
      <div className="field-row">
        <div className="field"><label>Customer</label><input className="inp" value={form.cust||''} onChange={(e) => setForm(f => ({ ...f, cust: e.target.value }))} placeholder="Company name" /></div>
        <div className="field"><label>Country</label><input className="inp" value={form.country||''} onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} placeholder="🇩🇪 Germany" /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>Product</label><input className="inp" value={form.prod||''} onChange={(e) => setForm(f => ({ ...f, prod: e.target.value }))} placeholder="Salt Lamps" /></div>
        <div className="field"><label>Quantity</label><input className="inp" value={form.qty||''} onChange={(e) => setForm(f => ({ ...f, qty: e.target.value }))} placeholder="500 pc" /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>Amount</label><input className="inp" value={form.amt||''} onChange={(e) => setForm(f => ({ ...f, amt: e.target.value }))} placeholder="$4,900" /></div>
        <div className="field"><label>Status</label>
          <select className="inp" value={form.status||'pending'} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
            {['pending','processing','shipped','paid'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div className="field mb-0"><label>Date</label><input className="inp" value={form.date||''} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} placeholder="Jun 21" /></div>
    </Modal>
  )
}

/* ── Customer Modal ── */
function CustomerModal({ show, data, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(data || {})
  useEffect(() => { if (data) setForm(data) }, [data])
  if (!show) return null
  return (
    <Modal show={show} onClose={onClose} title={data?.id ? 'Edit Customer' : 'Add Customer'}
      footer={<>
        {data?.id && <button className="btn btn-danger" onClick={() => onDelete(data.id)}>Delete</button>}
        <span className="spacer" />
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => { if (!form.name?.trim()) return; onSave(form) }}>Save Customer</button>
      </>}>
      <div className="field"><label>Company / Name</label><input className="inp" value={form.name||''} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Hamburg Salt GmbH" /></div>
      <div className="field-row">
        <div className="field"><label>Type</label><input className="inp" value={form.type||''} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} placeholder="B2B Importer" /></div>
        <div className="field"><label>Country</label><input className="inp" value={form.country||''} onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Germany" /></div>
      </div>
      <div className="field"><label>Email</label><input className="inp" value={form.email||''} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="orders@company.com" /></div>
      <div className="field-row mb-0">
        <div className="field mb-0"><label>Total Orders</label><input className="inp" value={form.orders||''} onChange={(e) => setForm(f => ({ ...f, orders: e.target.value }))} placeholder="0" /></div>
        <div className="field mb-0"><label>Total Spent</label><input className="inp" value={form.spent||''} onChange={(e) => setForm(f => ({ ...f, spent: e.target.value }))} placeholder="$0" /></div>
      </div>
    </Modal>
  )
}

/* ── Homecat Modal ── */
function HomecatModal({ show, data, cats, onSave, onClose }) {
  const [form, setForm] = useState(data || {})
  useEffect(() => { if (data) setForm(data) }, [data])
  if (!show) return null
  return (
    <Modal show={show} onClose={onClose} title={data?.id ? 'Edit Home Category' : 'Add Home Category'}
      footer={<><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => { if (!form.title?.trim()) return; onSave(form) }}>Save Card</button></>}>
      <div className="field"><label>Card Image <small>shown on homepage</small></label>
        <ImgUpload img={form.img} onImg={(img) => setForm(f => ({ ...f, img }))} onRemove={() => setForm(f => ({ ...f, img:'' }))} phEmoji={form.emoji||'🧂'} />
      </div>
      <div className="field"><label>Title</label><input className="inp" value={form.title||''} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Edible Salt" /></div>
      <div className="field"><label>Short Description</label><textarea className="inp" value={form.desc||''} onChange={(e) => setForm(f => ({ ...f, desc: e.target.value }))} /></div>
      <div className="field-row" style={{ gap:14 }}>
        <div className="field mb-0" style={{ flex:1 }}><label>Emoji <small>fallback</small></label><input className="inp" value={form.emoji||'🧂'} maxLength={4} style={{ textAlign:'center', fontSize:20 }} onChange={(e) => setForm(f => ({ ...f, emoji: e.target.value }))} /></div>
        <div className="field mb-0" style={{ flex:2 }}><label>Links to Category</label>
          <select className="inp" value={form.link||''} onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}>
            <option value="">— none —</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  )
}

/* ── Cert Modal ── */
function CertModal({ show, data, onSave, onClose }) {
  const [form, setForm] = useState(data || {})
  useEffect(() => { if (data) setForm(data) }, [data])
  if (!show) return null
  return (
    <Modal show={show} onClose={onClose} title={data?.id ? 'Edit Certificate' : 'Add Certificate'}
      footer={<><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => { if (!form.title?.trim()) return; onSave(form) }}>Save Certificate</button></>}>
      <div className="field"><label>Badge / Logo Image <small>optional</small></label>
        <ImgUpload img={form.img} onImg={(img) => setForm(f => ({ ...f, img }))} onRemove={() => setForm(f => ({ ...f, img:'' }))} phEmoji={form.emoji||'🏅'} />
      </div>
      <div className="field"><label>Emoji / Icon <small>fallback if no image</small></label><input className="inp" value={form.emoji||'🏅'} maxLength={4} style={{ width:90, textAlign:'center', fontSize:20 }} onChange={(e) => setForm(f => ({ ...f, emoji: e.target.value }))} /></div>
      <div className="field"><label>Title</label><input className="inp" value={form.title||''} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. ISO 22000" /></div>
      <div className="field mb-0"><label>Description</label><textarea className="inp" value={form.desc||''} onChange={(e) => setForm(f => ({ ...f, desc: e.target.value }))} /></div>
    </Modal>
  )
}
