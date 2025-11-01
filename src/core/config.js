/**
 * 🎯 Application Constants & Configuration
 * Centralized configuration for the entire portfolio application
 */

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

export default {
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
  FEATURE_FLAGS
};