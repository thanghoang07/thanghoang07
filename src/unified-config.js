/**
 * 🎯 Unified Application Configuration
 * Centralized configuration for the entire portfolio application
 */

// 🏠 Site Configuration & Metadata
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

// 🎨 Animation Configuration
export const ANIMATION_CONFIG = {
  DURATION: 2000,
  TYPING_SPEED: 100,
  TYPING_DELAY: 500,
  CURSOR_DELAY: 1000,
  SCROLL_THRESHOLD: 0.1,
  SCROLL_MARGIN: '0px 0px -50px 0px',
  PARALLAX_SPEED: 0.5,
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  STAGGER_DELAY: 150
};

export const ANIMATION_CLASSES = {
  FADE_IN_UP: 'fade-in-up',
  FADE_IN_LEFT: 'fade-in-left',
  FADE_IN_RIGHT: 'fade-in-right',
  FADE_IN_SCALE: 'fade-in-scale',
  SLIDE_IN_UP: 'slide-in-up',
  SLIDE_IN_DOWN: 'slide-in-down',
  STAGGER_1: 'stagger-1',
  STAGGER_2: 'stagger-2',
  STAGGER_3: 'stagger-3',
  STAGGER_4: 'stagger-4',
  STAGGER_5: 'stagger-5'
};

// 🎨 Theme Configuration
export const THEME_CONFIG = {
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    NEON: 'neon',
    MINIMAL: 'minimal',
    NATURE: 'nature',
    SUNSET: 'sunset'
  },
  TRANSITION_DURATION: 300,
  AUTO_SWITCH_TIMES: {
    MORNING: 6,
    AFTERNOON: 12,
    EVENING: 18,
    NIGHT: 22
  },
  STORAGE_KEY: 'portfolio-theme'
};

// 📱 PWA Configuration
export const PWA_CONFIG = {
  SW_PATH: '/sw.js',
  MANIFEST_PATH: '/manifest.json',
  UPDATE_CHECK_INTERVAL: 60000,
  CACHE_NAMES: {
    STATIC: 'portfolio-static-v1',
    DYNAMIC: 'portfolio-dynamic-v1',
    IMAGES: 'portfolio-images-v1'
  },
  NOTIFICATIONS: {
    ENABLED: true,
    VAPID_KEY: 'BMh_XdONHYO1hOKfG5ezTHoLjN5lRyDw7zArz-1Y_MKaQfJbS9F3FfmhLX1ppO_L6-2ry2Y7z-0J7UK0BkL4ZnY'
  }
};

// ⚡ Performance Configuration
export const PERFORMANCE_CONFIG = {
  INTERSECTION_OBSERVER: {
    ROOT_MARGIN: '50px 0px',
    THRESHOLD: 0.1
  },
  LAZY_LOADING: {
    ENABLED: true,
    PLACEHOLDER: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+'
  },
  DEBOUNCE_DELAY: 250,
  THROTTLE_DELAY: 16
};

// 🎮 Micro-Interactions Configuration
export const INTERACTION_CONFIG = {
  MAGNETIC: {
    ENABLED: true,
    STRENGTH: 1,
    RADIUS: 100
  },
  RIPPLE: {
    ENABLED: true,
    DURATION: 600,
    SIZE: 1.2
  },
  GESTURES: {
    SWIPE_THRESHOLD: 30,
    PINCH_THRESHOLD: 0.1,
    LONG_PRESS_DURATION: 500
  },
  BATTERY_OPTIMIZATION: true,
  REDUCED_MOTION: true
};

// 📊 Analytics Configuration
export const ANALYTICS_CONFIG = {
  GA4_ID: null, // Set when available
  EVENTS: {
    PAGE_VIEW: 'page_view',
    THEME_CHANGE: 'theme_change',
    PWA_INSTALL: 'pwa_install',
    CONTACT_SUBMIT: 'contact_submit'
  },
  DEBUG: false
};

// 🌍 Internationalization
export const I18N_CONFIG = {
  DEFAULT_LANGUAGE: 'vi',
  SUPPORTED_LANGUAGES: ['vi', 'en'],
  STORAGE_KEY: 'portfolio-language'
};

// 🎯 SEO Configuration
export const SEO_CONFIG = {
  TITLE: 'Thang Hoang Duc - Frontend Developer Portfolio',
  DESCRIPTION: 'Frontend developer với hơn 5 năm kinh nghiệm phát triển giao diện người dùng',
  KEYWORDS: 'frontend developer, portfolio, javascript, react, vue, web development',
  AUTHOR: 'Thang Hoang Duc',
  URL: 'https://thanghoang07.github.io/',
  IMAGE: 'https://ui-avatars.com/api/?name=Thang+Hoang+Duc&background=9333ea&color=fff&size=1200'
};

// 🔧 Development Configuration
export const DEV_CONFIG = {
  DEBUG: true,
  PERFORMANCE_MONITORING: true,
  ERROR_REPORTING: true,
  CONSOLE_STYLING: {
    SUCCESS: 'color: #10b981; font-weight: bold;',
    ERROR: 'color: #ef4444; font-weight: bold;',
    WARNING: 'color: #f59e0b; font-weight: bold;',
    INFO: 'color: #3b82f6; font-weight: bold;'
  }
};

// 📱 Responsive Breakpoints
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,  
  XL: 1280,
  XXL: 1536
};

// 🎯 Feature Flags
export const FEATURE_FLAGS = {
  MICRO_INTERACTIONS: true,
  ADVANCED_THEMES: true,
  PWA: true,
  ANALYTICS: false,
  PERFORMANCE_MONITORING: true,
  ERROR_REPORTING: true,
  LAZY_LOADING: true,
  SECTION_LAZY_LOADING: true
};

// 📊 Structured data for SEO
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

/**
 * Generate meta tags for SEO
 * @returns {string} HTML meta tags
 */
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

/**
 * Configuration Manager Class
 */
export class ConfigManager {
  constructor() {
    this.config = {
      site: siteConfig,
      animation: ANIMATION_CONFIG,
      theme: THEME_CONFIG,
      pwa: PWA_CONFIG,
      performance: PERFORMANCE_CONFIG,
      interaction: INTERACTION_CONFIG,
      analytics: ANALYTICS_CONFIG,
      i18n: I18N_CONFIG,
      seo: SEO_CONFIG,
      dev: DEV_CONFIG,
      breakpoints: BREAKPOINTS,
      featureFlags: FEATURE_FLAGS
    };
  }

  /**
   * Get configuration value by path
   * @param {string} path - Dot notation path (e.g., 'animation.DURATION')
   * @returns {any} Configuration value
   */
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }

  /**
   * Check if feature is enabled
   * @param {string} feature - Feature name
   * @returns {boolean} Whether feature is enabled
   */
  isFeatureEnabled(feature) {
    return this.config.featureFlags[feature] === true;
  }

  /**
   * Get responsive breakpoint
   * @param {string} size - Breakpoint size (XS, SM, MD, LG, XL, XXL)
   * @returns {number} Breakpoint value in pixels
   */
  getBreakpoint(size) {
    return this.config.breakpoints[size.toUpperCase()];
  }

  /**
   * Get theme configuration
   * @param {string} theme - Theme name
   * @returns {Object} Theme configuration
   */
  getThemeConfig(theme) {
    return this.config.theme.THEMES[theme.toUpperCase()];
  }

  /**
   * Get animation class
   * @param {string} animation - Animation name
   * @returns {string} Animation CSS class
   */
  getAnimationClass(animation) {
    return this.config.animation.CLASSES?.[animation.toUpperCase()] || animation;
  }

  /**
   * Get all configuration
   * @returns {Object} Complete configuration object
   */
  getAll() {
    return this.config;
  }

  /**
   * Update configuration value
   * @param {string} path - Dot notation path
   * @param {any} value - New value
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.config);
    target[lastKey] = value;
  }

  /**
   * Log configuration info (development only)
   */
  logInfo() {
    if (this.config.dev.DEBUG) {
      console.group('🎯 Configuration Info');
      console.log('📊 Feature Flags:', this.config.featureFlags);
      console.log('🎨 Theme:', this.config.theme.THEMES);
      console.log('📱 Breakpoints:', this.config.breakpoints);
      console.log('⚡ Performance:', this.config.performance);
      console.groupEnd();
    }
  }
}

// Create and export singleton instance
export const configManager = new ConfigManager();

// Export all individual configs for backward compatibility
export default {
  siteConfig,
  ANIMATION_CONFIG,
  ANIMATION_CLASSES,
  THEME_CONFIG,
  PWA_CONFIG,
  PERFORMANCE_CONFIG,
  INTERACTION_CONFIG,
  ANALYTICS_CONFIG,
  I18N_CONFIG,
  SEO_CONFIG,
  DEV_CONFIG,
  BREAKPOINTS,
  FEATURE_FLAGS,
  structuredData,
  generateMetaTags,
  configManager
};

// Auto-export to window for easy debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.configManager = configManager;
  configManager.logInfo();
}