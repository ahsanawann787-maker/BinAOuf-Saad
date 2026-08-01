import { Helmet } from 'react-helmet-async'
import organizationSchema from '../schema/organizationSchema'
import websiteSchema from '../schema/websiteSchema'

export default function SEO({
  title,
  description,
  canonical,
  image = 'https://www.binaouf.com/og-image.jpg',
  type = 'website',
  schema = null
}) {
  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <link
        rel="canonical"
        href={canonical}
      />

      {/* Robots */}
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bin Aouf" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">
  {JSON.stringify(organizationSchema)}
</script>
<script type="application/ld+json">
  {JSON.stringify(websiteSchema)}
</script>
{schema && (
  <script type="application/ld+json">
    {JSON.stringify(schema)}
  </script>
)}
    </Helmet>
  )
}
