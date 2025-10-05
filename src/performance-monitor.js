/**
 * Real-time Performance Monitor for Browser
 */

class BrowserPerformanceMonitor {
  constructor() {
    this.metrics = {
      navigation: {},
      paint: {},
      layout: {},
      resources: [],
      vitals: {}
    };
    
    this.observers = [];
    this.isMonitoring = false;
    this.perfEntries = [];
    
    this.init();
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
    
    this.startMonitoring();
  }

  setupNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            this.metrics.navigation = {
              dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
              tcp: Math.round(navigation.connectEnd - navigation.connectStart),
              ssl: navigation.secureConnectionStart > 0 ? 
                   Math.round(navigation.connectEnd - navigation.secureConnectionStart) : 0,
              ttfb: Math.round(navigation.responseStart - navigation.requestStart),
              download: Math.round(navigation.responseEnd - navigation.responseStart),
              domParse: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
              domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
              windowLoad: Math.round(navigation.loadEventEnd - navigation.navigationStart),
              total: Math.round(navigation.loadEventEnd - navigation.navigationStart)
            };
          }
        }, 1000);
      });
    }
  }

  setupPaintTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.paint.fcp = Math.round(entry.startTime);
            } else if (entry.name === 'first-paint') {
              this.metrics.paint.fp = Math.round(entry.startTime);
            }
          });
        });
        
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('Paint timing not supported:', error);
      }
    }
  }

  setupLayoutShiftObserver() {
    if ('PerformanceObserver' in window) {
      try {
        let cls = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              const firstSessionEntry = sessionEntries[0];
              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
              
              if (sessionValue &&
                  entry.startTime - lastSessionEntry.startTime < 1000 &&
                  entry.startTime - firstSessionEntry.startTime < 5000) {
                sessionValue += entry.value;
                sessionEntries.push(entry);
              } else {
                sessionValue = entry.value;
                sessionEntries = [entry];
              }
              
              if (sessionValue > cls) {
                cls = sessionValue;
                this.metrics.vitals.cls = Number(cls.toFixed(4));
              }
            }
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('Layout shift observation not supported:', error);
      }
    }
  }

  setupLargestContentfulPaint() {
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.vitals.lcp = Math.round(lastEntry.startTime);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observation not supported:', error);
      }
    }
  }

  setupFirstInputDelay() {
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'first-input') {
              this.metrics.vitals.fid = Math.round(entry.processingStart - entry.startTime);
            }
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observation not supported:', error);
      }
    }
  }

  setupResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.initiatorType && entry.duration > 0) {
              this.metrics.resources.push({
                name: entry.name.split('/').pop(),
                type: entry.initiatorType,
                size: entry.transferSize || 0,
                duration: Math.round(entry.duration),
                startTime: Math.round(entry.startTime)
              });
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource timing not supported:', error);
      }
    }
  }

  setupCustomMetrics() {
    // Track custom performance marks
    if ('performance' in window && 'mark' in performance) {
      // Mark when critical sections load
      document.addEventListener('DOMContentLoaded', () => {
        performance.mark('dom-ready');
      });
      
      window.addEventListener('load', () => {
        performance.mark('window-loaded');
        
        // Measure time to interactive (TTI approximation)
        setTimeout(() => {
          const tti = this.calculateTTI();
          this.metrics.vitals.tti = tti;
          performance.mark('tti-calculated');
        }, 100);
      });
    }
  }

  calculateTTI() {
    // Simple TTI calculation based on main thread activity
    if (!('performance' in window)) return 0;
    
    const navigation = performance.getEntriesByType('navigation')[0];
    if (!navigation) return 0;
    
    // Use DOMContentLoaded + a buffer as TTI approximation
    return Math.round(navigation.domContentLoadedEventEnd + 50);
  }

  startMonitoring() {
    this.isMonitoring = true;
    
    // Start periodic collection
    this.monitoringInterval = setInterval(() => {
      this.collectCurrentMetrics();
    }, 1000);
    
    // Monitor performance budget
    setTimeout(() => {
      this.checkPerformanceBudget();
    }, 3000);
  }

  collectCurrentMetrics() {
    // Get memory usage if available
    if (performance.memory) {
      this.metrics.memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    
    // Get frame timing if available
    this.collectFrameMetrics();
  }

  collectFrameMetrics() {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback((deadline) => {
        this.metrics.idle = {
          timeRemaining: Math.round(deadline.timeRemaining()),
          didTimeout: deadline.didTimeout
        };
      });
    }
  }

  checkPerformanceBudget() {
    const budgets = {
      fcp: 1800,  // ms
      lcp: 2500,  // ms
      fid: 100,   // ms
      cls: 0.1,   // score
      tti: 3800   // ms
    };
    
    const results = {};
    
    Object.entries(budgets).forEach(([metric, budget]) => {
      const value = this.metrics.vitals[metric] || this.metrics.paint[metric];
      if (value !== undefined) {
        results[metric] = {
          value: value,
          budget: budget,
          passed: metric === 'cls' ? value <= budget : value <= budget,
          ratio: metric === 'cls' ? value / budget : value / budget
        };
      }
    });
    
    this.metrics.budgetCheck = results;
    
    // Log warnings for failed budgets
    Object.entries(results).forEach(([metric, result]) => {
      if (!result.passed) {
        console.warn(`⚠️ Performance budget exceeded for ${metric.toUpperCase()}: ${result.value} > ${result.budget}`);
      }
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo()
    };
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    return null;
  }

  generateReport() {
    const metrics = this.getMetrics();
    
    console.group('🚀 Performance Report');
    
    // Core Web Vitals
    console.group('⚡ Core Web Vitals');
    if (metrics.paint.fcp) {
      console.log(`🎨 First Contentful Paint: ${metrics.paint.fcp}ms`);
    }
    if (metrics.vitals.lcp) {
      console.log(`🖼️ Largest Contentful Paint: ${metrics.vitals.lcp}ms`);
    }
    if (metrics.vitals.fid) {
      console.log(`👆 First Input Delay: ${metrics.vitals.fid}ms`);
    }
    if (metrics.vitals.cls) {
      console.log(`📐 Cumulative Layout Shift: ${metrics.vitals.cls}`);
    }
    if (metrics.vitals.tti) {
      console.log(`⚡ Time to Interactive: ${metrics.vitals.tti}ms`);
    }
    console.groupEnd();
    
    // Navigation Timing
    if (Object.keys(metrics.navigation).length > 0) {
      console.group('🔄 Navigation Timing');
      Object.entries(metrics.navigation).forEach(([key, value]) => {
        console.log(`${key}: ${value}ms`);
      });
      console.groupEnd();
    }
    
    // Memory Usage
    if (metrics.memory) {
      console.group('💾 Memory Usage');
      console.log(`Used: ${metrics.memory.used}MB`);
      console.log(`Total: ${metrics.memory.total}MB`);
      console.log(`Limit: ${metrics.memory.limit}MB`);
      console.log(`Usage: ${Math.round(metrics.memory.used / metrics.memory.total * 100)}%`);
      console.groupEnd();
    }
    
    // Performance Budget
    if (metrics.budgetCheck) {
      console.group('📊 Performance Budget');
      Object.entries(metrics.budgetCheck).forEach(([metric, result]) => {
        const status = result.passed ? '✅' : '❌';
        console.log(`${status} ${metric.toUpperCase()}: ${result.value} (budget: ${result.budget})`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
    
    return metrics;
  }

  exportReport() {
    const metrics = this.getMetrics();
    const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  createDashboard() {
    // Create floating performance dashboard
    const dashboard = document.createElement('div');
    dashboard.id = 'performance-dashboard';
    dashboard.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
    `;
    
    dashboard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <strong>Performance Monitor</strong>
        <button id="perf-close" style="background: none; border: none; color: white; cursor: pointer;">×</button>
      </div>
      <div id="perf-metrics"></div>
      <button id="perf-export" style="width: 100%; margin-top: 10px; padding: 5px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Export Report
      </button>
    `;
    
    document.body.appendChild(dashboard);
    
    // Update dashboard every 2 seconds
    const updateDashboard = () => {
      const metricsDiv = dashboard.querySelector('#perf-metrics');
      const metrics = this.getMetrics();
      
      let html = '';
      
      if (metrics.paint.fcp) html += `FCP: ${metrics.paint.fcp}ms<br>`;
      if (metrics.vitals.lcp) html += `LCP: ${metrics.vitals.lcp}ms<br>`;
      if (metrics.vitals.fid) html += `FID: ${metrics.vitals.fid}ms<br>`;
      if (metrics.vitals.cls) html += `CLS: ${metrics.vitals.cls}<br>`;
      if (metrics.memory) html += `Memory: ${metrics.memory.used}MB<br>`;
      
      metricsDiv.innerHTML = html;
    };
    
    this.dashboardInterval = setInterval(updateDashboard, 2000);
    updateDashboard();
    
    // Event listeners
    dashboard.querySelector('#perf-close').addEventListener('click', () => {
      dashboard.remove();
      clearInterval(this.dashboardInterval);
    });
    
    dashboard.querySelector('#perf-export').addEventListener('click', () => {
      this.exportReport();
    });
  }

  cleanup() {
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    if (this.dashboardInterval) {
      clearInterval(this.dashboardInterval);
    }
    
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    const dashboard = document.getElementById('performance-dashboard');
    if (dashboard) {
      dashboard.remove();
    }
  }
}

// Auto-initialize in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.performanceMonitor = new BrowserPerformanceMonitor();
  
  // Add keyboard shortcut to show dashboard (Ctrl+Shift+P)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      if (!document.getElementById('performance-dashboard')) {
        window.performanceMonitor.createDashboard();
      }
    }
  });
  
  // Add console commands
  window.perf = {
    report: () => window.performanceMonitor.generateReport(),
    export: () => window.performanceMonitor.exportReport(),
    dashboard: () => window.performanceMonitor.createDashboard(),
    metrics: () => window.performanceMonitor.getMetrics()
  };
  
  console.log('🚀 Performance Monitor loaded! Use Ctrl+Shift+P to show dashboard or perf.report() in console.');
}

export default BrowserPerformanceMonitor;