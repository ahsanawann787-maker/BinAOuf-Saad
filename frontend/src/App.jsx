import { Routes, Route } from 'react-router-dom'
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
import AdminLayout from './pages/admin/AdminLayout'

export default function App() {
  return (
    <>
      <Loader />
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Public site routes */}
        <Route path="*" element={
          <>
            <Navbar />
            <WhatsAppFloat />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/process" element={<Process />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </>
  )
}
