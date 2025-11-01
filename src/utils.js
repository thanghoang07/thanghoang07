// DOM utilities and performance helpers

export class DOMUtils {
  // Efficient element creation with attributes
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

  // Batch DOM updates for better performance
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

  // Debounced event listener
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

  // Throttled event listener
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

  // Lazy loading with Intersection Observer
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
          
          // Handle images
          if (element.tagName === 'IMG' && element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
          }
          
          // Handle sections with data-lazy
          if (element.hasAttribute('data-lazy')) {
            element.classList.add('lazy-loaded');
          }

          // Custom callback
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

  // Performance monitoring
  static measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
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

  // Viewport utilities
  static isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Scroll utilities
  static smoothScrollTo(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Performance optimization utilities
export class PerformanceUtils {
  // Resource loading optimization
  static preloadResource(href, as, crossorigin = false) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // Critical resource loading
  static loadCriticalCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => link.media = 'all';
    document.head.appendChild(link);
  }

  // Image optimization
  static optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    // Use modern image formats when supported
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

  // Bundle splitting simulation
  static loadModuleWhenNeeded(modulePath, condition) {
    if (condition()) {
      return import(modulePath);
    }
    return Promise.resolve();
  }

  // Memory management
  static cleanupEventListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
  }
}

// Animation utilities
export class AnimationUtils {
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

  // Staggered animation helper
  static staggerAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-in');
      }, index * delay);
    });
  }
}