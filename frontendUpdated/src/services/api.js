// Central API service for Bin Aouf backend
const API = import.meta.env.VITE_API_URL || 'https://backend-udtn.vercel.app/api'

// Auth token helpers
const Auth = {
  get token() { try { return localStorage.getItem('ba_token') } catch { return null } },
  set token(v) { try { if (v) localStorage.setItem('ba_token', v); else localStorage.removeItem('ba_token') } catch {} },
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (Auth.token) headers['Authorization'] = 'Bearer ' + Auth.token
  const res = await fetch(API + path, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Request failed')
  return data
}

export const api = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => { Auth.token = null },
  getAuth: () => Auth,
  uploadImage: async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const token = localStorage.getItem('ba_token')
    const res = await fetch(`${API}/admin/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      body: fd
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Upload failed')
    return data
  },

  // Public
  submitInquiry: (payload) =>
    request('/public/inquiries', { method: 'POST', body: payload }),

  // Admin
  getProducts: () => request('/admin/products'),
  getCategories: () => request('/admin/categories'),
  getOrders: () => request('/admin/orders'),
  getCustomers: () => request('/admin/customers'),
  getInquiries: () => request('/admin/inquiries'),
  getSettings: () => request('/admin/settings'),
  updateSettings: (data) => request('/admin/settings', { method: 'PUT', body: data }),
  getHomeCategories: () => request('/admin/home-categories'),
  getCertifications: () => request('/admin/certifications'),
  getProductColumns: () => request('/admin/product-columns'),
  bulkPush: (endpoint, data) =>
    request('/admin/bulk/' + endpoint, { method: 'PUT', body: data }),
}

export { API }
export default api
