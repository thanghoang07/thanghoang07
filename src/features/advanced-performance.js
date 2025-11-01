/**
 * 📊 Advanced Performance Manager
 * Comprehensive performance monitoring and optimization system
 */

import { FeatureManager } from '../core/base-manager.js';
import { PERFORMANCE_CONFIG, DEV_CONFIG } from '../core/config.js';
import { Logger, PerformanceUtils, StorageUtils } from '../utils/index.js';

class AdvancedPerformanceManager extends FeatureManager {
  constructor() {
    super('Performance Manager', {
      autoStart: true,
      storage: true,
      debug: DEV_CONFIG.DEBUG
    });
    
    // Performance metrics storage
    this.metrics = {
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
      },
      resourceTiming: [],
      userTiming: [],
      navigationTiming: null
    };
    
    // Performance observers
    this.observers = new Map();
    
    // Performance budget
    this.budget = {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      firstPaint: 1500,
      firstContentfulPaint: 1800,
      timeToInteractive: 3000,
      totalBlockingTime: 300
    };
    
    // Monitoring intervals
    this.monitoringInterval = null;
    this.reportingInterval = null;
    
    // Performance history for trends
    this.performanceHistory = [];
    this.maxHistorySize = 100;
  }

  async onInit() {
    this.debug('Initializing Performance Manager...');
    
    try {
      // Setup Core Web Vitals monitoring
      this.setupCoreWebVitalsMonitoring();
      
      // Setup custom metrics monitoring
      this.setupCustomMetricsMonitoring();
      
      // Setup resource timing monitoring
      this.setupResourceTimingMonitoring();
      
      // Setup user timing monitoring
      this.setupUserTimingMonitoring();
      
      // Setup navigation timing
      this.setupNavigationTiming();
      
      // Start continuous monitoring
      this.startContinuousMonitoring();
      
      // Setup performance budget alerts
      this.setupPerformanceBudgetAlerts();
      
      // Create performance dashboard
      this.createPerformanceDashboard();
      
      Logger.success('Performance Manager initialized with Core Web Vitals monitoring');
      
    } catch (error) {
      Logger.error('Failed to initialize Performance Manager:', error);
      throw error;
    }
  }

  setupCoreWebVitalsMonitoring() {
    if (!('PerformanceObserver' in window)) {
      Logger.warning('PerformanceObserver not supported');
      return;
    }

    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.coreWebVitals.lcp = lastEntry.startTime;
        this.checkPerformanceBudget('lcp', lastEntry.startTime);
        this.emit('lcp', lastEntry.startTime);
        
        this.debug(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.addObserver('lcp', lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.coreWebVitals.fid = fid;
          this.checkPerformanceBudget('fid', fid);
          this.emit('fid', fid);
          
          this.debug(`FID: ${fid.toFixed(2)}ms`);
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.addObserver('fid', fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.metrics.coreWebVitals.cls = clsValue;
        this.checkPerformanceBudget('cls', clsValue);
        this.emit('cls', clsValue);
        
        this.debug(`CLS: ${clsValue.toFixed(4)}`);
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.addObserver('cls', clsObserver);

    } catch (error) {
      Logger.error('Failed to setup Core Web Vitals monitoring:', error);
    }
  }

  setupCustomMetricsMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Paint timing
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.name === 'first-paint') {
            this.metrics.customMetrics.firstPaint = entry.startTime;
            this.emit('firstPaint', entry.startTime);
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.customMetrics.firstContentfulPaint = entry.startTime;
            this.emit('firstContentfulPaint', entry.startTime);
          }
        });
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });
      this.addObserver('paint', paintObserver);

      // Time to Interactive (TTI) approximation
      this.calculateTimeToInteractive();

      // Total Blocking Time (TBT)
      this.calculateTotalBlockingTime();

    } catch (error) {
      Logger.error('Failed to setup custom metrics monitoring:', error);
    }
  }

  setupResourceTimingMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          const resourceData = {
            name: entry.name,
            type: entry.initiatorType,
            size: entry.transferSize || 0,
            duration: entry.duration,
            startTime: entry.startTime,
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            ssl: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
            ttfb: entry.responseStart - entry.requestStart,
            download: entry.responseEnd - entry.responseStart
          };
          
          this.metrics.resourceTiming.push(resourceData);
          this.analyzeResourcePerformance(resourceData);
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.addObserver('resource', resourceObserver);

    } catch (error) {
      Logger.error('Failed to setup resource timing monitoring:', error);
    }
  }

  setupUserTimingMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const userTimingObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.metrics.userTiming.push({
            name: entry.name,
            type: entry.entryType,
            startTime: entry.startTime,
            duration: entry.duration || 0
          });
        });
      });
      
      userTimingObserver.observe({ entryTypes: ['measure', 'mark'] });
      this.addObserver('userTiming', userTimingObserver);

    } catch (error) {
      Logger.error('Failed to setup user timing monitoring:', error);
    }
  }

  setupNavigationTiming() {
    if (!performance.timing) return;

    const timing = performance.timing;
    this.metrics.navigationTiming = {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ssl: timing.secureConnectionStart > 0 ? timing.connectEnd - timing.secureConnectionStart : 0,
      ttfb: timing.responseStart - timing.requestStart,
      download: timing.responseEnd - timing.responseStart,
      domParsing: timing.domInteractive - timing.responseEnd,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      windowLoad: timing.loadEventEnd - timing.navigationStart
    };
  }

  calculateTimeToInteractive() {
    // Simplified TTI calculation
    const observer = new PerformanceObserver((list) => {
      const longTasks = list.getEntries();
      if (longTasks.length === 0) {
        // No long tasks, approximate TTI as DOMContentLoaded + buffer
        const dcl = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        this.metrics.customMetrics.timeToInteractive = dcl + 50;
      } else {
        // Last long task end time + buffer
        const lastLongTask = longTasks[longTasks.length - 1];
        this.metrics.customMetrics.timeToInteractive = lastLongTask.startTime + lastLongTask.duration + 50;
      }
    });
    
    if ('PerformanceObserver' in window) {
      try {
        observer.observe({ entryTypes: ['longtask'] });
        this.addObserver('longtask', observer);
      } catch (error) {
        // Longtask API not supported
        const dcl = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        this.metrics.customMetrics.timeToInteractive = dcl + 50;
      }
    }
  }

  calculateTotalBlockingTime() {
    let totalBlockingTime = 0;
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 50) {
          totalBlockingTime += entry.duration - 50;
        }
      });
      
      this.metrics.customMetrics.totalBlockingTime = totalBlockingTime;
    });
    
    if ('PerformanceObserver' in window) {
      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // Longtask API not supported
        this.metrics.customMetrics.totalBlockingTime = 0;
      }
    }
  }

  checkPerformanceBudget(metric, value) {
    const budget = this.budget[metric];
    if (!budget) return;
    
    const isWithinBudget = value <= budget;
    const status = isWithinBudget ? 'success' : 'warning';
    
    this.emit('budgetCheck', {
      metric,
      value,
      budget,
      isWithinBudget,
      percentage: (value / budget) * 100
    });
    
    if (!isWithinBudget) {
      Logger.warning(`Performance budget exceeded for ${metric}: ${value.toFixed(2)} > ${budget}`);
    }
  }

  analyzeResourcePerformance(resource) {
    // Check for slow resources
    if (resource.duration > 1000) {
      Logger.warning(`Slow resource detected: ${resource.name} (${resource.duration.toFixed(2)}ms)`);
    }
    
    // Check for large resources
    if (resource.size > 500 * 1024) { // 500KB
      Logger.warning(`Large resource detected: ${resource.name} (${(resource.size / 1024).toFixed(2)}KB)`);
    }
    
    // Check for render-blocking resources
    if (resource.type === 'stylesheet' || resource.type === 'script') {
      if (resource.duration > 200) {
        Logger.warning(`Potentially render-blocking resource: ${resource.name}`);
      }
    }
  }

  startContinuousMonitoring() {
    // Monitor performance every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.collectPerformanceSnapshot();
    }, 30000);
    
    // Report performance every 5 minutes
    this.reportingInterval = setInterval(() => {
      this.generatePerformanceReport();
    }, 300000);
  }

  collectPerformanceSnapshot() {
    const snapshot = {
      timestamp: Date.now(),
      coreWebVitals: { ...this.metrics.coreWebVitals },
      customMetrics: { ...this.metrics.customMetrics },
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
    
    this.performanceHistory.push(snapshot);
    
    // Keep history size manageable
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift();
    }
    
    this.saveState();
  }

  generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      summary: this.getPerformanceSummary(),
      trends: this.getPerformanceTrends(),
      recommendations: this.getPerformanceRecommendations(),
      budgetStatus: this.getBudgetStatus()
    };
    
    this.emit('performanceReport', report);
    Logger.info('Performance report generated', report);
    
    return report;
  }

  getPerformanceSummary() {
    return {
      coreWebVitals: this.metrics.coreWebVitals,
      customMetrics: this.metrics.customMetrics,
      resourceCount: this.metrics.resourceTiming.length,
      totalResourceSize: this.metrics.resourceTiming.reduce((sum, r) => sum + r.size, 0),
      averageResourceDuration: this.metrics.resourceTiming.length > 0 
        ? this.metrics.resourceTiming.reduce((sum, r) => sum + r.duration, 0) / this.metrics.resourceTiming.length 
        : 0
    };
  }

  getPerformanceTrends() {
    if (this.performanceHistory.length < 2) return null;
    
    const recent = this.performanceHistory.slice(-10);
    const trends = {};
    
    ['lcp', 'fid', 'cls'].forEach(metric => {
      const values = recent.map(h => h.coreWebVitals[metric]).filter(v => v !== null);
      if (values.length > 1) {
        const first = values[0];
        const last = values[values.length - 1];
        trends[metric] = {
          direction: last > first ? 'increasing' : 'decreasing',
          change: ((last - first) / first) * 100
        };
      }
    });
    
    return trends;
  }

  getPerformanceRecommendations() {
    const recommendations = [];
    
    // LCP recommendations
    if (this.metrics.coreWebVitals.lcp > this.budget.lcp) {
      recommendations.push({
        metric: 'LCP',
        issue: 'Slow Largest Contentful Paint',
        suggestions: [
          'Optimize largest image or text block',
          'Implement critical CSS',
          'Use resource preloading',
          'Optimize server response times'
        ]
      });
    }
    
    // FID recommendations
    if (this.metrics.coreWebVitals.fid > this.budget.fid) {
      recommendations.push({
        metric: 'FID',
        issue: 'Slow First Input Delay',
        suggestions: [
          'Break up long-running JavaScript tasks',
          'Use web workers for heavy computations',
          'Implement code splitting',
          'Defer non-critical JavaScript'
        ]
      });
    }
    
    // CLS recommendations
    if (this.metrics.coreWebVitals.cls > this.budget.cls) {
      recommendations.push({
        metric: 'CLS',
        issue: 'High Cumulative Layout Shift',
        suggestions: [
          'Reserve space for images and ads',
          'Avoid inserting content above existing content',
          'Use CSS aspect-ratio for media',
          'Preload web fonts'
        ]
      });
    }
    
    return recommendations;
  }

  getBudgetStatus() {
    const status = {};
    
    Object.entries(this.budget).forEach(([metric, budget]) => {
      const value = this.metrics.coreWebVitals[metric] || this.metrics.customMetrics[metric];
      if (value !== null && value !== undefined) {
        status[metric] = {
          value,
          budget,
          isWithinBudget: value <= budget,
          percentage: (value / budget) * 100
        };
      }
    });
    
    return status;
  }

  setupPerformanceBudgetAlerts() {
    this.on('budgetCheck', (data) => {
      if (!data.isWithinBudget && data.percentage > 120) {
        this.showPerformanceAlert(data);
      }
    });
  }

  showPerformanceAlert(data) {
    if (!DEV_CONFIG.DEBUG) return;
    
    const alert = document.createElement('div');
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fee2e2;
      color: #991b1b;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #fecaca;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
    `;
    
    alert.innerHTML = `
      <strong>⚠️ Performance Budget Exceeded</strong><br>
      ${data.metric.toUpperCase()}: ${data.value.toFixed(2)} > ${data.budget}<br>
      <small>${data.percentage.toFixed(1)}% of budget</small>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }

  createPerformanceDashboard() {
    if (!DEV_CONFIG.DEBUG) return;
    
    const dashboard = document.createElement('div');
    dashboard.id = 'performance-dashboard';
    dashboard.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 16px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
      max-width: 300px;
      display: none;
    `;
    
    dashboard.innerHTML = `
      <div id="perf-toggle" style="cursor: pointer; margin-bottom: 8px;">📊 Performance</div>
      <div id="perf-content" style="display: none;">
        <div id="perf-cwv"></div>
        <div id="perf-custom"></div>
        <div id="perf-budget"></div>
      </div>
    `;
    
    document.body.appendChild(dashboard);
    
    // Toggle functionality
    dashboard.querySelector('#perf-toggle').addEventListener('click', () => {
      const content = dashboard.querySelector('#perf-content');
      const isVisible = content.style.display !== 'none';
      content.style.display = isVisible ? 'none' : 'block';
      dashboard.style.display = 'block';
    });
    
    // Update dashboard every 2 seconds
    setInterval(() => {
      this.updatePerformanceDashboard();
    }, 2000);
    
    // Show dashboard initially
    setTimeout(() => {
      dashboard.style.display = 'block';
    }, 3000);
  }

  updatePerformanceDashboard() {
    const cwvEl = document.getElementById('perf-cwv');
    const customEl = document.getElementById('perf-custom');
    const budgetEl = document.getElementById('perf-budget');
    
    if (!cwvEl) return;
    
    const { coreWebVitals, customMetrics } = this.metrics;
    const budgetStatus = this.getBudgetStatus();
    
    cwvEl.innerHTML = `
      <strong>Core Web Vitals:</strong><br>
      LCP: ${coreWebVitals.lcp ? coreWebVitals.lcp.toFixed(0) + 'ms' : '...'}<br>
      FID: ${coreWebVitals.fid ? coreWebVitals.fid.toFixed(0) + 'ms' : '...'}<br>
      CLS: ${coreWebVitals.cls ? coreWebVitals.cls.toFixed(3) : '...'}
    `;
    
    customEl.innerHTML = `
      <strong>Custom Metrics:</strong><br>
      FCP: ${customMetrics.firstContentfulPaint ? customMetrics.firstContentfulPaint.toFixed(0) + 'ms' : '...'}<br>
      TTI: ${customMetrics.timeToInteractive ? customMetrics.timeToInteractive.toFixed(0) + 'ms' : '...'}
    `;
    
    const budgetViolations = Object.values(budgetStatus).filter(s => !s.isWithinBudget).length;
    budgetEl.innerHTML = `
      <strong>Budget:</strong> ${budgetViolations > 0 ? '❌' : '✅'} ${budgetViolations} violations
    `;
  }

  // Public API methods
  mark(name) {
    performance.mark(name);
  }

  measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark);
  }

  getMetrics() {
    return this.metrics;
  }

  getPerformanceScore() {
    const { coreWebVitals } = this.metrics;
    let score = 100;
    
    // LCP scoring
    if (coreWebVitals.lcp) {
      if (coreWebVitals.lcp > 4000) score -= 40;
      else if (coreWebVitals.lcp > 2500) score -= 20;
    }
    
    // FID scoring
    if (coreWebVitals.fid) {
      if (coreWebVitals.fid > 300) score -= 40;
      else if (coreWebVitals.fid > 100) score -= 20;
    }
    
    // CLS scoring
    if (coreWebVitals.cls) {
      if (coreWebVitals.cls > 0.25) score -= 20;
      else if (coreWebVitals.cls > 0.1) score -= 10;
    }
    
    return Math.max(0, score);
  }

  // Override base class methods
  getState() {
    return {
      ...super.getState(),
      performanceHistory: this.performanceHistory.slice(-10), // Save last 10 snapshots
      budget: this.budget
    };
  }

  setState(state) {
    super.setState(state);
    
    if (state.performanceHistory) {
      this.performanceHistory = state.performanceHistory;
    }
    
    if (state.budget) {
      this.budget = { ...this.budget, ...state.budget };
    }
  }

  onDestroy() {
    // Clear intervals
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
    }
    
    // Remove dashboard
    const dashboard = document.getElementById('performance-dashboard');
    if (dashboard) {
      dashboard.remove();
    }
    
    super.onDestroy();
  }

  static checkSupport() {
    return 'performance' in window && 'PerformanceObserver' in window;
  }
}

// Singleton instance
let performanceManagerInstance = null;

export function initAdvancedPerformance() {
  if (performanceManagerInstance) {
    Logger.warning('Advanced Performance Manager already initialized');
    return performanceManagerInstance;
  }

  try {
    performanceManagerInstance = new AdvancedPerformanceManager();
    performanceManagerInstance.init();
    
    // Make globally accessible
    window.performanceManager = performanceManagerInstance;
    
    return performanceManagerInstance;
    
  } catch (error) {
    Logger.error('Failed to initialize Advanced Performance Manager:', error);
    return null;
  }
}

export { AdvancedPerformanceManager };
export default { initAdvancedPerformance, AdvancedPerformanceManager };