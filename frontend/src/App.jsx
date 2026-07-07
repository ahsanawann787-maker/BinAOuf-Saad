import { Routes, Route, Outlet } from 'react-router-dom'
import './index.css'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Process from './pages/Process'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Blogs from './pages/Blogs'
import BlogDetails from './pages/BlogDetails'
import AdminLayout from './pages/admin/AdminLayout'

/* Shared wrapper rendered for all public routes */
function PublicLayout() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <Outlet />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <Loader />
      <Routes>
        {/* ── Admin ── */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* ── Public (Navbar + Footer wrapper via Outlet) ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:categoryId" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/process" element={<Process />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          {/* Fallback → Home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </>
  )
}
