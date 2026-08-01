const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  name: "Bin Aouf",

  url: "https://www.binaouf.com",

  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.binaouf.com/products",
    "query-input": "required name=search_term_string"
  }
}

export default websiteSchema