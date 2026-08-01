const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",

  mainEntity: [

    {
      "@type": "Question",
      "name": "What is the minimum order quantity (MOQ)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MOQ varies by product. Samples start from 5 to 10kg. Wholesale from 100 to 500kg. Full container orders from 5 to 10 tons depending on product."
      }
    },

    {
      "@type": "Question",
      "name": "Can you provide private label packaging?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Bin Aouf provides complete private label and white label manufacturing services."
      }
    },

    {
      "@type": "Question",
      "name": "Do you export worldwide?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Bin Aouf exports Himalayan Pink Salt products worldwide."
      }
    }

  ]
}

export default faqPageSchema