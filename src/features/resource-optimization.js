/**
 * ⚡ Resource Optimization Manager
 * Advanced resource loading and optimization strategies
 */

import { FeatureManager } from '../core/base-manager.js';
import { PERFORMANCE_CONFIG } from '../core/config.js';
import { Logger, DeviceUtils, NetworkUtils } from '../utils/index.js';

class ResourceOptimizationManager extends FeatureManager {
  constructor() {
    super('Resource Optimization', {
      autoStart: true,
      storage: false,
      debug: true
    });
    
    // Resource loading strategies
    this.loadingStrategies = {
      critical: [], // Above-the-fold resources
      important: [], // Important but not critical
      lazy: [], // Below-the-fold resources
      prefetch: [] // Future page resources
    };
    
    // Performance hints
    this.resourceHints = new Set();
    
    // Image optimization settings
    this.imageOptimization = {
      formats: ['avif', 'webp', 'jpg'],
      sizes: [320, 640, 768, 1024, 1280, 1536],
      quality: {
        high: 85,
        medium: 75,
        low: 60
      }
    };
    
    // Critical CSS extraction
    this.criticalCSS = '';
    this.aboveFoldHeight = 800;
    
    // Connection-aware loading
    this.connectionAware = true;
    this.connectionInfo = null;
  }

  async onInit() {
    this.debug('Initializing Resource Optimization...');
    
    try {
      // Detect connection quality
      this.detectConnectionQuality();
      
      // Extract and inline critical CSS
      await this.extractCriticalCSS();
      
      // Setup resource preloading
      this.setupResourcePreloading();
      
      // Setup lazy loading
      this.setupLazyLoading();
      
      // Setup prefetching
      this.setupPrefetching();
      
      // Setup image optimization
      this.setupImageOptimization();
      
      // Setup font optimization
      this.setupFontOptimization();
      
      // Monitor resource performance
      this.monitorResourcePerformance();
      
      Logger.success('Resource Optimization initialized');
      
    } catch (error) {
      Logger.error('Failed to initialize Resource Optimization:', error);
      throw error;
    }
  }

  detectConnectionQuality() {
    if (!navigator.connection) {
      this.connectionInfo = { effectiveType: '4g', downlink: 10, rtt: 100 };
      return;
    }
    
    this.connectionInfo = {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    };
    
    // Listen for connection changes
    navigator.connection.addEventListener('change', () => {
      this.connectionInfo = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
      
      this.adaptToConnection();
    });
    
    this.debug('Connection detected:', this.connectionInfo);
  }

  adaptToConnection() {
    const { effectiveType, saveData } = this.connectionInfo;
    
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      // Aggressive optimization for slow connections
      this.enableDataSaverMode();
    } else if (effectiveType === '3g') {
      // Moderate optimization
      this.enableModerateOptimization();
    } else {
      // Full quality for fast connections
      this.enableFullQuality();
    }
  }

  enableDataSaverMode() {
    this.debug('Enabling data saver mode');
    
    // Reduce image quality
    document.documentElement.setAttribute('data-connection', 'slow');
    
    // Disable non-essential animations
    document.documentElement.style.setProperty('--animation-duration', '0s');
    
    // Defer non-critical resources
    this.deferNonCriticalResources();
    
    this.emit('dataSaverEnabled');
  }

  enableModerateOptimization() {
    this.debug('Enabling moderate optimization');
    
    document.documentElement.setAttribute('data-connection', 'moderate');
    
    // Reduce animation complexity
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
    
    this.emit('moderateOptimizationEnabled');
  }

  enableFullQuality() {
    this.debug('Enabling full quality');
    
    document.documentElement.setAttribute('data-connection', 'fast');
    
    // Full animations
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    
    this.emit('fullQualityEnabled');
  }

  async extractCriticalCSS() {
    // This would typically be done at build time, but we can do basic extraction
    const criticalSelectors = [
      // Layout
      'body', 'html', 'main', 'header', 'nav',
      // Above-the-fold content
      '.hero', '.header', '.navigation', '.intro',
      // Critical components
      '.theme-controls', '.loading-screen',
      // Typography
      'h1', 'h2', 'p', 'a',
      // Utility classes that might be critical
      '.container', '.wrapper', '.grid', '.flex'
    ];
    
    let criticalRules = [];
    
    // Extract critical CSS from stylesheets
    for (const stylesheet of document.styleSheets) {
      try {
        if (stylesheet.cssRules) {
          for (const rule of stylesheet.cssRules) {
            if (rule.type === CSSRule.STYLE_RULE) {
              const selector = rule.selectorText;
              if (criticalSelectors.some(cs => selector.includes(cs))) {
                criticalRules.push(rule.cssText);
              }
            }
          }
        }
      } catch (error) {
        // Cross-origin stylesheet, skip
        continue;
      }
    }
    
    this.criticalCSS = criticalRules.join('\n');
    
    // Inline critical CSS if it's small enough
    if (this.criticalCSS.length < 14000) { // 14KB limit
      this.inlineCriticalCSS();
    }
  }

  inlineCriticalCSS() {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = this.criticalCSS;
    
    // Insert before any other stylesheets
    const firstLink = document.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      firstLink.parentNode.insertBefore(style, firstLink);
    } else {
      document.head.appendChild(style);
    }
    
    this.debug('Critical CSS inlined:', this.criticalCSS.length + ' bytes');
  }

  setupResourcePreloading() {
    // Define critical resources to preload
    const criticalResources = [
      // Fonts
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      // Hero images
      { href: '/images/hero-bg.webp', as: 'image', type: 'image/webp' },
      // Critical CSS (if external)
      { href: '/css/critical.css', as: 'style' }
    ];
    
    criticalResources.forEach(resource => {
      this.preloadResource(resource);
    });
    
    // Preload based on user interaction hints
    this.setupInteractionPreloading();
  }

  preloadResource(resource) {
    if (this.resourceHints.has(resource.href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    
    document.head.appendChild(link);
    this.resourceHints.add(resource.href);
    
    this.debug('Preloaded resource:', resource.href);
  }

  setupInteractionPreloading() {
    // Preload resources on hover/focus
    const preloadOnInteraction = [
      { selector: 'a[href^="/projects"]', resource: '/js/projects.js' },
      { selector: 'a[href^="/contact"]', resource: '/js/contact.js' },
      { selector: '.theme-btn', resource: '/js/themes.js' }
    ];
    
    preloadOnInteraction.forEach(({ selector, resource }) => {
      document.addEventListener('mouseover', (e) => {
        if (e.target.matches(selector)) {
          this.prefetchResource(resource);
        }
      }, { once: true });
    });
  }

  prefetchResource(href) {
    if (this.resourceHints.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
    this.resourceHints.add(href);
    
    this.debug('Prefetched resource:', href);
  }

  setupLazyLoading() {
    // Enhanced lazy loading with Intersection Observer
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    this.addObserver('lazyImages', imageObserver);
  }

  loadImage(img) {
    // Implement responsive image loading
    const dataSrc = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (dataSrc) {
      // Check if we should load optimized version based on connection
      const optimizedSrc = this.getOptimizedImageSrc(dataSrc);
      img.src = optimizedSrc;
    }
    
    if (srcset) {
      img.srcset = srcset;
    }
    
    img.classList.add('loaded');
    this.debug('Lazy loaded image:', img.src);
  }

  getOptimizedImageSrc(src) {
    const { effectiveType, saveData } = this.connectionInfo;
    
    // Return optimized version based on connection
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      // Very low quality for slow connections
      return src.replace(/\.(jpg|jpeg|png)$/, '-low.$1');
    } else if (effectiveType === '3g') {
      // Medium quality for 3G
      return src.replace(/\.(jpg|jpeg|png)$/, '-medium.$1');
    }
    
    // High quality for fast connections
    return src;
  }

  setupPrefetching() {
    // Prefetch next page resources
    const prefetchTargets = [
      '/js/chunks/about.js',
      '/js/chunks/projects.js',
      '/js/chunks/contact.js'
    ];
    
    // Delay prefetching until page is loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        prefetchTargets.forEach(target => {
          this.prefetchResource(target);
        });
      }, 2000);
    });
  }

  setupImageOptimization() {
    // Add picture element support for modern formats
    this.addModernImageSupport();
    
    // Setup responsive images
    this.setupResponsiveImages();
  }

  addModernImageSupport() {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach(img => {
      if (img.src.match(/\.(jpg|jpeg|png)$/)) {
        this.convertToModernFormats(img);
      }
    });
  }

  convertToModernFormats(img) {
    const src = img.src;
    const alt = img.alt;
    
    // Create picture element
    const picture = document.createElement('picture');
    
    // Add AVIF source
    if (this.supportsFormat('avif')) {
      const avifSource = document.createElement('source');
      avifSource.srcset = src.replace(/\.(jpg|jpeg|png)$/, '.avif');
      avifSource.type = 'image/avif';
      picture.appendChild(avifSource);
    }
    
    // Add WebP source
    if (this.supportsFormat('webp')) {
      const webpSource = document.createElement('source');
      webpSource.srcset = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      webpSource.type = 'image/webp';
      picture.appendChild(webpSource);
    }
    
    // Add original image as fallback
    const fallbackImg = img.cloneNode(true);
    fallbackImg.setAttribute('data-optimized', 'true');
    picture.appendChild(fallbackImg);
    
    // Replace original image
    img.parentNode.replaceChild(picture, img);
  }

  supportsFormat(format) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const formats = {
      webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
      avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
    };
    
    try {
      return canvas.toDataURL(formats[format]).indexOf(`data:image/${format}`) === 0;
    } catch {
      return false;
    }
  }

  setupResponsiveImages() {
    const images = document.querySelectorAll('img:not([data-responsive])');
    
    images.forEach(img => {
      this.makeResponsive(img);
    });
  }

  makeResponsive(img) {
    const src = img.src;
    if (!src.match(/\.(jpg|jpeg|png|webp)$/)) return;
    
    // Generate srcset for different viewport sizes
    const srcset = this.imageOptimization.sizes.map(size => {
      const responsiveSrc = src.replace(/\.(jpg|jpeg|png|webp)$/, `-${size}w.$1`);
      return `${responsiveSrc} ${size}w`;
    }).join(', ');
    
    img.srcset = srcset;
    img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    img.setAttribute('data-responsive', 'true');
  }

  setupFontOptimization() {
    // Preload critical fonts
    const criticalFonts = [
      '/fonts/inter-var-latin.woff2'
    ];
    
    criticalFonts.forEach(font => {
      this.preloadResource({
        href: font,
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous'
      });
    });
    
    // Add font-display: swap to improve LCP
    this.addFontDisplaySwap();
  }

  addFontDisplaySwap() {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url('/fonts/inter-var-latin.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
    `;
    document.head.appendChild(style);
  }

  deferNonCriticalResources() {
    // Defer non-critical CSS
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    nonCriticalCSS.forEach(link => {
      link.media = 'print';
      link.onload = function() {
        this.media = 'all';
      };
    });
    
    // Defer non-critical JavaScript
    const nonCriticalJS = document.querySelectorAll('script:not([data-critical])');
    nonCriticalJS.forEach(script => {
      if (script.src && !script.async && !script.defer) {
        script.defer = true;
      }
    });
  }

  monitorResourcePerformance() {
    if (!('PerformanceObserver' in window)) return;
    
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        this.analyzeResourceTiming(entry);
      });
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.addObserver('resourceTiming', resourceObserver);
  }

  analyzeResourceTiming(entry) {
    const { name, duration, transferSize, initiatorType } = entry;
    
    // Check for slow resources
    if (duration > 1000) {
      Logger.warning(`Slow resource: ${name} (${duration.toFixed(2)}ms)`);
      this.emit('slowResource', { name, duration, type: initiatorType });
    }
    
    // Check for large resources
    if (transferSize > 500 * 1024) {
      Logger.warning(`Large resource: ${name} (${(transferSize / 1024).toFixed(2)}KB)`);
      this.emit('largeResource', { name, size: transferSize, type: initiatorType });
    }
    
    // Track render-blocking resources
    if (initiatorType === 'css' || initiatorType === 'script') {
      if (duration > 200) {
        this.emit('renderBlocking', { name, duration, type: initiatorType });
      }
    }
  }

  // Public API methods
  optimizeImage(img, options = {}) {
    const config = { ...this.imageOptimization, ...options };
    
    if (config.lazy) {
      this.setupLazyLoadingForElement(img);
    }
    
    if (config.responsive) {
      this.makeResponsive(img);
    }
    
    if (config.modernFormats) {
      this.convertToModernFormats(img);
    }
  }

  preloadCriticalResources(resources) {
    resources.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  getOptimizationRecommendations() {
    return {
      images: this.getImageOptimizationRecommendations(),
      fonts: this.getFontOptimizationRecommendations(),
      css: this.getCSSOptimizationRecommendations(),
      js: this.getJSOptimizationRecommendations()
    };
  }

  getImageOptimizationRecommendations() {
    const images = document.querySelectorAll('img');
    const recommendations = [];
    
    images.forEach(img => {
      if (!img.hasAttribute('data-responsive')) {
        recommendations.push({
          element: img,
          issue: 'Missing responsive images',
          solution: 'Add srcset and sizes attributes'
        });
      }
      
      if (!img.hasAttribute('loading') && !img.hasAttribute('data-src')) {
        recommendations.push({
          element: img,
          issue: 'Missing lazy loading',
          solution: 'Add loading="lazy" attribute'
        });
      }
    });
    
    return recommendations;
  }

  getFontOptimizationRecommendations() {
    // This would analyze @font-face declarations
    return [{
      issue: 'Font loading optimization',
      solution: 'Use font-display: swap and preload critical fonts'
    }];
  }

  getCSSOptimizationRecommendations() {
    return [{
      issue: 'Critical CSS extraction',
      solution: 'Extract and inline above-the-fold CSS'
    }];
  }

  getJSOptimizationRecommendations() {
    return [{
      issue: 'JavaScript bundling',
      solution: 'Implement code splitting and lazy loading'
    }];
  }

  static checkSupport() {
    return 'IntersectionObserver' in window && 'performance' in window;
  }
}

// Singleton instance
let resourceOptimizationInstance = null;

export function initResourceOptimization() {
  if (resourceOptimizationInstance) {
    Logger.warning('Resource Optimization already initialized');
    return resourceOptimizationInstance;
  }

  try {
    resourceOptimizationInstance = new ResourceOptimizationManager();
    resourceOptimizationInstance.init();
    
    // Make globally accessible
    window.resourceOptimization = resourceOptimizationInstance;
    
    return resourceOptimizationInstance;
    
  } catch (error) {
    Logger.error('Failed to initialize Resource Optimization:', error);
    return null;
  }
}

export { ResourceOptimizationManager };
export default { initResourceOptimization, ResourceOptimizationManager };