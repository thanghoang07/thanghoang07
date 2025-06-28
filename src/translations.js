const translations = {
  vi: {
    name: "Thang Hoang Duc.",
    intro: "Front-end developer với hơn 5 năm kinh nghiệm phát triển giao diện người dùng, đam mê tạo ra sản phẩm web hiện đại, tối ưu trải nghiệm người dùng.",
    services: "Dịch vụ",
    portfolio: "Dự án",
    experience: "Kinh nghiệm",
    blog: "Blog",
    resume: "Tải CV",
    myNameIs: "Tôi tên là",
    specialized: "Chuyên môn",
    ux: "Phát triển ứng dụng IBM BPM với JavaScript và Java, thiết kế giao diện theo gui-spec.",
    webdev: "Phát triển ứng dụng mobile cross-platform bằng Xamarin.Forms cho iOS/Android.",
    webdesign: "Phát triển ứng dụng IoT và kết nối Azure IoT hub cho thiết bị tùy biến.",
    featured: "Dự án tiêu biểu",
    workexp: "Kinh nghiệm làm việc",
    seniorux: "Dẫn dắt team thiết kế trải nghiệm người dùng cho nhiều sản phẩm.",
    uidev: "Phát triển và bảo trì các thành phần front-end cho công cụ nội bộ.",
    webdes: "Thiết kế web và prototype cho các chiến dịch marketing.",
    blogtitle: "Blog cá nhân",
    blog1: "Xu hướng thiết kế web hiện đại và phát triển trong tương lai.",
    blog2: "Các mẹo thiết kế UX giúp nâng cao trải nghiệm người dùng.",
    blog3: "Kinh nghiệm và best practice cho phát triển web hiện đại.",
    testimonials: "Khách hàng nhận xét",
    testi1: "Làm việc với Thang rất tuyệt vời. Sự tỉ mỉ và sáng tạo đã giúp dự án thành công.",
    testi2: "Chuyên môn về UX của Thang giúp chúng tôi tăng tương tác người dùng rõ rệt.",
    testi3: "Chuyên nghiệp, sáng tạo và luôn đúng deadline. Rất đáng tin cậy!",
    copyright: "© 2025 thanghoang07. All rights reserved."
  },
  en: {
    name: "Thang Hoang Duc.",
    intro: "Front-end developer with 5+ years of experience in UI development, passionate about creating modern web products and optimizing user experience.",
    services: "Services",
    portfolio: "Portfolio",
    experience: "Experience",
    blog: "Blog",
    resume: "Resume",
    myNameIs: "My name is",
    specialized: "Specialized in",
    ux: "IBM BPM application development with JavaScript and Java, designing interfaces according to gui-spec.",
    webdev: "Cross-platform mobile app development using Xamarin.Forms for iOS/Android.",
    webdesign: "IoT application development and Azure IoT hub integration for custom devices.",
    featured: "Featured Portfolios",
    workexp: "Work Experience",
    seniorux: "Led the UX team for various products.",
    uidev: "Developed and maintained front-end components for internal tools.",
    webdes: "Designed websites and prototypes for marketing campaigns.",
    blogtitle: "Personal Blog",
    blog1: "Trends in modern web design and future development.",
    blog2: "UX design tips to enhance user experience.",
    blog3: "Best practices and experience for modern web development.",
    testimonials: "Testimonials",
    testi1: "Working with Thang was great. His attention to detail and creativity made the project a success.",
    testi2: "Thang's UX expertise helped us increase user engagement significantly.",
    testi3: "Professional, creative, and always on time. Highly reliable!",
    copyright: "© 2025 thanghoang07. All rights reserved."
  }
}

const idsMap = {
  "nav-services": "services",
  "nav-portfolio": "portfolio",
  "nav-experience": "experience",
  "nav-blog": "blog",
  "nav-resume": "resume",
  "nav-services-mobile": "services",
  "nav-portfolio-mobile": "portfolio",
  "nav-experience-mobile": "experience",
  "nav-blog-mobile": "blog",
  "nav-resume-mobile": "resume",
  "hero-mynameis": "myNameIs",
  "hero-name": "name",
  "hero-intro": "intro",
  "specialized-title": "specialized",
  "ux-desc": "ux",
  "webdev-desc": "webdev",
  "webdesign-desc": "webdesign",
  "portfolio-title": "featured",
  "workexp-title": "workexp",
  "seniorux-desc": "seniorux",
  "uidev-desc": "uidev",
  "webdes-desc": "webdes",
  "blog-title": "blogtitle",
  "blog1-desc": "blog1",
  "blog2-desc": "blog2",
  "blog3-desc": "blog3",
  "testimonials-title": "testimonials",
  "testi1-desc": "testi1",
  "testi2-desc": "testi2",
  "testi3-desc": "testi3",
  "copyright": "copyright"
}

let currentLanguage = 'vi' // Default language

export function initTranslations() {
  // Load saved language preference
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage
  }
  
  // Apply initial translation
  applyTranslation(currentLanguage)
  
  // Set up language toggle
  setupLanguageToggle()
}

function setupLanguageToggle() {
  const toggleLanguageBtn = document.getElementById('toggle-language')
  const langViIcon = document.getElementById('lang-vi-icon')
  const langEnIcon = document.getElementById('lang-en-icon')
  
  if (toggleLanguageBtn) {
    toggleLanguageBtn.addEventListener('click', () => {
      // Toggle language
      currentLanguage = currentLanguage === 'vi' ? 'en' : 'vi'
      
      // Update icons
      if (currentLanguage === 'vi') {
        langViIcon.classList.remove('hidden')
        langEnIcon.classList.add('hidden')
      } else {
        langViIcon.classList.add('hidden')
        langEnIcon.classList.remove('hidden')
      }
      
      // Apply translation
      applyTranslation(currentLanguage)
      
      // Save preference
      localStorage.setItem('language', currentLanguage)
    })
  }
  
  // Set initial icon state
  if (currentLanguage === 'vi') {
    langViIcon.classList.remove('hidden')
    langEnIcon.classList.add('hidden')
  } else {
    langViIcon.classList.add('hidden')
    langEnIcon.classList.remove('hidden')
  }
}

function applyTranslation(language) {
  // Use idsMap to translate elements
  for (const [id, key] of Object.entries(idsMap)) {
    const element = document.getElementById(id)
    if (element && translations[language][key]) {
      element.textContent = translations[language][key]
    }
  }
}

export function getCurrentLanguage() {
  return currentLanguage
} 