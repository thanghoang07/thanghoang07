/**
 * 🚀 Main Application Entry Point
 * Clean and simple initialization
 */

import './style.css'

console.log('🚀 Main.js loaded');

// Initialize loading screen management
initLoadingScreen();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM ready, initializing features...');
  
  // Initialize theme toggle first (to prevent dark mode flash)
  initThemeToggle();
  
  // Initialize language toggle
  initLanguageToggle();
  
  // Initialize other features
  initScrollEffects();
  initContactForm();
  
  // Debug images
  debugImages();
  
  // Initialize floating background animations
  initFloatingShapes();
  
  // Initialize micro interactions
  initMicroInteractions();
  
  // Initialize scroll progress indicator
  initScrollProgress();
  
  // Initialize parallax effects
  initParallaxEffects();
  
  console.log('✅ All features initialized');
  
  // Finish loading after everything is initialized
  finishLoading();
});

// ===== LOADING SCREEN MANAGEMENT =====
function initLoadingScreen() {
  console.log('⏳ Initializing loading screen...');
  
  // Apply saved theme immediately to prevent flash
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}

function finishLoading() {
  console.log('🎯 Finishing loading process...');
  
  // Wait a bit for images and resources to load
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    const mainContent = document.getElementById('main-content');
    
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
    
    if (mainContent) {
      mainContent.classList.add('fade-in');
    }
    
    // Mark body as loaded
    document.body.classList.add('loaded');
    
    console.log('✅ Loading complete!');
  }, 300); // Small delay to ensure everything is ready
}

// Handle window load event for additional resources
window.addEventListener('load', () => {
  console.log('🌟 Window fully loaded, ensuring smooth transition...');
  // Additional cleanup if needed
});

function initThemeToggle() {
  console.log('🎨 Initializing theme toggle...');
  
  const button = document.getElementById('toggle-theme');
  if (!button) {
    console.warn('Theme button not found');
    return;
  }
  
  // Load saved theme (already applied in initLoadingScreen)
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Just update the button state, theme already applied
  updateThemeButton(savedTheme);
  
  // Add click handler
  button.addEventListener('click', () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log(`🔄 Switching from ${currentTheme} to ${newTheme}`);
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    console.log(`✅ Theme switched to: ${newTheme}`);
    
    // Force repaint
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  });
  
  console.log('✅ Theme toggle ready');
}

function applyTheme(theme) {
  const root = document.documentElement;
  
  console.log(`🎨 Applying theme: ${theme}`);
  
  if (theme === 'dark') {
    root.classList.add('dark');
    console.log('✅ Dark class added to html element');
  } else {
    root.classList.remove('dark');
    console.log('✅ Dark class removed from html element');
  }
  
  // Update button state
  updateThemeButton(theme);
  
  // Debug: Check if dark class is actually on the root
  setTimeout(() => {
    const isDark = root.classList.contains('dark');
    console.log(`🔍 Root element has dark class: ${isDark}`);
  }, 100);
}

function updateThemeButton(theme) {
  const button = document.getElementById('toggle-theme');
  if (!button) return;
  
  const moonIcon = button.querySelector('.fa-moon');
  const sunIcon = button.querySelector('.fa-sun');
  
  if (theme === 'dark') {
    if (moonIcon) moonIcon.classList.add('hidden');
    if (sunIcon) sunIcon.classList.remove('hidden');
  } else {
    if (moonIcon) moonIcon.classList.remove('hidden');
    if (sunIcon) sunIcon.classList.add('hidden');
  }
  
  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1e293b' : '#9333ea');
  }
}

let currentLanguage = 'vi'; // Global variable to track current language

// Translation data
const translations = {
  vi: {
    // Navigation
    'nav-services': 'Dịch vụ',
    'nav-portfolio': 'Dự án',
    'nav-experience': 'Kinh nghiệm',
    'nav-blog': 'Blog',
    'nav-resume': 'Hồ sơ',
    
    // Hero section
    'hero-mynameis': 'Tên tôi là',
    'hero-name': 'Thang Hoang Duc.',
    'hero-intro': 'Front-end developer với hơn 5 năm kinh nghiệm phát triển giao diện người dùng, đam mê tạo ra sản phẩm web hiện đại và tối ưu trải nghiệm người dùng.',
    
    // Specialized section
    'specialized-subtitle': 'Chuyên môn',
    'specialized-title': 'Chuyên về',
    'skill-ibm-title': 'Phát triển IBM BPM',
    'ux-desc': 'Phát triển ứng dụng IBM BPM với JavaScript và Java, thiết kế giao diện theo gui-spec.',
    'skill-mobile-title': 'Phát triển Mobile',
    'webdev-desc': 'Phát triển ứng dụng mobile cross-platform bằng Xamarin.Forms cho iOS/Android.',
    'skill-iot-title': 'Phát triển IoT',
    'webdesign-desc': 'Phát triển ứng dụng IoT và kết nối Azure IoT hub cho thiết bị tùy biến.',
    
    // Portfolio section
    'portfolio-subtitle': 'Dự án của tôi',
    'portfolio-title': 'Dự án nổi bật',
    'project-agency-title': 'Website Agency',
    'project-agency-category': 'Thiết kế Web',
    'project-dashboard-title': 'Nền tảng Dashboard',
    'project-dashboard-category': 'Phát triển Web',
    'project-ecommerce-title': 'Website Thương mại điện tử',
    'project-ecommerce-category': 'Thiết kế UX',
    
    // Work experience
    'workexp-subtitle': 'Con đường sự nghiệp',
    'workexp-title': 'Kinh nghiệm làm việc',
    'role-hpt': 'IBM BPM Developer',
    'company-hpt-full': 'HPT Vietnam Corporation',
    'location-hpt': 'TP. Hồ Chí Minh, Việt Nam',
    'period-hpt': 'Tháng 10/2022 - Hiện tại · Toàn thời gian',
    
    // Education
    'education-subtitle': 'Học vấn & Kỹ năng',
    'education-title': 'Học vấn & Kỹ năng',
    'university-name': 'TRƯỜNG ĐẠI HỌC NÔNG LÂM TP.HCM',
    'faculty-name': 'Khoa công nghệ thông tin',
    'education-period': '09/2014 – 2018',
    'skills-intro': 'Trong hơn 5 năm, tôi đã không ngừng học hỏi trong lĩnh vực CNTT và thử nghiệm các công nghệ, framework mới, và ngày nay đã có được tổng hợp những kỹ năng chính:',
    'skill-csharp-label': 'C#',
    'skill-java-label': 'Java',
    'skill-javascript-label': 'JavaScript',
    
    // Certifications
    'certifications-subtitle': 'Chứng chỉ',
    'certifications-title': 'Chứng chỉ',
    'cert-xamarin-title': 'Phát triển ứng dụng Mobile đa nền tảng Xamarin',
    'cert-xamarin-date': '05/2018',
    'cert-flutter-title': 'Phát triển Flutter',
    'cert-flutter-date': '01/2023',
    
    // Contact
    'contact-subtitle': 'Liên hệ',
    'contact-title': 'Liên hệ',
    'contact-address-label': 'Địa chỉ',
    'contact-address-value': 'Đa Kao, Quận 1, TP.HCM, Việt Nam',
    'contact-emailinfo-label': 'Email',
    'contact-phone-label': 'Điện thoại',
    'contact-linkedin-label': 'LinkedIn',
    'copyright': '© 2025 thanghoang07. Tất cả quyền được bảo lưu.'
  },
  en: {
    // Navigation
    'nav-services': 'Services',
    'nav-portfolio': 'Portfolio',
    'nav-experience': 'Experience',
    'nav-blog': 'Blog',
    'nav-resume': 'Resume',
    
    // Hero section
    'hero-mynameis': 'My name is',
    'hero-name': 'Thang Hoang Duc.',
    'hero-intro': 'Front-end developer with 5+ years of experience in UI development, passionate about creating modern web products and optimizing user experience.',
    
    // Specialized section
    'specialized-subtitle': 'Specialized',
    'specialized-title': 'Specialized in',
    'skill-ibm-title': 'IBM BPM Development',
    'ux-desc': 'Develop IBM BPM applications with JavaScript and Java, design interfaces according to gui-spec.',
    'skill-mobile-title': 'Mobile Development',
    'webdev-desc': 'Develop cross-platform mobile applications using Xamarin.Forms for iOS/Android.',
    'skill-iot-title': 'IoT Development',
    'webdesign-desc': 'Develop IoT applications and connect Azure IoT hub for custom devices.',
    
    // Portfolio section
    'portfolio-subtitle': 'My Works',
    'portfolio-title': 'Featured Portfolios',
    'project-agency-title': 'Agency Website',
    'project-agency-category': 'Web Design',
    'project-dashboard-title': 'Dashboard Platform',
    'project-dashboard-category': 'Web Development',
    'project-ecommerce-title': 'E-commerce Website',
    'project-ecommerce-category': 'UX Design',
    
    // Work experience
    'workexp-subtitle': 'Career Path',
    'workexp-title': 'Work Experience',
    'role-hpt': 'IBM BPM Developer',
    'company-hpt-full': 'HPT Vietnam Corporation',
    'location-hpt': 'Ho Chi Minh City, Vietnam',
    'period-hpt': 'Oct 2022 - Present · Full-time',
    
    // Education
    'education-subtitle': 'Education & Skills',
    'education-title': 'Education & Skills',
    'university-name': 'NONG LAM UNIVERSITY – HO CHI MINH CITY',
    'faculty-name': 'Faculty of information technology',
    'education-period': '09/2014 – 2018',
    'skills-intro': 'For 5+ years, I have been continuously learning in the field of IT and experimenting with new technologies and frameworks, and today have gained a summary of key skills:',
    'skill-csharp-label': 'C#',
    'skill-java-label': 'Java',
    'skill-javascript-label': 'JavaScript',
    
    // Certifications
    'certifications-subtitle': 'Certifications',
    'certifications-title': 'Certifications',
    'cert-xamarin-title': 'Xamarin Cross-Platform Mobile Apps Development',
    'cert-xamarin-date': '05/2018',
    'cert-flutter-title': 'Flutter Development',
    'cert-flutter-date': '01/2023',
    
    // Contact
    'contact-subtitle': 'Contact',
    'contact-title': 'Contact',
    'contact-address-label': 'Address',
    'contact-address-value': 'DaKao, District 1, HCMC, VietNam',
    'contact-emailinfo-label': 'Email',
    'contact-phone-label': 'Phone',
    'contact-linkedin-label': 'LinkedIn',
    'copyright': '© 2025 thanghoang07. All rights reserved.'
  }
};

function initLanguageToggle() {
  console.log('🌐 Initializing language toggle...');
  
  const button = document.getElementById('toggle-language');
  if (!button) {
    console.warn('Language button not found');
    return;
  }
  
  // Load saved language
  const savedLang = localStorage.getItem('language') || 'vi';
  currentLanguage = savedLang;
  console.log(`🌐 Saved language: ${savedLang}`);
  applyLanguage(savedLang);
  
  // Add click handler
  button.addEventListener('click', function(e) {
    console.log('🌐 Language button clicked!');
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle language
    const newLang = currentLanguage === 'vi' ? 'en' : 'vi';
    
    console.log(`🌐 Switching from ${currentLanguage} to ${newLang}`);
    
    currentLanguage = newLang;
    applyLanguage(newLang);
    localStorage.setItem('language', newLang);
    
    console.log(`✅ Language switched to: ${newLang}`);
  });
  
  console.log('✅ Language toggle ready');
}

function applyLanguage(lang) {
  console.log(`🌐 Applying language: ${lang}`);
  
  // Update flag icons
  const viIcon = document.getElementById('lang-vi-icon');
  const enIcon = document.getElementById('lang-en-icon');
  
  console.log('🌐 VI Icon found:', !!viIcon);
  console.log('🌐 EN Icon found:', !!enIcon);
  
  if (lang === 'vi') {
    if (viIcon) {
      viIcon.classList.remove('hidden');
      viIcon.style.display = 'inline';
      console.log('🌐 Showing VI flag:', viIcon.src);
    }
    if (enIcon) {
      enIcon.classList.add('hidden');
      enIcon.style.display = 'none';
      console.log('🌐 Hiding EN flag');
    }
  } else {
    if (viIcon) {
      viIcon.classList.add('hidden');
      viIcon.style.display = 'none';
      console.log('🌐 Hiding VI flag');
    }
    if (enIcon) {
      enIcon.classList.remove('hidden');
      enIcon.style.display = 'inline';
      console.log('🌐 Showing EN flag:', enIcon.src);
    }
  }
  
  // Translate content
  translateContent(lang);
  
  // Set document language
  document.documentElement.setAttribute('lang', lang);
  console.log(`🌐 Document language set to: ${lang}`);
}

function translateContent(lang) {
  console.log(`🌐 Translating content to: ${lang}`);
  
  const langData = translations[lang];
  if (!langData) {
    console.warn(`🌐 No translation data for language: ${lang}`);
    return;
  }
  
  let translatedCount = 0;
  
  // Translate all elements with IDs that exist in translation data
  Object.keys(langData).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.textContent = langData[key];
      translatedCount++;
    }
  });
  
  console.log(`🌐 Translated ${translatedCount} elements to ${lang}`);
  
  // Update form placeholders based on language
  updateFormPlaceholders(lang);
}

function updateFormPlaceholders(lang) {
  const placeholders = {
    vi: {
      'contact-name-input': 'Họ tên',
      'contact-email-input': 'Email',
      'contact-message-input': 'Tin nhắn',
      'contact-send-btn': 'Gửi tin nhắn'
    },
    en: {
      'contact-name-input': 'Name',
      'contact-email-input': 'Email',
      'contact-message-input': 'Message',
      'contact-send-btn': 'Send Message'
    }
  };
  
  const langPlaceholders = placeholders[lang];
  if (!langPlaceholders) return;
  
  Object.keys(langPlaceholders).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      if (element.tagName === 'BUTTON') {
        element.textContent = langPlaceholders[id];
      } else {
        element.placeholder = langPlaceholders[id];
      }
    }
  });
}

function initScrollEffects() {
  console.log('📜 Initializing scroll effects...');
  
  // Enhanced scroll reveal for all animation types
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
  console.log(`📜 Found ${revealElements.length} elements with scroll animations`);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationType = getAnimationType(element);
        const stagger = getStaggerDelay(element);
        
        console.log(`📜 Animating element with type: ${animationType}, stagger: ${stagger}ms`);
        
        setTimeout(() => {
          applyAnimation(element, animationType);
        }, stagger);
        
        // Stop observing once animated
        observer.unobserve(element);
      }
    });
  }, { 
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Start animation a bit before element is fully visible
  });
  
  // Prepare and observe all elements
  revealElements.forEach((el, index) => {
    prepareElementForAnimation(el, index);
    observer.observe(el);
  });
  
  // Initialize lazy loading for images
  initLazyLoading();
  
  // Force load all images immediately for testing
  forceLoadImages();
  
  // Initialize progress bar animations
  initProgressBars();
  
  console.log('✅ Scroll effects ready');
}

function getAnimationType(element) {
  if (element.classList.contains('scroll-reveal-left')) return 'fade-in-left';
  if (element.classList.contains('scroll-reveal-right')) return 'fade-in-right';
  if (element.classList.contains('scroll-reveal-scale')) return 'fade-in-scale';
  return 'fade-in-up'; // default
}

function getStaggerDelay(element) {
  const staggerAttr = element.getAttribute('data-stagger');
  if (!staggerAttr) return 0;
  
  const staggerMap = {
    'stagger-1': 0,
    'stagger-2': 200,
    'stagger-3': 400,
    'stagger-4': 600
  };
  
  return staggerMap[staggerAttr] || 0;
}

function prepareElementForAnimation(element, index) {
  const animationType = getAnimationType(element);
  
  // Set initial state based on animation type
  element.style.opacity = '0';
  element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
  
  switch (animationType) {
    case 'fade-in-left':
      element.style.transform = 'translateX(-50px)';
      break;
    case 'fade-in-right':
      element.style.transform = 'translateX(50px)';
      break;
    case 'fade-in-scale':
      element.style.transform = 'scale(0.8)';
      break;
    case 'fade-in-up':
    default:
      element.style.transform = 'translateY(30px)';
      break;
  }
}

function applyAnimation(element, animationType) {
  element.style.opacity = '1';
  
  switch (animationType) {
    case 'fade-in-left':
    case 'fade-in-right':
      element.style.transform = 'translateX(0)';
      break;
    case 'fade-in-scale':
      element.style.transform = 'scale(1)';
      break;
    case 'fade-in-up':
    default:
      element.style.transform = 'translateY(0)';
      break;
  }
  
  // Add a subtle bounce effect for scale animations
  if (animationType === 'fade-in-scale') {
    setTimeout(() => {
      element.style.transform = 'scale(1.02)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 150);
    }, 100);
  }
}

function initLazyLoading() {
  console.log('🖼️ Initializing lazy loading...');
  
  // Find all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  console.log(`🖼️ Found ${lazyImages.length} lazy images`);
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          console.log(`🖼️ Loading image: ${src}`);
          img.src = src;
          img.removeAttribute('data-src');
          
          // Add fade in effect
          img.style.opacity = '0';
          img.onload = () => {
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '1';
            console.log(`✅ Image loaded: ${src}`);
          };
          
          // Add error handler with fallback
          img.onerror = () => {
            console.warn(`⚠️ Image failed to load: ${src}, using fallback`);
            img.src = createFallbackImage(img.alt || 'Image');
            img.style.opacity = '1';
          };
          
          imageObserver.unobserve(img);
        }
      }
    });
  }, { threshold: 0.1 });
  
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
  
  console.log('✅ Lazy loading ready');
}

function createFallbackImage(text) {
  // Create a data URL with a simple placeholder
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = '#9333ea';
  ctx.fillRect(0, 0, 400, 300);
  
  // Draw text
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, 200, 150);
  
  return canvas.toDataURL();
}

function forceLoadImages() {
  console.log('🖼️ Force loading all images...');
  
  // Force load all data-src images immediately
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    const src = img.getAttribute('data-src');
    if (src) {
      console.log(`🖼️ Force loading: ${src}`);
      img.src = src;
      img.removeAttribute('data-src');
      
      img.onerror = () => {
        console.warn(`⚠️ Force load failed: ${src}`);
        img.src = createFallbackImage(img.alt || 'Image');
      };
    }
  });
  
  console.log(`🖼️ Force loaded ${lazyImages.length} images`);
}

function initProgressBars() {
  console.log('📊 Initializing progress bar animations...');
  
  const progressBars = document.querySelectorAll('.progress-bar');
  console.log(`📊 Found ${progressBars.length} progress bars`);
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.getAttribute('data-target-width') || progressBar.style.width;
        const targetPercent = parseInt(targetWidth); // Extract number from "85%"
        
        console.log(`📊 Animating progress bar to: ${targetWidth}`);
        
        // Add transition
        progressBar.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Animate from 0 to target width
        let currentWidth = 0;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (ease-out)
          const eased = 1 - Math.pow(1 - progress, 3);
          currentWidth = Math.round(targetPercent * eased);
          
          progressBar.style.width = `${currentWidth}%`;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            console.log(`✅ Progress bar animation complete: ${targetWidth}`);
          }
        };
        
        // Start animation after a small stagger delay
        const delay = Array.from(progressBars).indexOf(progressBar) * 200;
        setTimeout(() => {
          animate();
        }, delay);
        
        // Stop observing this element
        progressObserver.unobserve(progressBar);
      }
    });
  }, { threshold: 0.3 }); // Trigger when 30% of the element is visible
  
  // Store original widths and observe each progress bar
  progressBars.forEach((bar, index) => {
    const originalWidth = bar.style.width;
    bar.setAttribute('data-target-width', originalWidth);
    
    // Start with 0 width
    bar.style.width = '0%';
    
    progressObserver.observe(bar);
    
    console.log(`📊 Progress bar ${index + 1} ready - target: ${originalWidth}`);
  });
  
  console.log('✅ Progress bar animations ready');
}

function initFloatingShapes() {
  console.log('✨ Initializing floating shapes...');
  
  const container = document.getElementById('floating-shapes-container');
  if (!container) {
    console.warn('Floating shapes container not found');
    return;
  }
  
  // Create floating shapes
  const shapes = [];
  const colors = ['#9333ea', '#7c3aed', '#a855f7', '#c084fc', '#e879f9'];
  const shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
  
  for (let i = 0; i < 12; i++) {
    const shape = document.createElement('div');
    const size = Math.random() * 120 + 40; // 40-160px
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    
    let borderRadius = '50%'; // default circle
    let clipPath = '';
    
    switch (shapeType) {
      case 'square':
        borderRadius = '15%';
        break;
      case 'triangle':
        borderRadius = '0';
        clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        break;
      case 'hexagon':
        borderRadius = '0';
        clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
        break;
    }
    
    shape.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, ${color}15, ${color}05);
      border-radius: ${borderRadius};
      ${clipPath ? `clip-path: ${clipPath};` : ''}
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${0.05 + Math.random() * 0.1};
      filter: blur(${Math.random() * 2}px);
      animation: floatShape${i} ${20 + Math.random() * 15}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    
    // Create unique animation for each shape
    const keyframes = `
      @keyframes floatShape${i} {
        0%, 100% {
          transform: translate(0, 0) rotate(0deg) scale(1);
        }
        25% {
          transform: translate(${Math.random() * 150 - 75}px, ${Math.random() * 150 - 75}px) rotate(90deg) scale(${0.8 + Math.random() * 0.4});
        }
        50% {
          transform: translate(${Math.random() * 150 - 75}px, ${Math.random() * 150 - 75}px) rotate(180deg) scale(${1.1 + Math.random() * 0.3});
        }
        75% {
          transform: translate(${Math.random() * 150 - 75}px, ${Math.random() * 150 - 75}px) rotate(270deg) scale(${0.9 + Math.random() * 0.2});
        }
      }
    `;
    
    // Add keyframes to document
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    container.appendChild(shape);
    shapes.push(shape);
  }
  
  // Add gradient overlay for depth
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.03) 0%, transparent 70%),
                radial-gradient(circle at 80% 60%, rgba(124, 58, 237, 0.02) 0%, transparent 60%),
                radial-gradient(circle at 60% 20%, rgba(168, 85, 247, 0.02) 0%, transparent 50%);
    pointer-events: none;
  `;
  container.appendChild(overlay);
  
  console.log(`✨ Created ${shapes.length} floating shapes with gradient overlay`);
}

function initMicroInteractions() {
  console.log('⚡ Initializing micro interactions...');
  
  // Enhanced hover effects for cards
  const cards = document.querySelectorAll('.card, .skill-card, .project-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Magnetic effect for buttons
  const magneticElements = document.querySelectorAll('.magnetic, [data-magnetic]');
  magneticElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0, 0)';
    });
  });
  
  // Ripple effects for buttons
  const rippleElements = document.querySelectorAll('[data-ripple]');
  rippleElements.forEach(element => {
    element.addEventListener('click', createRipple);
  });
  
  console.log('⚡ Micro interactions ready');
}

function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  const rect = button.getBoundingClientRect();
  circle.style.cssText = `
    width: ${diameter}px;
    height: ${diameter}px;
    left: ${event.clientX - rect.left - radius}px;
    top: ${event.clientY - rect.top - radius}px;
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    pointer-events: none;
    animation: ripple 0.6s linear;
  `;
  
  // Add ripple keyframes if not exists
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(circle);
  
  setTimeout(() => {
    circle.remove();
  }, 600);
}

function initScrollProgress() {
  console.log('📊 Initializing scroll progress indicator...');
  
  // Create scroll progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, #9333ea, #a855f7);
    border-radius: 0 0 2px 2px;
    box-shadow: 0 2px 10px rgba(147, 51, 234, 0.3);
    z-index: 10001;
    width: 0%;
    transition: width 0.1s ease;
  `;
  
  document.body.appendChild(progressBar);
  
  // Update progress on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  });
  
  console.log('✅ Scroll progress indicator ready');
}

function initParallaxEffects() {
  console.log('🌊 Initializing parallax effects...');
  
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length === 0) {
    // Add parallax to hero section elements
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.setAttribute('data-parallax', '0.1');
    }
    
    // Add parallax to floating shapes
    const shapesContainer = document.getElementById('floating-shapes-container');
    if (shapesContainer) {
      shapesContainer.setAttribute('data-parallax', '0.05');
    }
  }
  
  const allParallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    allParallaxElements.forEach(element => {
      const rate = parseFloat(element.getAttribute('data-parallax')) || 0.1;
      const yPos = -(scrolled * rate);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
  
  console.log(`🌊 Parallax effects ready for ${allParallaxElements.length} elements`);
}

function debugImages() {
  console.log('🖼️ Debugging all images...');
  
  const allImages = document.querySelectorAll('img');
  console.log(`🖼️ Found ${allImages.length} total images`);
  
  allImages.forEach((img, index) => {
    console.log(`🖼️ Image ${index + 1}:`, {
      id: img.id || 'no-id',
      src: img.src || 'no-src',
      dataSrc: img.getAttribute('data-src') || 'no-data-src',
      alt: img.alt || 'no-alt',
      visible: img.offsetWidth > 0 && img.offsetHeight > 0,
      classes: img.className,
      display: window.getComputedStyle(img).display,
      visibility: window.getComputedStyle(img).visibility
    });
    
    // Add error handler
    img.onerror = () => {
      console.error(`❌ Image failed to load:`, img.src || img.getAttribute('data-src'));
    };
    
    img.onload = () => {
      console.log(`✅ Image loaded successfully:`, img.src);
    };
  });
}

function initContactForm() {
  console.log('📧 Initializing contact form...');
  
  const form = document.querySelector('#contact form');
  if (!form) {
    console.warn('Contact form not found');
    return;
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('name') || document.getElementById('contact-name-input')?.value;
    const email = formData.get('email') || document.getElementById('contact-email-input')?.value;
    const message = formData.get('message') || document.getElementById('contact-message-input')?.value;
    
    console.log('Contact form submitted:', { name, email, message });
    
    // Simple success message
    alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
    form.reset();
  });
  
  console.log('✅ Contact form ready');
}

// Initialize work experience tabs
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.company-tab');
  const details = document.querySelectorAll('.company-detail');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const company = tab.dataset.company;
      
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active', 'bg-purple-50', 'text-purple-600'));
      tabs.forEach(t => t.classList.add('bg-white', 'text-gray-700'));
      
      // Add active class to clicked tab
      tab.classList.add('active', 'bg-purple-50', 'text-purple-600');
      tab.classList.remove('bg-white', 'text-gray-700');
      
      // Hide all details
      details.forEach(d => d.classList.add('hidden'));
      
      // Show selected detail
      const targetDetail = document.getElementById(`exp-${company}`);
      if (targetDetail) {
        targetDetail.classList.remove('hidden');
      }
      
      console.log(`Switched to company: ${company}`);
    });
  });
});

console.log('🎉 Main application script loaded!');