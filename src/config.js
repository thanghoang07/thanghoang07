// Site configuration and metadata
export const siteConfig = {
  title: "Thang Hoang Duc - Frontend Developer Portfolio",
  description: "Frontend developer với hơn 5 năm kinh nghiệm phát triển giao diện người dùng, đam mê tạo ra sản phẩm web hiện đại, tối ưu trải nghiệm người dùng.",
  author: "Thang Hoang Duc",
  url: "https://thanghoang07.github.io/",
  image: "https://ui-avatars.com/api/?name=Thang+Hoang+Duc&background=9333ea&color=fff&size=1200",
  themeColor: "#9333ea",
  keywords: "frontend developer, portfolio, javascript, react, vue, web development, UI/UX, responsive design, vietnam",
  
  // Contact info
  contact: {
    email: "thanghoang07@gmail.com",
    phone: "+84932431562",
    address: "DaKao, District 1, HCMC, VietNam",
    linkedin: "https://linkedin.com/in/thanghoang07"
  },
  
  // Social links
  social: {
    facebook: "#",
    twitter: "#", 
    linkedin: "#",
    github: "#"
  },
  
  // SEO and performance
  preconnectDomains: [
    "https://cdnjs.cloudflare.com",
    "https://ui-avatars.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com"
  ],
  
  // External resources
  fonts: [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  ]
};

// Structured data for SEO
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": siteConfig.author,
  "jobTitle": "Frontend Developer", 
  "description": siteConfig.description,
  "url": siteConfig.url,
  "image": `https://ui-avatars.com/api/?name=Thang+Hoang+Duc&background=9333ea&color=fff&size=400`,
  "sameAs": [
    "https://www.linkedin.com/in/thanghoang07",
    "https://github.com/thanghoang07"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "HPT Vietnam Corporation"
  },
  "alumniOf": {
    "@type": "EducationalOrganization", 
    "name": "Nong Lam University - Ho Chi Minh City"
  },
  "knowsAbout": [
    "JavaScript", "Java", "IBM BPM", "Xamarin", "C#", "Azure IoT", "Frontend Development", "UI/UX Design"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ho Chi Minh City",
    "addressCountry": "VN"
  },
  "email": siteConfig.contact.email,
  "telephone": siteConfig.contact.phone
};

// Generate meta tags
export function generateMetaTags() {
  return `
    <!-- Primary Meta Tags -->
    <title>${siteConfig.title}</title>
    <meta name="title" content="${siteConfig.title}">
    <meta name="description" content="${siteConfig.description}">
    <meta name="keywords" content="${siteConfig.keywords}">
    <meta name="author" content="${siteConfig.author}">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English, Vietnamese">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${siteConfig.url}">
    <meta property="og:title" content="${siteConfig.title}">
    <meta property="og:description" content="${siteConfig.description}">
    <meta property="og:image" content="${siteConfig.image}">
    <meta property="og:site_name" content="${siteConfig.author} Portfolio">
    <meta property="og:locale" content="en_US">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${siteConfig.url}">
    <meta property="twitter:title" content="${siteConfig.title}">
    <meta property="twitter:description" content="${siteConfig.description}">
    <meta property="twitter:image" content="${siteConfig.image}">

    <!-- Additional SEO Meta Tags -->
    <meta name="theme-color" content="${siteConfig.themeColor}">
    <meta name="msapplication-TileColor" content="${siteConfig.themeColor}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Thang Portfolio">

    <!-- Canonical URL -->
    <link rel="canonical" href="${siteConfig.url}">
  `;
}