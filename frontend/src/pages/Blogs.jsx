import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import api, { API } from '../services/api'

function getImageUrl(img) {
  if (!img) return '';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  const base = API.replace(/\/api$/, '');
  return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
}

export default function Blogs() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 6

  useReveal()

  useEffect(() => {
    document.title = 'Latest Himalayan Salt Industry Insights & News — Bin Aouf'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Stay updated with our blog. Articles covering Himalayan salt benefits, retail packaging solutions, wholesale trade practices, mine source guides, and decoration tips.')
    }
  }, [])

  useEffect(() => {
    let active = true
    async function loadBlogs() {
      setLoading(true)
      try {
        const res = await api.getPublicBlogs(page, limit)
        if (active && res?.data) {
          setBlogs(res.data)
          setTotalPages(res.pages || 1)
        }
      } catch (err) {
        console.error('Error fetching blogs:', err)
        if (active) setError('Unable to load articles. Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadBlogs()
    return () => { active = false }
  }, [page])

  // Re-run reveal animations on page switch
  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => {
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
        { threshold: 0.1 }
      )
      document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el) => {
        if (!el.classList.contains('visible')) obs.observe(el)
      })
    }, 80)
    return () => clearTimeout(t)
  }, [page, loading])

  return (
    <div id="page-blogs" className="page active" style={{ background: 'var(--cream)' }}>
      {/* BANNER */}
      <div className="contact-banner" style={{ background: 'linear-gradient(135deg, var(--terra) 0%, var(--terra-deep) 100%)', padding: '140px 80px 70px', textAlign: 'left' }}>
        <div className="tag" style={{ color: 'var(--gold-lt)' }}>Resources & news</div>
        <h1 className="sec-title white" style={{ color: 'white' }}>Bin Aouf <em>Blogs</em></h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, maxWidth: 580, marginTop: 16 }}>
          Explore detailed guides, scientific reports, export strategies, and design inspirations regarding genuine Himalayan salt from Pakistan.
        </p>
      </div>

      {/* BLOG CARDS */}
      <div className="blogs-sec" style={{ padding: '80px 0', minHeight: '50vh' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>Loading articles...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>
              <p>{error}</p>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setPage(1)}>Retry</button>
            </div>
          ) : blogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No published blogs found. Check back later!</div>
          ) : (
            <>
              <div className="blogs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {blogs.map((blog, i) => {
                  const displayImg = getImageUrl(blog.featuredImage)
                  const publishDate = blog.createdAt 
                    ? new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Recent'

                  return (
                    <div 
                      key={blog.id || i} 
                      className="blog-card reveal" 
                      onClick={() => navigate(`/blogs/${blog.slug}`)}
                      style={{ 
                        background: 'white', 
                        borderRadius: 6, 
                        overflow: 'hidden', 
                        boxShadow: '0 4px 18px rgba(90,30,10,0.05)', 
                        display: 'flex', 
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'transform 0.35s ease, box-shadow 0.35s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)'
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(138,58,40,0.12)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '0 4px 18px rgba(90,30,10,0.05)'
                      }}
                    >
                      <div className="blog-card-media" style={{ height: 210, width: '100%', position: 'relative', overflow: 'hidden', background: '#e8d0b8' }}>
                        {displayImg ? (
                          <img 
                            src={displayImg} 
                            alt={blog.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }} 
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
                            onMouseLeave={(e) => e.target.style.transform = 'none'}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem', background: 'linear-gradient(135deg, var(--rose-dark) 0%, var(--terra-deep) 100%)' }}>
                            📰
                          </div>
                        )}
                        <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--terra)', color: 'white', fontSize: 10, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                          {blog.category || 'General'}
                        </span>
                      </div>
                      <div className="blog-card-body" style={{ padding: '24px 24px 30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>{publishDate}</span>
                        <h3 className="blog-card-title" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--terra-deep)', margin: '0 0 10px', lineHeight: 1.3, fontWeight: 700 }}>
                          {blog.title}
                        </h3>
                        <p className="blog-card-excerpt" style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300, margin: '0 0 20px', flex: 1 }}>
                          {blog.excerpt || 'Read our latest publication covering specifications, wholesale exporting guides, and trade compliance.'}
                        </p>
                        {blog.tags && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                            {blog.tags.split(',').map((t, ti) => (
                              <span key={ti} style={{ fontSize: 9, background: 'var(--cream2)', padding: '2px 8px', color: 'var(--muted)', borderRadius: 2 }}>
                                #{t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ borderTop: '1px solid var(--cream2)', paddingTop: 16 }}>
                          <button 
                            className="blog-card-btn" 
                            style={{ 
                              fontSize: 11, 
                              fontWeight: 600, 
                              letterSpacing: '1px', 
                              textTransform: 'uppercase', 
                              color: 'var(--terra)', 
                              borderBottom: '1px solid var(--rose)', 
                              paddingBottom: 2 
                            }}
                          >
                            Read Article →
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 50 }}>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    style={{ opacity: page === 1 ? 0.5 : 1 }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Page {page} of {totalPages}</span>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    style={{ opacity: page === totalPages ? 0.5 : 1 }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
