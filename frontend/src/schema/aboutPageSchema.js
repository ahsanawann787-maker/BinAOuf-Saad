const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",

  name: "About Bin Aouf",

  url: "https://www.binaouf.com/about",

  description:
    "Learn about Bin Aouf, a trusted Himalayan Pink Salt manufacturer and exporter from Pakistan.",

  isPartOf: {
    "@type": "WebSite",
    name: "Bin Aouf",
    url: "https://www.binaouf.com"
  },

  about: {
    "@type": "Organization",
    name: "Bin Aouf"
  }
}

export default aboutPageSchema