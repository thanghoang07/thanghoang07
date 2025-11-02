/**
 * ⚡ Unified Performance System
 * Comprehensive performance monitoring, optimization and resource management
 */

import { FeatureManager } from '../core/base-manager.js';
import { PERFORMANCE_CONFIG, DEV_CONFIG } from '../unified-config.js';
import { Logger, PerformanceUtils, StorageUtils, DeviceUtils, NetworkUtils } from '../utils/index.js';

/**
 * 📊 Performance Monitoring Component
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      navigation: {},
      paint: {},
      layout: {},
      resources: [],
      vitals: {},
      coreWebVitals: {
        lcp: null,
        fid: null,
        cls: null
      },
      customMetrics: {
        firstPaint: null,
        firstContentfulPaint: null,
        timeToInteractive: null,
        totalBlockingTime: null
      }
    };
    
    this.observers = [];
    this.isMonitoring = false;
    this.perfEntries = [];
  }

  init() {
    if (typeof window === 'undefined') return;
    
    this.setupNavigationTiming();
    this.setupPaintTiming();
    this.setupLayoutShiftObserver();
    this.setupLargestContentfulPaint();
    this.setupFirstInputDelay();
    this.setupResourceTiming();
    this.setupCustomMetrics();
    
    this.isMonitoring = true;
    Logger.info('📊 Performance monitoring initialized');
  }

  setupNavigationTiming() {
    if (!performance.timing) return;
    
    const timing = performance.timing;
    this.metrics.navigation = {
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnect: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      domProcessing: timing.loadEventStart - timing.domLoading,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart
    };
  }

  setupPaintTiming() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.paint.firstPaint = entry.startTime;
            this.metrics.customMetrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.paint.firstContentfulPaint = entry.startTime;
            this.metrics.customMetrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      Logger.warning('Paint timing not supported:', error);
    }
  }

  setupLayoutShiftObserver() {
    if (!('PerformanceObserver' in window)) return;

    try {
      let cumulativeScore = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cumulativeScore += entry.value;
          }
        }
        this.metrics.vitals.cls = cumulativeScore;
        this.metrics.coreWebVitals.cls = cumulativeScore;
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      Logger.warning('Layout shift monitoring not supported:', error);
    }
  }

  setupLargestContentfulPaint() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.vitals.lcp = lastEntry.startTime;
        this.metrics.coreWebVitals.lcp = lastEntry.startTime;
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      Logger.warning('LCP monitoring not supported:', error);
    }
  }

  setupFirstInputDelay() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.vitals.fid = fid;
          this.metrics.coreWebVitals.fid = fid;
        }
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      Logger.warning('FID monitoring not supported:', error);
    }
  }

  setupResourceTiming() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.resources.push({
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            type: this.getResourceType(entry.name)
          });
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      Logger.warning('Resource timing not supported:', error);
    }
  }

  setupCustomMetrics() {
    // Time to Interactive estimation
    setTimeout(() => {
      if (document.readyState === 'complete') {
        this.metrics.customMetrics.timeToInteractive = performance.now();
      }
    }, 0);

    // Total Blocking Time (simplified estimation)
    let totalBlockingTime = 0;
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              totalBlockingTime += entry.duration - 50;
            }
          }
          this.metrics.customMetrics.totalBlockingTime = totalBlockingTime;
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.push(observer);
      } catch (error) {
        Logger.warning('Long task monitoring not supported:', error);
      }
    }
  }

  getResourceType(url) {
    if (url.match(/\.(js)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    return 'other';
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

/**
 * 🚀 Resource Optimization Component
 */
class ResourceOptimizer {
  constructor() {
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
      quality: 85,
      lazy: true,
      placeholder: true
    };
  }

  init() {
    this.optimizeImages();
    this.setupResourceHints();
    this.setupLazyLoading();
    this.setupPreloading();
    this.optimizeCSS();
    this.optimizeJS();
    
    Logger.info('🚀 Resource optimization initialized');
  }

  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add loading="lazy" if not set
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
      
      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async';
      }
      
      // Setup intersection observer for advanced lazy loading
      if (img.hasAttribute('data-src')) {
        this.setupImageLazyLoading(img);
      }
    });
  }

  setupImageLazyLoading(img) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          const src = image.getAttribute('data-src');
          
          if (src) {
            // Create new image to preload
            const newImg = new Image();
            newImg.onload = () => {
              image.src = src;
              image.removeAttribute('data-src');
              image.classList.add('loaded');
            };
            newImg.src = src;
          }
          
          observer.unobserve(image);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    observer.observe(img);
  }

  setupResourceHints() {
    // DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdnjs.cloudflare.com'
    ];
    
    externalDomains.forEach(domain => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href*="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = `//${domain}`;
        document.head.appendChild(link);
      }
    });
  }

  setupLazyLoading() {
    // Lazy load non-critical resources
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    if (lazyElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const src = element.getAttribute('data-lazy');
          
          if (src) {
            if (element.tagName === 'IMG') {
              element.src = src;
            } else if (element.tagName === 'IFRAME') {
              element.src = src;
            }
            
            element.removeAttribute('data-lazy');
            element.classList.add('lazy-loaded');
          }
          
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });
    
    lazyElements.forEach(el => observer.observe(el));
  }

  setupPreloading() {
    // Preload critical resources
    const criticalResources = [
      { href: '/css/critical.css', as: 'style', type: 'text/css' },
      { href: '/js/main.js', as: 'script', type: 'text/javascript' }
    ];
    
    criticalResources.forEach(resource => {
      if (!document.querySelector(`link[rel="preload"][href="${resource.href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        document.head.appendChild(link);
      }
    });
  }

  optimizeCSS() {
    // Remove unused CSS (basic implementation)
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    stylesheets.forEach(sheet => {
      // Add media="print" onload trick for non-critical CSS
      if (sheet.hasAttribute('data-non-critical')) {
        sheet.media = 'print';
        sheet.onload = function() {
          this.media = 'all';
        };
      }
    });
  }

  optimizeJS() {
    // Defer non-critical JavaScript
    const scripts = document.querySelectorAll('script[data-defer]');
    
    scripts.forEach(script => {
      if (!script.defer && !script.async) {
        script.defer = true;
      }
    });
  }

  // Resource loading priorities
  loadCritical(resources) {
    resources.forEach(resource => {
      this.loadingStrategies.critical.push(resource);
      this.loadResource(resource, 'high');
    });
  }

  loadImportant(resources) {
    resources.forEach(resource => {
      this.loadingStrategies.important.push(resource);
      this.loadResource(resource, 'medium');
    });
  }

  loadLazy(resources) {
    resources.forEach(resource => {
      this.loadingStrategies.lazy.push(resource);
      this.loadResource(resource, 'low');
    });
  }

  loadResource(resource, priority = 'medium') {
    if (resource.type === 'script') {
      this.loadScript(resource.url, priority);
    } else if (resource.type === 'style') {
      this.loadStylesheet(resource.url, priority);
    } else if (resource.type === 'image') {
      this.loadImage(resource.url, priority);
    }
  }

  loadScript(url, priority) {
    const script = document.createElement('script');
    script.src = url;
    script.fetchPriority = priority;
    
    if (priority === 'low') {
      script.defer = true;
    }
    
    document.head.appendChild(script);
  }

  loadStylesheet(url, priority) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.fetchPriority = priority;
    
    document.head.appendChild(link);
  }

  loadImage(url, priority) {
    const img = new Image();
    img.fetchPriority = priority;
    img.src = url;
  }
}

/**
 * 📈 Performance Analytics Component
 */
class PerformanceAnalytics {
  constructor() {
    this.data = [];
    this.thresholds = {
      lcp: 2500, // Good: < 2.5s
      fid: 100,  // Good: < 100ms
      cls: 0.1   // Good: < 0.1
    };
  }

  recordMetric(name, value, timestamp = Date.now()) {
    this.data.push({
      name,
      value,
      timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  analyzePerformance(metrics) {
    const analysis = {
      score: 0,
      issues: [],
      recommendations: []
    };

    // Analyze Core Web Vitals
    if (metrics.coreWebVitals.lcp) {
      if (metrics.coreWebVitals.lcp > this.thresholds.lcp) {
        analysis.issues.push('LCP is too slow');
        analysis.recommendations.push('Optimize largest contentful paint');
      }
    }

    if (metrics.coreWebVitals.fid) {
      if (metrics.coreWebVitals.fid > this.thresholds.fid) {
        analysis.issues.push('FID is too high');
        analysis.recommendations.push('Reduce JavaScript execution time');
      }
    }

    if (metrics.coreWebVitals.cls) {
      if (metrics.coreWebVitals.cls > this.thresholds.cls) {
        analysis.issues.push('CLS is too high');
        analysis.recommendations.push('Avoid layout shifts');
      }
    }

    // Calculate performance score
    analysis.score = this.calculatePerformanceScore(metrics);

    return analysis;
  }

  calculatePerformanceScore(metrics) {
    let score = 100;
    
    // Deduct points for poor metrics
    if (metrics.coreWebVitals.lcp > this.thresholds.lcp) {
      score -= 20;
    }
    if (metrics.coreWebVitals.fid > this.thresholds.fid) {
      score -= 20;
    }
    if (metrics.coreWebVitals.cls > this.thresholds.cls) {
      score -= 20;
    }

    return Math.max(0, score);
  }

  generateReport(metrics) {
    const analysis = this.analyzePerformance(metrics);
    
    return {
      timestamp: Date.now(),
      url: window.location.href,
      metrics: metrics,
      analysis: analysis,
      deviceInfo: {
        userAgent: navigator.userAgent,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink
        } : null,
        memory: navigator.deviceMemory || null,
        cores: navigator.hardwareConcurrency || null
      }
    };
  }
}

/**
 * 🎯 Unified Performance Manager
 */
class UnifiedPerformanceManager extends FeatureManager {
  constructor() {
    super('Unified Performance', {
      autoStart: true,
      storage: true,
      debug: DEV_CONFIG.DEBUG
    });
    
    this.monitor = new PerformanceMonitor();
    this.optimizer = new ResourceOptimizer();
    this.analytics = new PerformanceAnalytics();
    
    this.reportInterval = null;
    this.isActive = false;
  }

  async onInit() {
    try {
      // Initialize components
      this.monitor.init();
      this.optimizer.init();
      
      // Setup periodic reporting
      this.setupPeriodicReporting();
      
      // Setup performance optimizations based on device
      this.setupDeviceOptimizations();
      
      // Setup network-aware optimizations
      this.setupNetworkOptimizations();
      
      this.isActive = true;
      Logger.success('⚡ Unified Performance Manager initialized');
      
    } catch (error) {
      Logger.error('Failed to initialize Performance Manager:', error);
      throw error;
    }
  }

  setupPeriodicReporting() {
    // Report metrics every 30 seconds
    this.reportInterval = setInterval(() => {
      const metrics = this.monitor.getMetrics();
      const report = this.analytics.generateReport(metrics);
      
      if (this.options.debug) {
        Logger.info('📊 Performance Report:', report);
      }
      
      // Store report
      this.storeReport(report);
      
    }, 30000);
  }

  setupDeviceOptimizations() {
    // Optimize based on device capabilities
    if (DeviceUtils.isMobile()) {
      // Mobile optimizations
      this.optimizer.imageOptimization.quality = 75;
      Logger.info('📱 Mobile optimizations applied');
    }
    
    if (DeviceUtils.isLowEndDevice()) {
      // Low-end device optimizations
      this.optimizer.imageOptimization.lazy = true;
      Logger.info('⚡ Low-end device optimizations applied');
    }
  }

  setupNetworkOptimizations() {
    // Optimize based on network conditions
    if (NetworkUtils.isSlowConnection()) {
      // Slow connection optimizations
      this.optimizer.imageOptimization.quality = 60;
      Logger.info('🐌 Slow connection optimizations applied');
    }
    
    if (NetworkUtils.isDataSaver()) {
      // Data saver optimizations
      this.optimizer.imageOptimization.lazy = true;
      Logger.info('💾 Data saver optimizations applied');
    }
  }

  storeReport(report) {
    try {
      StorageUtils.setItem('performance-reports', report, {
        expiry: 24 * 60 * 60 * 1000 // 24 hours
      });
    } catch (error) {
      Logger.warning('Failed to store performance report:', error);
    }
  }

  getLastReport() {
    return StorageUtils.getItem('performance-reports');
  }

  getCurrentMetrics() {
    return this.monitor.getMetrics();
  }

  generateFullReport() {
    const metrics = this.monitor.getMetrics();
    return this.analytics.generateReport(metrics);
  }

  optimizeResource(type, resources) {
    switch (type) {
      case 'critical':
        this.optimizer.loadCritical(resources);
        break;
      case 'important':
        this.optimizer.loadImportant(resources);
        break;
      case 'lazy':
        this.optimizer.loadLazy(resources);
        break;
    }
  }

  onDestroy() {
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
    }
    
    this.monitor.destroy();
    this.isActive = false;
    
    Logger.info('⚡ Unified Performance Manager destroyed');
  }

  getState() {
    return {
      ...super.getState(),
      isActive: this.isActive,
      lastReport: this.getLastReport(),
      currentMetrics: this.monitor.getMetrics()
    };
  }
}

// Factory function
export function initUnifiedPerformance() {
  try {
    const manager = new UnifiedPerformanceManager();
    return manager.init().then(() => manager);
  } catch (error) {
    Logger.error('Failed to initialize Unified Performance:', error);
    return null;
  }
}

// Export classes for advanced usage
export {
  UnifiedPerformanceManager,
  PerformanceMonitor,
  ResourceOptimizer,
  PerformanceAnalytics
};

// Default export
export default UnifiedPerformanceManager;