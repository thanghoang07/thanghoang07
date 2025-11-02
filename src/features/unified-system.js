/**
 * 🚀 Unified System Manager
 * Comprehensive system integrating themes, PWA optimization, and analytics
 */

import { UIManager, FeatureManager } from '../core/base-manager.js';
import { THEME_CONFIG, PWA_CONFIG } from '../unified-config.js';
import { Logger, StorageUtils, DOMUtils, DeviceUtils, NetworkUtils } from '../utils/index.js';

/**
 * 🎨 Advanced Theme Manager
 * Comprehensive theme management with dark mode, custom themes, and accessibility
 */
class UnifiedThemeManager extends UIManager {
  constructor() {
    super('Advanced Themes', '.theme-controls', {
      autoRender: true,
      responsive: true,
      storage: true
    });
    
    // Theme configuration
    this.themes = {
      light: {
        name: 'Light',
        icon: '☀️',
        colors: {
          primary: '#9333ea',
          secondary: '#a855f7',
          accent: '#c084fc',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1f2937',
          textSecondary: '#6b7280',
          border: '#e5e7eb'
        }
      },
      dark: {
        name: 'Dark',
        icon: '🌙',
        colors: {
          primary: '#a855f7',
          secondary: '#9333ea',
          accent: '#c084fc',
          background: '#111827',
          surface: '#1f2937',
          text: '#f9fafb',
          textSecondary: '#d1d5db',
          border: '#374151'
        }
      },
      neon: {
        name: 'Neon',
        icon: '⚡',
        colors: {
          primary: '#00ff41',
          secondary: '#ff0080',
          accent: '#00d4ff',
          background: '#0a0a0a',
          surface: '#1a1a1a',
          text: '#ffffff',
          textSecondary: '#b0b0b0',
          border: '#333333'
        }
      },
      nature: {
        name: 'Nature',
        icon: '🌿',
        colors: {
          primary: '#059669',
          secondary: '#065f46',
          accent: '#10b981',
          background: '#f0fdf4',
          surface: '#ecfdf5',
          text: '#064e3b',
          textSecondary: '#047857',
          border: '#bbf7d0'
        }
      }
    };

    this.currentTheme = 'light';
    this.customThemes = new Map();
    this.transitionDuration = 300;
    
    this.init();
  }

  async init() {
    try {
      await this.loadStoredTheme();
      this.detectSystemPreference();
      this.createThemeControls();
      this.setupEventListeners();
      this.applyTheme(this.currentTheme);
      
      Logger.info('Theme Manager initialized', { theme: this.currentTheme });
    } catch (error) {
      Logger.error('Theme Manager initialization failed', error);
    }
  }

  async loadStoredTheme() {
    const stored = StorageUtils.getItem('theme-preference');
    if (stored && this.themes[stored.theme]) {
      this.currentTheme = stored.theme;
    }
  }

  detectSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (!StorageUtils.getItem('theme-preference')) {
        this.currentTheme = 'dark';
      }
    }

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!StorageUtils.getItem('theme-preference')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  createThemeControls() {
    const container = document.querySelector(this.selector);
    if (!container) return;

    const controls = document.createElement('div');
    controls.className = 'theme-selector';
    controls.innerHTML = `
      <div class="theme-options">
        ${Object.entries(this.themes).map(([key, theme]) => `
          <button class="theme-option" data-theme="${key}" title="${theme.name}">
            <span class="theme-icon">${theme.icon}</span>
            <span class="theme-name">${theme.name}</span>
          </button>
        `).join('')}
      </div>
      <div class="theme-customizer">
        <button class="customize-btn">🎨 Customize</button>
      </div>
    `;

    container.appendChild(controls);
  }

  setupEventListeners() {
    // Theme selection
    document.addEventListener('click', (e) => {
      if (e.target.closest('.theme-option')) {
        const theme = e.target.closest('.theme-option').dataset.theme;
        this.setTheme(theme);
      }
      
      if (e.target.closest('.customize-btn')) {
        this.openCustomizer();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        this.toggleTheme();
      }
    });
  }

  setTheme(themeName) {
    if (!this.themes[themeName] && !this.customThemes.has(themeName)) return;

    this.currentTheme = themeName;
    this.applyTheme(themeName);
    this.updateControls();
    this.savePreference();
    
    // Emit theme change event
    this.emit('themeChanged', { theme: themeName });
  }

  applyTheme(themeName) {
    const theme = this.themes[themeName] || this.customThemes.get(themeName);
    if (!theme) return;

    // Apply CSS custom properties
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Update theme attribute
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Animate transition
    document.body.style.transition = `all ${this.transitionDuration}ms ease`;
    setTimeout(() => {
      document.body.style.transition = '';
    }, this.transitionDuration);
  }

  toggleTheme() {
    const themes = Object.keys(this.themes);
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  updateControls() {
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === this.currentTheme);
    });
  }

  savePreference() {
    StorageUtils.setItem('theme-preference', {
      theme: this.currentTheme,
      timestamp: Date.now()
    });
  }

  openCustomizer() {
    // Create theme customizer modal
    const modal = document.createElement('div');
    modal.className = 'theme-customizer-modal';
    modal.innerHTML = `
      <div class="customizer-content">
        <h3>🎨 Theme Customizer</h3>
        <div class="color-inputs">
          ${Object.entries(this.themes[this.currentTheme].colors).map(([key, value]) => `
            <div class="color-input-group">
              <label>${key}</label>
              <input type="color" data-color="${key}" value="${value}">
            </div>
          `).join('')}
        </div>
        <div class="customizer-actions">
          <button class="save-theme">Save Custom Theme</button>
          <button class="close-customizer">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.setupCustomizerEvents(modal);
  }

  setupCustomizerEvents(modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-customizer') || e.target === modal) {
        modal.remove();
      }
      
      if (e.target.classList.contains('save-theme')) {
        this.saveCustomTheme(modal);
      }
    });

    modal.addEventListener('input', (e) => {
      if (e.target.type === 'color') {
        this.previewCustomColor(e.target.dataset.color, e.target.value);
      }
    });
  }

  previewCustomColor(colorKey, value) {
    document.documentElement.style.setProperty(`--color-${colorKey}`, value);
  }

  saveCustomTheme(modal) {
    const colors = {};
    modal.querySelectorAll('input[type="color"]').forEach(input => {
      colors[input.dataset.color] = input.value;
    });

    const customTheme = {
      name: `Custom ${Date.now()}`,
      icon: '🎨',
      colors
    };

    const themeName = `custom-${Date.now()}`;
    this.customThemes.set(themeName, customTheme);
    
    // Save to storage
    const customThemes = StorageUtils.getItem('custom-themes') || {};
    customThemes[themeName] = customTheme;
    StorageUtils.setItem('custom-themes', customThemes);

    this.setTheme(themeName);
    modal.remove();
  }
}

/**
 * 📱 PWA Optimization Manager
 * Advanced Progressive Web App features and caching strategies
 */
class UnifiedPWAManager extends FeatureManager {
  constructor() {
    super('PWA Optimization', {
      autoStart: true,
      storage: true,
      storageKey: 'pwa-optimization',
      debug: true
    });
    
    // Service Worker
    this.swRegistration = null;
    this.swController = null;
    
    // Cache strategies
    this.cacheStrategies = {
      critical: 'cacheFirst',
      static: 'staleWhileRevalidate',
      api: 'networkFirst',
      images: 'cacheFirst'
    };
    
    // Background sync
    this.syncTasks = new Map();
    
    // Install prompt
    this.installPrompt = null;
    
    this.init();
  }

  async init() {
    try {
      await this.registerServiceWorker();
      this.setupInstallPrompt();
      this.setupBackgroundSync();
      this.setupNetworkMonitoring();
      this.setupCacheManagement();
      
      Logger.info('PWA Manager initialized');
    } catch (error) {
      Logger.error('PWA Manager initialization failed', error);
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        this.swRegistration.addEventListener('updatefound', () => {
          this.handleServiceWorkerUpdate();
        });
        
        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event);
        });
        
        Logger.info('Service Worker registered');
      } catch (error) {
        Logger.error('Service Worker registration failed', error);
      }
    }
  }

  handleServiceWorkerUpdate() {
    const newWorker = this.swRegistration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        this.showUpdateNotification();
      }
    });
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <span>🔄 New version available!</span>
        <button class="update-btn">Update Now</button>
        <button class="dismiss-btn">Later</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    notification.querySelector('.update-btn').addEventListener('click', () => {
      this.applyUpdate();
    });
    
    notification.querySelector('.dismiss-btn').addEventListener('click', () => {
      notification.remove();
    });
  }

  applyUpdate() {
    if (this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ action: 'skipWaiting' });
      window.location.reload();
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e;
      this.showInstallButton();
    });
    
    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.hideInstallButton();
      Logger.info('App installed');
    });
  }

  showInstallButton() {
    const button = document.createElement('button');
    button.className = 'pwa-install-btn';
    button.innerHTML = '📱 Install App';
    button.addEventListener('click', () => this.promptInstall());
    
    document.body.appendChild(button);
  }

  async promptInstall() {
    if (this.installPrompt) {
      this.installPrompt.prompt();
      const result = await this.installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        Logger.info('App installation accepted');
      }
      
      this.installPrompt = null;
    }
  }

  setupBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        this.syncRegistration = registration;
      });
    }
  }

  addSyncTask(name, data) {
    this.syncTasks.set(name, data);
    
    if (this.syncRegistration) {
      this.syncRegistration.sync.register(name);
    }
  }

  setupNetworkMonitoring() {
    // Network status monitoring
    window.addEventListener('online', () => {
      this.handleNetworkChange(true);
    });
    
    window.addEventListener('offline', () => {
      this.handleNetworkChange(false);
    });
    
    // Connection quality monitoring
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.handleConnectionChange();
      });
    }
  }

  handleNetworkChange(isOnline) {
    const status = document.createElement('div');
    status.className = `network-status ${isOnline ? 'online' : 'offline'}`;
    status.textContent = isOnline ? '🟢 Back online' : '🔴 Working offline';
    
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 3000);
    
    if (isOnline) {
      this.syncPendingData();
    }
  }

  handleConnectionChange() {
    const connection = navigator.connection;
    const quality = this.getConnectionQuality(connection);
    
    // Adjust resource loading based on connection
    this.optimizeForConnection(quality);
  }

  getConnectionQuality(connection) {
    const { effectiveType, downlink, rtt } = connection;
    
    if (effectiveType === '4g' && downlink > 10) return 'high';
    if (effectiveType === '4g' || effectiveType === '3g') return 'medium';
    return 'low';
  }

  optimizeForConnection(quality) {
    const strategies = {
      high: { imageQuality: 'high', prefetch: true, lazyLoad: false },
      medium: { imageQuality: 'medium', prefetch: false, lazyLoad: true },
      low: { imageQuality: 'low', prefetch: false, lazyLoad: true }
    };
    
    const strategy = strategies[quality];
    this.emit('connectionOptimization', strategy);
  }

  setupCacheManagement() {
    // Periodic cache cleanup
    setInterval(() => {
      this.cleanupCache();
    }, 24 * 60 * 60 * 1000); // Daily
    
    // Cache size monitoring
    this.monitorCacheSize();
  }

  async cleanupCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        !name.startsWith(`${PWA_CONFIG.cachePrefix}-${PWA_CONFIG.version}`)
      );
      
      await Promise.all(oldCaches.map(name => caches.delete(name)));
      Logger.info('Cache cleanup completed', { removed: oldCaches.length });
    }
  }

  async monitorCacheSize() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage / 1024 / 1024; // MB
      const quota = estimate.quota / 1024 / 1024; // MB
      
      Logger.info('Storage usage', { usage: `${usage.toFixed(2)}MB`, quota: `${quota.toFixed(2)}MB` });
      
      if (usage / quota > 0.8) {
        this.showStorageWarning();
      }
    }
  }

  showStorageWarning() {
    const warning = document.createElement('div');
    warning.className = 'storage-warning';
    warning.innerHTML = `
      <div class="warning-content">
        <span>⚠️ Storage almost full</span>
        <button class="clear-cache-btn">Clear Cache</button>
      </div>
    `;
    
    document.body.appendChild(warning);
    
    warning.querySelector('.clear-cache-btn').addEventListener('click', () => {
      this.clearCache();
      warning.remove();
    });
  }

  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      Logger.info('All caches cleared');
    }
  }
}

/**
 * 📊 Unified Analytics Manager
 * Comprehensive analytics with Google Analytics 4, privacy compliance, and custom events
 */
class UnifiedAnalyticsManager extends FeatureManager {
  constructor(measurementId = 'G-XXXXXXXXXX') {
    super('Analytics', {
      autoStart: false,
      storage: true,
      storageKey: 'analytics-consent'
    });
    
    this.measurementId = measurementId;
    this.initialized = false;
    this.consentGiven = false;
    this.eventQueue = [];
    
    this.init();
  }

  async init() {
    try {
      await this.checkConsent();
      
      if (this.consentGiven) {
        await this.initializeAnalytics();
      } else {
        this.showConsentBanner();
      }
      
      this.setupEventListeners();
      Logger.info('Analytics Manager initialized');
    } catch (error) {
      Logger.error('Analytics initialization failed', error);
    }
  }

  async checkConsent() {
    const consent = StorageUtils.getItem('analytics-consent');
    this.consentGiven = consent?.granted === true;
  }

  async initializeAnalytics() {
    if (this.initialized) return;
    
    try {
      await this.loadGtagScript();
      this.setupGtag();
      this.processEventQueue();
      this.setupAutoTracking();
      this.initialized = true;
      
      Logger.info('Analytics initialized');
    } catch (error) {
      Logger.error('Analytics setup failed', error);
    }
  }

  async loadGtagScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  setupGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    gtag('js', new Date());
    gtag('config', this.measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  showConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'analytics-consent-banner';
    banner.innerHTML = `
      <div class="consent-content">
        <div class="consent-text">
          <h4>🍪 Analytics & Cookies</h4>
          <p>We use analytics to improve your experience. No personal data is collected.</p>
        </div>
        <div class="consent-actions">
          <button class="accept-btn">Accept</button>
          <button class="decline-btn">Decline</button>
          <button class="settings-btn">Settings</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    this.setupConsentEvents(banner);
  }

  setupConsentEvents(banner) {
    banner.querySelector('.accept-btn').addEventListener('click', () => {
      this.grantConsent();
      banner.remove();
    });
    
    banner.querySelector('.decline-btn').addEventListener('click', () => {
      this.denyConsent();
      banner.remove();
    });
    
    banner.querySelector('.settings-btn').addEventListener('click', () => {
      this.showConsentSettings();
    });
  }

  async grantConsent() {
    this.consentGiven = true;
    StorageUtils.setItem('analytics-consent', {
      granted: true,
      timestamp: Date.now()
    });
    
    await this.initializeAnalytics();
  }

  denyConsent() {
    this.consentGiven = false;
    StorageUtils.setItem('analytics-consent', {
      granted: false,
      timestamp: Date.now()
    });
  }

  showConsentSettings() {
    const modal = document.createElement('div');
    modal.className = 'consent-settings-modal';
    modal.innerHTML = `
      <div class="settings-content">
        <h3>Privacy Settings</h3>
        <div class="setting-group">
          <label>
            <input type="checkbox" id="essential" checked disabled>
            Essential cookies (Required)
          </label>
          <p>Necessary for the website to function properly.</p>
        </div>
        <div class="setting-group">
          <label>
            <input type="checkbox" id="analytics">
            Analytics cookies
          </label>
          <p>Help us understand how visitors interact with our website.</p>
        </div>
        <div class="settings-actions">
          <button class="save-settings">Save Preferences</button>
          <button class="close-settings">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.setupSettingsEvents(modal);
  }

  setupSettingsEvents(modal) {
    modal.querySelector('.save-settings').addEventListener('click', () => {
      const analyticsEnabled = modal.querySelector('#analytics').checked;
      
      if (analyticsEnabled) {
        this.grantConsent();
      } else {
        this.denyConsent();
      }
      
      modal.remove();
      document.querySelector('.analytics-consent-banner')?.remove();
    });
    
    modal.querySelector('.close-settings').addEventListener('click', () => {
      modal.remove();
    });
  }

  setupEventListeners() {
    // Page view tracking
    this.trackPageView();
    
    // Engagement tracking
    this.setupEngagementTracking();
    
    // Error tracking
    this.setupErrorTracking();
    
    // Performance tracking
    this.setupPerformanceTracking();
  }

  trackPageView(path = window.location.pathname) {
    this.track('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: path
    });
  }

  setupEngagementTracking() {
    // Scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        this.track('scroll', { scroll_depth: scrollPercent });
      }
    });
    
    // Time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      this.track('timing_complete', {
        name: 'time_on_page',
        value: timeOnPage
      });
    });
    
    // Click tracking
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-track]');
      if (target) {
        this.track('click', {
          element_id: target.id || 'unknown',
          element_class: target.className,
          element_text: target.textContent?.trim().substring(0, 100)
        });
      }
    });
  }

  setupErrorTracking() {
    window.addEventListener('error', (e) => {
      this.track('exception', {
        description: e.message,
        fatal: false,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      this.track('exception', {
        description: e.reason?.message || 'Unhandled Promise Rejection',
        fatal: false
      });
    });
  }

  setupPerformanceTracking() {
    // Core Web Vitals
    this.trackCoreWebVitals();
    
    // Resource timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.trackResourceTiming();
      }, 1000);
    });
  }

  trackCoreWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entry = list.getEntries()[0];
      this.track('timing_complete', {
        name: 'FCP',
        value: Math.round(entry.startTime)
      });
    }).observe({ entryTypes: ['paint'] });
    
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.track('timing_complete', {
        name: 'LCP',
        value: Math.round(lastEntry.startTime)
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.track('timing_complete', {
        name: 'CLS',
        value: Math.round(clsValue * 1000)
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  trackResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
    
    this.track('timing_complete', {
      name: 'total_resource_size',
      value: Math.round(totalSize / 1024) // KB
    });
  }

  track(eventName, parameters = {}) {
    const event = {
      name: eventName,
      parameters: {
        ...parameters,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      }
    };
    
    if (this.initialized && this.consentGiven) {
      gtag('event', event.name, event.parameters);
    } else {
      this.eventQueue.push(event);
    }
    
    Logger.debug('Analytics event', event);
  }

  processEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      gtag('event', event.name, event.parameters);
    }
  }

  // Custom event methods
  trackConversion(conversionId, value = 0) {
    this.track('conversion', {
      conversion_id: conversionId,
      value: value
    });
  }

  trackSearch(searchTerm, results = 0) {
    this.track('search', {
      search_term: searchTerm,
      results_count: results
    });
  }

  trackDownload(filename, fileType) {
    this.track('file_download', {
      file_name: filename,
      file_type: fileType
    });
  }

  trackFormSubmission(formName, success = true) {
    this.track('form_submit', {
      form_name: formName,
      success: success
    });
  }
}

/**
 * 🎯 Unified System Manager
 * Orchestrates theme, PWA, and analytics systems
 */
class UnifiedSystemManager extends FeatureManager {
  constructor(config = {}) {
    super('Unified System', {
      autoStart: true,
      storage: true,
      storageKey: 'unified-system'
    });
    
    this.config = {
      measurementId: 'G-XXXXXXXXXX',
      ...config
    };
    
    // Initialize subsystems
    this.themeManager = new UnifiedThemeManager();
    this.pwaManager = new UnifiedPWAManager();
    this.analyticsManager = new UnifiedAnalyticsManager(this.config.measurementId);
    
    this.init();
  }

  async init() {
    try {
      await this.setupIntegrations();
      this.setupGlobalEventListeners();
      
      Logger.info('Unified System initialized');
    } catch (error) {
      Logger.error('Unified System initialization failed', error);
    }
  }

  async setupIntegrations() {
    // Theme-Analytics integration
    this.themeManager.on('themeChanged', (data) => {
      this.analyticsManager.track('theme_change', {
        theme_name: data.theme
      });
    });
    
    // PWA-Analytics integration
    this.pwaManager.on('connectionOptimization', (strategy) => {
      this.analyticsManager.track('connection_optimization', {
        image_quality: strategy.imageQuality,
        prefetch_enabled: strategy.prefetch,
        lazy_load_enabled: strategy.lazyLoad
      });
    });
    
    // System-wide error handling
    this.setupErrorIntegration();
  }

  setupErrorIntegration() {
    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      // Log to analytics
      this.analyticsManager.track('javascript_error', {
        error_message: message,
        source_file: source,
        line_number: lineno,
        column_number: colno
      });
      
      // Call original handler
      if (originalError) {
        originalError.apply(window, arguments);
      }
    };
  }

  setupGlobalEventListeners() {
    // Performance monitoring
    window.addEventListener('load', () => {
      this.trackLoadPerformance();
    });
    
    // Visibility change tracking
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.analyticsManager.track('page_hidden');
      } else {
        this.analyticsManager.track('page_visible');
      }
    });
  }

  trackLoadPerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.analyticsManager.track('page_timing', {
        dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd),
        load_complete: Math.round(navigation.loadEventEnd),
        total_load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart)
      });
    }
  }

  // Public API methods
  setTheme(themeName) {
    return this.themeManager.setTheme(themeName);
  }

  trackEvent(eventName, parameters) {
    return this.analyticsManager.track(eventName, parameters);
  }

  addSyncTask(name, data) {
    return this.pwaManager.addSyncTask(name, data);
  }

  getSystemStatus() {
    return {
      theme: this.themeManager.currentTheme,
      pwaReady: this.pwaManager.swRegistration !== null,
      analyticsEnabled: this.analyticsManager.consentGiven,
      online: navigator.onLine
    };
  }
}

// Export classes and create global instance
export {
  UnifiedThemeManager,
  UnifiedPWAManager,
  UnifiedAnalyticsManager,
  UnifiedSystemManager
};

// Auto-initialize if not in module context
if (typeof window !== 'undefined' && !window.unifiedSystemManager) {
  window.unifiedSystemManager = new UnifiedSystemManager();
}