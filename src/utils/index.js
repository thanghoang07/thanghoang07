/**
 * 🛠️ Core Utilities
 * Essential utility functions for the portfolio application
 */

import { ANIMATION_CLASSES, PERFORMANCE_CONFIG, DEV_CONFIG } from '../core/config.js';

// 🎯 Animation Utilities
export class AnimationUtils {
  static resetAnimationClasses(element) {
    const classesToRemove = Object.values(ANIMATION_CLASSES);
    element.classList.remove(...classesToRemove);
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
}

// ⏱️ Performance Utilities
export class PerformanceUtils {
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
    
    if (DEV_CONFIG.PERFORMANCE_MONITORING) {
      console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }
}

// 📱 Device Utilities
export class DeviceUtils {
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

// 🎨 DOM Utilities
export class DOMUtils {
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
      } else {
        element.appendChild(child);
      }
    });
    
    return element;
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

  static smoothScrollTo(target, duration = 1000) {
    const targetElement = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
      
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop;
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

    requestAnimationFrame(animation);
  }
}

// 🎯 Event Utilities
export class EventUtils {
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

// 💾 Storage Utilities
export class StorageUtils {
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

// 🔧 Logger Utility
export class Logger {
  static log(message, data = null, level = 'info') {
    if (!DEV_CONFIG.DEBUG && level === 'debug') return;

    const styles = DEV_CONFIG.CONSOLE_STYLING;
    const timestamp = new Date().toLocaleTimeString();
    
    const prefix = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: '📝',
      debug: '🔧'
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

// 🌐 Network Utilities
export class NetworkUtils {
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

// Export all utilities as default
export default {
  AnimationUtils,
  PerformanceUtils,
  DeviceUtils,
  DOMUtils,
  EventUtils,
  StorageUtils,
  Logger,
  NetworkUtils
};