/**
 * 🛠️ Unified Utilities System
 * Consolidated utility functions for performance and maintainability
 */

/**
 * 🎯 Animation Utilities
 */
class AnimationUtils {
  static resetAnimationClasses(element) {
    const animationClasses = ['animate-in', 'fade-in-up', 'fade-in-left', 'fade-in-right', 'fade-in-scale'];
    element.classList.remove(...animationClasses);
  }

  static addStaggeredAnimation(elements, animationClass, delay = 150) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(animationClass);
      }, index * delay);
    });
  }

  static createScrollReveal(element, options = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const config = { ...defaultOptions, ...options };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, config);
    
    observer.observe(element);
    return observer;
  }

  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  static slideDown(element, duration = 300) {
    element.style.maxHeight = '0';
    element.style.overflow = 'hidden';
    element.style.transition = `max-height ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.maxHeight = element.scrollHeight + 'px';
    });
  }

  static staggerAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-in');
      }, index * delay);
    });
  }
}

/**
 * ⚡ Performance Utilities
 */
class PerformanceUtils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static requestIdleCallback(callback, options = {}) {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, options);
    } else {
      return setTimeout(callback, 1);
    }
  }

  static measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }

  static preloadResource(href, as, crossorigin = false) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  static loadCriticalCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => link.media = 'all';
    document.head.appendChild(link);
  }

  static optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const supportsWebP = (() => {
      try {
        return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } catch(err) {
        return false;
      }
    })();

    images.forEach(img => {
      if (supportsWebP && img.dataset.webp) {
        img.dataset.src = img.dataset.webp;
      }
    });
  }

  static loadModuleWhenNeeded(modulePath, condition) {
    if (condition()) {
      return import(modulePath);
    }
    return Promise.resolve();
  }

  static cleanupEventListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
  }
}

/**
 * 📱 Device Utilities
 */
class DeviceUtils {
  static isMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static isTablet() {
    return /iPad|Android(?=.*Tablet)|Windows NT.*Touch/i.test(navigator.userAgent);
  }

  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
  }

  static getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  static supportsFeature(feature) {
    const features = {
      webp: () => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      },
      avif: () => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
      },
      intersectionObserver: () => 'IntersectionObserver' in window,
      serviceWorker: () => 'serviceWorker' in navigator,
      pushManager: () => 'PushManager' in window,
      notifications: () => 'Notification' in window
    };

    return features[feature] ? features[feature]() : false;
  }
}

/**
 * 🎨 DOM Utilities
 */
class DOMUtils {
  static createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });

    return element;
  }

  static batchDOMUpdates(updates) {
    const fragment = document.createDocumentFragment();
    updates.forEach(update => {
      if (typeof update === 'function') {
        update();
      } else if (update.element && update.content) {
        update.element.innerHTML = update.content;
      }
    });
    return fragment;
  }

  static lazyLoad(selector, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.tagName === 'IMG' && element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
          }
          
          if (element.hasAttribute('data-lazy')) {
            element.classList.add('lazy-loaded');
          }

          if (options.callback) {
            options.callback(element);
          }

          observer.unobserve(element);
        }
      });
    }, defaultOptions);

    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });

    return observer;
  }

  static waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  static isElementInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.bottom >= threshold &&
      rect.top <= viewHeight - threshold &&
      rect.right >= threshold &&
      rect.left <= viewWidth - threshold
    );
  }

  static isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  static smoothScrollTo(target, duration = 1000, offset = 0) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;

    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuart(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t * t + b;
      t -= 2;
      return -c / 2 * (t * t * t * t - 2) + b;
    }

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // Memory efficient event delegation
  static delegate(parent, eventType, selector, handler) {
    parent.addEventListener(eventType, (event) => {
      const target = event.target.closest(selector);
      if (target) {
        handler.call(target, event);
      }
    });
  }

  // CSS class utilities
  static addClass(elements, className) {
    const els = Array.isArray(elements) ? elements : [elements];
    els.forEach(el => el && el.classList.add(className));
  }

  static removeClass(elements, className) {
    const els = Array.isArray(elements) ? elements : [elements];
    els.forEach(el => el && el.classList.remove(className));
  }

  static toggleClass(elements, className) {
    const els = Array.isArray(elements) ? elements : [elements];
    els.forEach(el => el && el.classList.toggle(className));
  }
}

/**
 * 🎯 Event Utilities
 */
class EventUtils {
  static once(element, event, callback) {
    const handler = (e) => {
      callback(e);
      element.removeEventListener(event, handler);
    };
    element.addEventListener(event, handler);
  }

  static delegate(parent, selector, event, callback) {
    parent.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        callback(e);
      }
    });
  }

  static createCustomEvent(name, detail = {}) {
    return new CustomEvent(name, {
      detail,
      bubbles: true,
      cancelable: true
    });
  }

  static waitForEvent(element, eventName, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const handler = (event) => {
        element.removeEventListener(eventName, handler);
        resolve(event);
      };

      element.addEventListener(eventName, handler);

      setTimeout(() => {
        element.removeEventListener(eventName, handler);
        reject(new Error(`Event ${eventName} not fired within ${timeout}ms`));
      }, timeout);
    });
  }
}

/**
 * 💾 Storage Utilities
 */
class StorageUtils {
  static setItem(key, value, storage = localStorage) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Storage setItem failed:', error);
      return false;
    }
  }

  static getItem(key, defaultValue = null, storage = localStorage) {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Storage getItem failed:', error);
      return defaultValue;
    }
  }

  static removeItem(key, storage = localStorage) {
    try {
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Storage removeItem failed:', error);
      return false;
    }
  }

  static clear(storage = localStorage) {
    try {
      storage.clear();
      return true;
    } catch (error) {
      console.warn('Storage clear failed:', error);
      return false;
    }
  }
}

/**
 * 🔧 Logger Utility
 */
class Logger {
  static log(message, data = null, level = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    
    const prefix = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: '📝',
      debug: '🔧'
    };

    const styles = {
      SUCCESS: 'color: #10b981; font-weight: bold;',
      ERROR: 'color: #ef4444; font-weight: bold;',
      WARNING: 'color: #f59e0b; font-weight: bold;',
      INFO: 'color: #3b82f6; font-weight: bold;',
      DEBUG: 'color: #6b7280; font-weight: normal;'
    };
    
    const style = styles[level.toUpperCase()] || styles.INFO;
    
    console.log(
      `%c${prefix[level]} [${timestamp}] ${message}`,
      style,
      data || ''
    );
  }

  static success(message, data) {
    this.log(message, data, 'success');
  }

  static error(message, data) {
    this.log(message, data, 'error');
  }

  static warning(message, data) {
    this.log(message, data, 'warning');
  }

  static info(message, data) {
    this.log(message, data, 'info');
  }

  static debug(message, data) {
    this.log(message, data, 'debug');
  }
}

/**
 * 🌐 Network Utilities
 */
class NetworkUtils {
  static isOnline() {
    return navigator.onLine;
  }

  static getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    } : null;
  }

  static async fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }
}

/**
 * 🌍 Translation Utilities
 */
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
    specializedSubtitle: "Chuyên môn",
    portfolioSubtitle: "Dự án tiêu biểu",
    workexp: "Kinh nghiệm làm việc",
    workexpSubtitle: "Lộ trình nghề nghiệp",
    skillIbmTitle: "Phát triển IBM BPM",
    skillMobileTitle: "Phát triển Mobile", 
    skillIotTitle: "Phát triển IoT",
    ux: "Phát triển ứng dụng IBM BPM với JavaScript và Java, thiết kế giao diện theo gui-spec.",
    webdev: "Phát triển ứng dụng mobile cross-platform bằng Xamarin.Forms cho iOS/Android.",
    webdesign: "Phát triển ứng dụng IoT và kết nối Azure IoT hub cho thiết bị tùy biến.",
    projectAgencyTitle: "Website Agency",
    projectAgencyCategory: "Thiết kế Web",
    projectDashboardTitle: "Nền tảng Dashboard",
    projectDashboardCategory: "Phát triển Web",
    projectEcommerceTitle: "Website Thương mại điện tử",
    projectEcommerceCategory: "Thiết kế UX",
    // Thêm các key khác nếu cần...
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
    specializedSubtitle: "Specialized",
    portfolioSubtitle: "My Works",
    workexp: "Work Experience",
    workexpSubtitle: "Career Path",
    skillIbmTitle: "IBM BPM Development",
    skillMobileTitle: "Mobile Development",
    skillIotTitle: "IoT Development", 
    ux: "IBM BPM application development with JavaScript and Java, designing interfaces according to gui-spec.",
    webdev: "Cross-platform mobile app development using Xamarin.Forms for iOS/Android.",
    webdesign: "IoT application development and Azure IoT hub integration for custom devices.",
    projectAgencyTitle: "Agency Website",
    projectAgencyCategory: "Web Design",
    projectDashboardTitle: "Dashboard Platform", 
    projectDashboardCategory: "Web Development",
    projectEcommerceTitle: "E-commerce Website",
    projectEcommerceCategory: "UX Design",
    // Thêm các key khác nếu cần...
  }
};

const idsMap = {
  "nav-services": "services",
  "nav-portfolio": "portfolio", 
  "nav-experience": "experience",
  "nav-blog": "blog",
  "nav-resume": "resume",
  "hero-mynameis": "myNameIs",
  "hero-name": "name",
  "hero-intro": "intro",
  "specialized-title": "specialized",
  "specialized-subtitle": "specializedSubtitle",
  "portfolio-title": "portfolioSubtitle",
  "portfolio-subtitle": "portfolioSubtitle",
  "workexp-title": "workexp",
  "workexp-subtitle": "workexpSubtitle",
  "skill-ibm-title": "skillIbmTitle",
  "skill-mobile-title": "skillMobileTitle",
  "skill-iot-title": "skillIotTitle",
  "ux-desc": "ux",
  "webdev-desc": "webdev", 
  "webdesign-desc": "webdesign",
  "project-agency-title": "projectAgencyTitle",
  "project-agency-category": "projectAgencyCategory",
  "project-dashboard-title": "projectDashboardTitle",
  "project-dashboard-category": "projectDashboardCategory", 
  "project-ecommerce-title": "projectEcommerceTitle",
  "project-ecommerce-category": "projectEcommerceCategory"
  // Thêm các mapping khác nếu cần...
};

class TranslationUtils {
  static currentLanguage = 'en';

  static init() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
    
    // Apply initial translation
    this.applyTranslation(this.currentLanguage);
    
    // Set up language toggle
    this.setupLanguageToggle();
  }

  static setupLanguageToggle() {
    const toggleLanguageBtn = document.getElementById('toggle-language');
    const langViIcon = document.getElementById('lang-vi-icon');
    const langEnIcon = document.getElementById('lang-en-icon');
    
    if (toggleLanguageBtn) {
      toggleLanguageBtn.addEventListener('click', () => {
        // Toggle language
        this.currentLanguage = this.currentLanguage === 'vi' ? 'en' : 'vi';
        
        // Update icons - hiển thị icon của ngôn ngữ hiện tại
        if (this.currentLanguage === 'vi') {
          langViIcon?.classList.remove('hidden');
          langEnIcon?.classList.add('hidden');
        } else {
          langViIcon?.classList.add('hidden');
          langEnIcon?.classList.remove('hidden');
        }
        
        // Apply translation
        this.applyTranslation(this.currentLanguage);
        
        // Save preference
        localStorage.setItem('language', this.currentLanguage);
      });
    }
    
    // Set initial icon state
    if (this.currentLanguage === 'vi') {
      langViIcon?.classList.remove('hidden');
      langEnIcon?.classList.add('hidden');
    } else {
      langViIcon?.classList.add('hidden');
      langEnIcon?.classList.remove('hidden');
    }
  }

  static applyTranslation(language) {
    // Use idsMap to translate elements
    for (const [id, key] of Object.entries(idsMap)) {
      const element = document.getElementById(id);
      if (element && translations[language] && translations[language][key]) {
        // Handle different element types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translations[language][key];
        } else {
          element.textContent = translations[language][key];
        }
      }
    }
  }

  static getCurrentLanguage() {
    return this.currentLanguage;
  }

  static translate(key, language = this.currentLanguage) {
    return translations[language]?.[key] || key;
  }
}

// Export everything as named exports for modularity
export {
  AnimationUtils,
  PerformanceUtils,
  DeviceUtils,
  DOMUtils,
  EventUtils,
  StorageUtils,
  Logger,
  NetworkUtils,
  TranslationUtils
};

// Export as default for backward compatibility
export default {
  AnimationUtils,
  PerformanceUtils,
  DeviceUtils,
  DOMUtils,
  EventUtils,
  StorageUtils,
  Logger,
  NetworkUtils,
  TranslationUtils
};

console.log('🛠️ Unified utilities loaded');
