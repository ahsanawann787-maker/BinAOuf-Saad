import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import api, { API } from '../services/api'

function getImageUrl(img) {
  if (!img) return '';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
  const base = API.replace(/\/api$/, '');
  return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
}

export default function BlogDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useReveal()

  useEffect(() => {
    let active = true
    async function loadBlog() {
      try {
        const res = await api.getPublicBlogBySlug(slug)
        if (active && res?.data) {
          setBlog(res.data)
        }
      } catch (err) {
        console.error('Blog fetch error:', err)
        if (active) setError('Article not found or unavailable.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadBlog()
    return () => { active = false }
  }, [slug])

  // Inject SEO meta tags and JSON-LD schema
  useEffect(() => {
    if (!blog) return

    const title = blog.metaTitle || blog.title
    const desc = blog.metaDescription || blog.excerpt || ''
    const img = getImageUrl(blog.featuredImage)
    const url = window.location.href

    document.title = `${title} — Bin Aouf`

    const setMeta = (sel, attr, val) => {
      let el = document.querySelector(sel)
      if (!el) {
        el = document.createElement('meta')
        const parts = sel.replace('meta[', '').replace(']', '').split('=')
        el.setAttribute(parts[0], parts[1]?.replace(/"/g, '') || '')
        document.head.appendChild(el)
      }
      el.setAttribute(attr, val)
    }

    setMeta('meta[name="description"]', 'content', desc)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:type"]', 'content', 'article')
    setMeta('meta[property="og:url"]', 'content', url)
    if (img) setMeta('meta[property="og:image"]', 'content', img)
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', desc)

    // JSON-LD BlogPosting
    const schemaId = 'blog-jsonld-schema'
    let script = document.getElementById(schemaId)
    if (!script) {
      script = document.createElement('script')
      script.id = schemaId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': blog.title,
      'description': blog.excerpt || '',
      'image': img || '',
      'datePublished': blog.createdAt,
      'dateModified': blog.updatedAt,
      'author': { '@type': 'Organization', 'name': 'Bin Aouf' },
      'publisher': {
        '@type': 'Organization',
        'name': 'Bin Aouf',
        'logo': { '@type': 'ImageObject', 'url': `${window.location.origin}/favicon.ico` }
      },
      'url': url,
      'keywords': blog.tags || ''
    })

    return () => {
      const ex = document.getElementById(schemaId)
      if (ex) ex.remove()
    }
  }, [blog])

  if (loading) {
    return (
      <div className="page active" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
        <div>Loading article...</div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="page active" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'var(--muted)' }}>
        <div style={{ fontSize: 48 }}>📰</div>
        <h2 style={{ color: 'var(--terra-deep)' }}>Article Not Found</h2>
        <p>{error || 'The blog post you requested does not exist.'}</p>
        <button className="btn-primary" onClick={() => navigate('/blogs')}>Back to Blogs →</button>
      </div>
    )
  }

  const displayImg = getImageUrl(blog.featuredImage)
  const publishDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const tags = blog.tags ? blog.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <div id="page-blog-details" className="page active" style={{ background: 'var(--cream)' }}>
      {/* HERO BANNER */}
      <div className="blog-details-banner" style={{
        position: 'relative',
        minHeight: 420,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: `linear-gradient(135deg, var(--terra) 0%, var(--terra-deep) 100%)`
      }}>
        {displayImg && (
          <img
            src={displayImg}
            alt={blog.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,8,4,0.88) 0%, rgba(20,8,4,0.4) 55%, transparent 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 60, paddingTop: 140 }}>
          {blog.category && (
            <span style={{ display: 'inline-block', background: 'var(--rose)', color: 'white', fontSize: 10, padding: '4px 14px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
              {blog.category}
            </span>
          )}
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 52px)', color: 'white', lineHeight: 1.2, marginBottom: 16, maxWidth: 760 }}>
            {blog.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{publishDate}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Bin Aouf Editorial</span>
          </div>
        </div>
      </div>

      {/* BLOG CONTENT */}
      <div className="container" style={{ maxWidth: 820, margin: '0 auto', padding: '60px 24px' }}>
        {/* Excerpt */}
        {blog.excerpt && (
          <p style={{
            fontSize: 17,
            fontStyle: 'italic',
            color: 'var(--terra)',
            borderLeft: '4px solid var(--rose)',
            paddingLeft: 20,
            marginBottom: 40,
            lineHeight: 1.7,
            fontWeight: 400
          }}>
            {blog.excerpt}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
            {tags.map((tag, i) => (
              <span key={i} style={{ fontSize: 10, background: 'var(--cream2)', border: '1px solid var(--sand)', padding: '4px 12px', color: 'var(--muted)', letterSpacing: '0.5px' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Rich Text Content */}
        <div
          className="blog-rich-content"
          style={{
            fontSize: 15,
            lineHeight: 1.9,
            color: 'var(--ink)',
            fontWeight: 300
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Back button */}
        <div style={{ marginTop: 60, borderTop: '1px solid var(--sand)', paddingTop: 36, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <button className="btn-outline" onClick={() => navigate('/blogs')}>← Back to Blogs</button>
          <button className="btn-primary" onClick={() => navigate('/contact')}>Request a Quote →</button>
        </div>
      </div>
    </div>
  )
}
